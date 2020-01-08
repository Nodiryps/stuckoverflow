using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using System.Security.Claims;
using prid1920_g10.Helpers;
using prid1920_g10.Models;
using PRID_Framework;

namespace prid1920_g10.Controllers {
    [Authorize]
    [Route("api/posts")]
    [ApiController]
    public class PostsController : ControllerBase {
        private readonly G10Context _context;

        public PostsController(G10Context context) {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetAll() {
            return (await this.GetQuestions().ToListAsync()).ToDTO();
        }

        private IQueryable<Post> GetQuestions() {
            return (
                from p in _context.Posts
                where p.Title != null
                select p
            );
        }

        [AllowAnonymous]
        [HttpGet("answers/{id}")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetPostsById(int id) {
            var answers = GetAnswers(id);

            if (answers == null)
                return NotFound();
            return (await answers.ToListAsync()).ToDTO();
        }

        private IQueryable<Post> GetAnswers(int i) {
            return (
                from p in _context.Posts
                where p.ParentId == i
                select p
            );
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDTO>> GetPostById(int id) {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();
            return post.ToDTO();
        }

        [AllowAnonymous]
        [HttpGet("tags/{id}")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetPostsByTagId(int id) {
            var posts = GetPosts(id);
            if (posts == null)
                return NotFound();
            Console.WriteLine("POOOSTS: " + posts);
            return (await posts.ToListAsync()).ToDTO();
        }

        private IQueryable<Post> GetPosts(int tagid) {
            var postIds = GetPostIdsFromPostTags(tagid);

            return (from post in _context.Posts
                    join id in postIds on post.Id equals id
                    where id == post.Id
                    select post);
        }

        private IQueryable<int> GetPostIdsFromPostTags(int tagid) {
            return (from pt in _context.PostTags
                    where pt.TagId == tagid
                    select pt.PostId);
        }

        [Authorized(Role.Admin, Role.Member)]
        [HttpPost]
        public async Task<ActionResult<PostDTO>> PostPost(PostDTO data) {
            var postDto = await _context.Posts.FindAsync(data.Id);

            if (postDto != null) {
                var err = new ValidationErrors().Add("Post already in use", nameof(postDto.Title));
                return BadRequest(err);
            }

            var newPost = new Post() {
                Title = data.Title,
                Body = data.Body,
                Timestamp = data.Timestamp,
                ParentId = data.ParentId,
                AuthorId = data.AuthorId,
                AcceptedAnswerId = data.AcceptedAnswerId,
            };

            _context.Posts.Add(newPost);
            await _context.SaveChangesAsyncWithValidation();

            if (data.Tags != null) {
                foreach (var t in data.Tags) {
                    var tag = await _context.Tags.SingleOrDefaultAsync(tg => tg.Name == t.Name);
                    var post = await _context.Posts.SingleOrDefaultAsync(p => p.Id == newPost.Id);

                    var newPostTag = new PostTag() {
                        Post = post,
                        Tag = tag,
                        PostId = post.Id,
                        TagId = tag.Id
                    };

                    _context.PostTags.Add(newPostTag);
                }
            }

            var res = await _context.SaveChangesAsyncWithValidation();

            if (!res.IsEmpty)
                return BadRequest(res);

            return CreatedAtAction(nameof(GetPostById), new { Id = newPost.Id }, newPost.ToDTO());
        }

        // private Post GetParentId() {
        //     this.GetQuestions()
        //         .OrderByDescending(p => p.Id)
        //         .FirstOrDefault();

        // }

        private int GetNewId() {
            return (from p in _context.Posts
                    select p.Id).Max() + 1;
        }

        [Authorized(Role.Admin, Role.Member)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(int id, PostDTO dto) {
            if (id != dto.Id)
                return BadRequest();

            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();

            post.Title = dto.Title;
            post.Body = dto.Body;
            post.AcceptedAnswerId = dto.AcceptedAnswerId;
            // post.Timestamp = DateTime.Now;
            //post.Tags = dto.Tags;

            // if (dto.Tags != null) {
            //     foreach (var t in dto.Tags) {
            //         var tag = await _context.Tags.SingleOrDefaultAsync(tg => tg.Name == t.Name);
            //         var pst = await _context.Posts.SingleOrDefaultAsync(p => p.Id == post.Id);

            //         var newPostTag = new PostTag() {
            //             Post = pst,
            //             Tag = tag,
            //             PostId = pst.Id,
            //             TagId = tag.Id
            //         };

            //         _context.PostTags.Add(newPostTag);
            //     }
            // }


            if (dto.Votes != null) {
                foreach (var v in dto.Votes) {
                    if (VoteAlreadyExists(v)) {
                        Console.WriteLine("CONSOLE: VoteAlreadyExists " + VoteAlreadyExists(v));
                        await this.DeleteVote(this.GetVoteFromVoteDTO(v));
                    }
                    var newVote = new Vote();
                    newVote.PostId = post.Id;
                    newVote.AuthorId = v.AuthorId;
                    newVote.UpDown = v.UpDown;
                    post.Votes.Add(newVote);
                    await _context.SaveChangesAsync();
                }
            }
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }

        private Vote GetVoteFromVoteDTO(VoteDTO dto) {
            return (from v in _context.Votes
                    where v.AuthorId == dto.AuthorId
                        && v.PostId == dto.PostId
                    select v).FirstOrDefault();
        }

        private bool VoteAlreadyExists(VoteDTO v) {
            return this.GetVoteFromVoteDTO(v) != null;
        }

        private async Task<IActionResult> DeleteVote(Vote v) {
            Console.WriteLine("CONSOLE: DeleteVote");
            _context.Votes.Remove(v);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorized(Role.Admin, Role.Member)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();

            await this.DeletePostsVotes(post);
            await this.DeletePostsPostTags(post);
            await this.DeletePostsComments(post);
            await this.DeletePostsAnswers(post);
            await this.DeletePost(post);

            return NoContent();
        }

        private async Task<IActionResult> DeletePost(Post post) {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<IActionResult> DeletePostsAnswers(Post p) {
            foreach (var v in GetPostsAnswers(p))
                _context.Remove(v);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private IQueryable<Post> GetPostsAnswers(Post post) {
            return (
                from p in _context.Posts
                where p.ParentId == post.Id
                select p);
        }

        private async Task<IActionResult> DeletePostsComments(Post post) {
            foreach (var c in this.GetPostsComments(post))
                _context.Comments.Remove(c);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private IQueryable<Comment> GetPostsComments(Post post) {
            return (
                from c in _context.Comments
                where c.PostId == post.Id
                select c);
        }

        private async Task<IActionResult> DeletePostsVotes(Post post) {
            foreach (var v in GetPostsVotes(post))
                _context.Remove(v);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private IQueryable<Vote> GetPostsVotes(Post post) {
            return (
                from v in _context.Votes
                where v.PostId == post.Id
                select v);
        }

        private async Task<IActionResult> DeletePostsPostTags(Post post) {
            foreach (var pt in GetPostsPostTags(post))
                _context.Remove(pt);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private IQueryable<PostTag> GetPostsPostTags(Post post) {
            return (
                from v in _context.PostTags
                where v.PostId == post.Id
                select v);
        }
    }
}

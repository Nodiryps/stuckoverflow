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
            return (await this.GetAnswers(id).ToListAsync()).ToDTO();
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

        [AllowAnonymous] //[Authorized(Role.Admin, Role.Member)]
        [HttpPost]
        public async Task<ActionResult<PostDTO>> PostPost(PostDTO data) {
            var post = await _context.Posts.FindAsync(data.Id);

            if (post != null) {
                var err = new ValidationErrors().Add("Post already in use", nameof(post.Title));
                return BadRequest(err);
            }
            var newPost = new Post() {
                Id = GetNewId(),
                Title = data.Title,
                Body = data.Body,
                Timestamp = data.Timestamp,
                ParentId = data.ParentId,
                AuthorId = data.AuthorId,
                AcceptedAnswerId = data.AcceptedAnswerId,
            };
            _context.Posts.Add(newPost);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return CreatedAtAction(nameof(GetPostById), new { Id = newPost.Id }, newPost.ToDTO());
        }

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

            post.Id = dto.Id;
            post.Title = dto.Title;
            post.Body = dto.Body;
            post.Timestamp = dto.Timestamp;

            var res = await _context.SaveChangesAsyncWithValidation();

            if (!res.IsEmpty)
                return BadRequest(res);

            return NoContent();
        }

        [Authorized(Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id) {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

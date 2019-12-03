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
            return (await _context.Posts.ToListAsync()).ToDTO();
        }

        [Authorized(Role.Admin)]
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDTO>> GetPostById(int id) {
            var post = new Post();
            post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();
            return post.ToDTO();
        }

        [Authorized(Role.Admin, Role.Member)]
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostAPost(PostDTO data) {
            var newPost = new Post() {
                Id = GetNewId(),
                Title = data.Title,
                Body = data.Body,
                Timestamp = data.Timestamp,
                ParentId = data.ParentId,
                AuthorId = data.AuthorId,
                AcceptedAnswerId = data.AcceptedAnswerId
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

        [Authorized(Role.Admin)]
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
            var post = await _context.Users.FindAsync(id);

            if (post == null)
                return NotFound();

            _context.Users.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

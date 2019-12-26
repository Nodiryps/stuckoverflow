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
    [Route("api/tags")]
    [ApiController]
    public class TagsController : ControllerBase {
        private readonly G10Context _context;

        public TagsController(G10Context context) {
            _context = context;
        }

        // [Authorized(Role.Admin)]
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDTO>>> GetAll() {
            return (await _context.Tags.ToListAsync()).ToDTO();
        }

        [Authorized(Role.Admin, Role.Member)]
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDTO>> GetTagById(int id) {
            var tag = new Tag();
            tag = await _context.Tags.FindAsync(id);

            if (tag == null)
                return NotFound();
            return tag.ToDTO();
        }


        // [AllowAnonymous]
        // [HttpGet("tags/{id}")]
        // public async Task<ActionResult<IEnumerable<TagDTO>>> GetTagsById(int id) {
        //     var tags = GetTags(id);

        //     if (tags == null)
        //         return NotFound();
        //     return (await tags.ToListAsync()).ToDTO();
        // }

        // private IQueryable<Tag> GetTags(int postid) {
        //     var tagIds = GetTagIdsFromPostTags(postid);
        //     IQueryable<Tag> query = new IQueryable<Tag>();

        //     return (from tag in _context.Tags
        //             join t in tagIds on tag.Id equals t.Id
        //             where t.Id == tag.Id
        //             select tag);
        // }

        // private IQueryable<int> GetTagIdsFromPostTags(int postid) {
        //     return (from pt in _context.PostTags
        //             where pt.PostId == postid
        //             select pt.TagId);
        // }

        [Authorized(Role.Admin)]
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostTag(TagDTO data) {
            var newTag = new Tag() {
                Id = GetNewId(),
                Name = data.Name
            };
            _context.Tags.Add(newTag);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return CreatedAtAction(nameof(GetTagById), new { Id = newTag.Id }, newTag.ToDTO());
        }

        private int GetNewId() {
            return (from p in _context.Tags
                    select p.Id).Max() + 1;
        }

        [Authorized(Role.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(int id, TagDTO dto) {
            if (id != dto.Id)
                return BadRequest();

            var tag = await _context.Tags.FindAsync(id);

            if (tag == null)
                return NotFound();

            tag.Id = dto.Id;
            tag.Name = dto.Name;

            var res = await _context.SaveChangesAsyncWithValidation();

            if (!res.IsEmpty)
                return BadRequest(res);

            return NoContent();
        }

        [Authorized(Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id) {
            var tag = await _context.Users.FindAsync(id);

            if (tag == null)
                return NotFound();

            _context.Users.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

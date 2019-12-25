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
    [Route("api/comments")]
    [ApiController]
    public class CommentsController : ControllerBase {
        private readonly  G10Context _context;

        public CommentsController(G10Context context) {
            _context = context;
        }

        [Authorized(Role.Admin, Role.Member)]
        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDTO>> GetCmtById(int id) {
            var cmt = new Comment();
            cmt = await _context.Comments.FindAsync(id);

            if(cmt == null)
                return NotFound();
            return cmt.ToDTO();
        }

        [AllowAnonymous]
        [HttpGet("bypostid/{id}")]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetCmtsByPostId(int id) {
            var comments = GetComments(id);

            if (comments == null)
                return NotFound();
            return (await comments.ToListAsync()).ToDTO();
        }

        private IQueryable<Comment> GetComments(int i) {
            return (
                from c in _context.Comments
                where c.PostId == i
                select c
            );
        }
    }
}
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
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly G10Context _context;

        public UsersController(G10Context context) {
            _context = context;
        }

        [Authorized(Role.Admin)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
            return (await _context.Users.ToListAsync()).ToDTO();
        }

        [Authorized(Role.Admin)]
        [HttpGet("{str}")]
        public async Task<ActionResult<UserDTO>> GetUserByPseudoOrEmail(string str) {
            var user = new User();
            if (str.Contains('@')) {
                user = await _context.Users.FindAsync(GetIdByPseudo(GetPseudoByEmail(str)));
            } else {
                user = await _context.Users.FindAsync(GetIdByPseudo(str));
            }

            if (user == null)
                return NoContent();
            return user.ToDTO();
        }

        [AllowAnonymous]
        [HttpGet("id/{id}")]
        public async Task<ActionResult<UserDTO>> GetUserById(int id) {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();
            return user.ToDTO();
        }

        [Authorized(Role.Admin)]
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO data) {
            var user = await _context.Users.FindAsync(data.Id);

            if (user != null) {
                var err = new ValidationErrors().Add("Pseudo already in use", nameof(user.Pseudo));
                return BadRequest(err);
            }

            var newUser = new User() {
                Id = GetNewId(),
                Pseudo = data.Pseudo,
                Email = data.Email,
                Password = TokenHelper.GetPasswordHash(data.Password),
                FirstName = data.FirstName,
                LastName = data.LastName,
                BirthDate = data.BirthDate,
                Reputation = 0,
                Role = data.Role
            };
            _context.Users.Add(newUser);

            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return CreatedAtAction(nameof(GetUserById), new { Id = newUser.Id }, newUser.ToDTO());
        }

        private int GetNewId() {
            return (from u in _context.Users
                    select u.Id).Max() + 1;
        }

        private int GetIdByPseudo(string pseudo) {
            return (from u in _context.Users
                    where u.Pseudo == pseudo
                    select u.Id).FirstOrDefault();
        }

        [Authorized(Role.Admin)]
        [HttpPut("{pseudo}")]
        public async Task<IActionResult> PutUser(string pseudo, UserDTO userDTO) {
            if (pseudo != userDTO.Pseudo)
                return BadRequest();

            var user = await _context.Users.FindAsync(GetIdByPseudo(pseudo));

            if (user == null)
                return NotFound();

            if (userDTO.Password != null)
                user.Password = userDTO.Password;

            user.Pseudo = userDTO.Pseudo;
            user.FirstName = userDTO.FirstName;
            user.LastName = userDTO.LastName;
            user.BirthDate = userDTO.BirthDate;
            user.Reputation = userDTO.Reputation;
            var res = await _context.SaveChangesAsyncWithValidation();

            if (!res.IsEmpty)
                return BadRequest(res);

            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("available/{str}")]
        public async Task<ActionResult<bool>> IsAvailable(string str) {
            var member = new User();
            if (str.Contains('@')) {
                member = await _context.Users.FindAsync(GetIdByPseudo(GetPseudoByEmail(str)));
            } else
                member = await _context.Users.FindAsync(GetIdByPseudo(str));
            return member == null;
        }

        private string GetPseudoByEmail(string email) {
            return (from u in _context.Users
                    where u.Email == email
                    select u.Pseudo).FirstOrDefault();
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<ActionResult<UserDTO>> SignUp(UserDTO data) {
            data.Role = Role.Member;
            return await PostUser(data);
        }

        [Authorized(Role.Admin)]
        [HttpDelete("{pseudo}")]
        public async Task<IActionResult> Delete(string pseudo) {
            var user = await _context.Users.FindAsync(GetIdByPseudo(pseudo));

            if (user == null)
                return NotFound();

            await this.DeleteUsersPosts(user);
            await this.DeleteUsersComments(user);
            await this.DeleteUsersVotes(user);
            await this.DeleteUser(user);

            return NoContent();
        }

        private async Task<IActionResult> DeleteUser(User user) {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<IActionResult> DeleteUsersVotes(User user) {
            foreach (var v in this.GetUsersVotes(user))
                _context.Votes.Remove(v);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private IQueryable<Vote> GetUsersVotes(User user) {
            return (
                from v in _context.Votes
                where v.AuthorId == user.Id
                select v);
        }

        private async Task<IActionResult> DeleteUsersComments(User user) {
            foreach (var c in this.GetUsersComments(user))
                _context.Comments.Remove(c);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private IQueryable<Comment> GetUsersComments(User user) {
            return (
                from c in _context.Comments
                where c.AuthorId == user.Id
                select c);
        }

        private async Task<IActionResult> DeleteUsersPosts(User user) {
            var list = this.GetUsersPosts(user);

            await this.DeletePostsVotes(list);
            await this.DeletePostsPostTags(list);
            await this.DeletePostsComments(list);
            await this.DeletePostsAnswers(list);
            await this.DeletePosts(list);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private IQueryable<Post> GetUsersPosts(User user) {
            return (
                from p in _context.Posts
                where p.AuthorId == user.Id
                select p);
        }

        private async Task<IActionResult> DeletePostsAnswers(IQueryable<Post> list) {
            foreach (var p in list)
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

        private async Task<IActionResult> DeletePostsVotes(IQueryable<Post> list) {
            foreach (var p in list)
                foreach (var v in GetPostsVotes(p))
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

        private async Task<IActionResult> DeletePostsPostTags(IQueryable<Post> list) {
            foreach (var p in list)
                foreach (var pt in GetPostsPostTags(p))
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

        private async Task<IActionResult> DeletePostsComments(IQueryable<Post> list) {
            foreach (var p in list)
                foreach (var c in GetPostsComments(p))
                    _context.Remove(c);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private IQueryable<Comment> GetPostsComments(Post post) {
            return (
                from v in _context.Comments
                where v.PostId == post.Id
                select v);
        }

        private async Task<IActionResult> DeletePosts(IQueryable<Post> list) {
            foreach (var p in list) {
                _context.Posts.Remove(p);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<ActionResult<User>> Authenticate(UserDTO data) {
            var user = await Authenticate(data.Pseudo, data.Password);

            if (user == null)
                return BadRequest(new ValidationErrors().Add("User not found", "Pseudo"));
            if (user.Token == null)
                return BadRequest(new ValidationErrors().Add("Incorrect password", "Password"));
            return Ok(user);
        }

        private async Task<User> Authenticate(string pseudo, string password) {
            var user = await _context.Users.FindAsync(GetIdByPseudo(pseudo));

            if (user == null)
                return null;
            if (user.Password == TokenHelper.GetPasswordHash(password)) {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("my-super-secret-key");
                var tokenDescriptor = new SecurityTokenDescriptor {
                    Subject = new ClaimsIdentity
                    (
                        new Claim[]
                        {
                            new Claim(ClaimTypes.Name, user.Pseudo),
                            new Claim(ClaimTypes.Role, user.Role.ToString())
                        }
                    ),
                    IssuedAt = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(60),
                    SigningCredentials = new SigningCredentials
                        (
                            new SymmetricSecurityKey(key),
                            SecurityAlgorithms.HmacSha256Signature
                        )
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                user.Token = tokenHandler.WriteToken(token);
            }
            user.Password = null;
            return user;
        }
    }
}

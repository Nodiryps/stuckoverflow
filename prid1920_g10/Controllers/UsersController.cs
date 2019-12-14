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
            if(str.Contains('@')) {
                user = await _context.Users.FindAsync(GetIdByPseudo(GetPseudoByEmail(str)));
            }
            else {
                user = await _context.Users.FindAsync(GetIdByPseudo(str));
            }

            if (user == null)
                return NotFound();
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
                Password = data.Password,
                FirstName = data.FirstName,
                LastName = data.LastName,
                BirthDate = data.BirthDate,
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

            var res = await _context.SaveChangesAsyncWithValidation();

            if (!res.IsEmpty)
                return BadRequest(res);

            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("available/{str}")]
        public async Task<ActionResult<bool>> IsAvailable(string str) {
            var member = new User();
            if(str.Contains('@'))
            {
                member = await _context.Users.FindAsync(GetIdByPseudo(GetPseudoByEmail(str)));
            }
            else
                member = await _context.Users.FindAsync(GetIdByPseudo(str));
            return  member == null;
        }

        private string GetPseudoByEmail(string email) {
            return (from u in _context.Users
                    where u.Email == email
                    select u.Pseudo).FirstOrDefault();
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<ActionResult<UserDTO>> SignUp(UserDTO data) {
            return await PostUser(data);
        }

        [Authorized(Role.Admin)]
        [HttpDelete("{pseudo}")]
        public async Task<IActionResult> DeleteUser(string pseudo) {
            var user = await _context.Users.FindAsync(GetIdByPseudo(pseudo));

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
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
                    Expires = DateTime.UtcNow.AddMinutes(10),
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

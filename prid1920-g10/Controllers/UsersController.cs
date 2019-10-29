using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using prid1920_g10.Models;
using PRID_Framework;

namespace prid1920_g10.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly G10Context _context;

        public UsersController(G10Context context)
        {
            _context = context;
            if (_context.Users.Count() == 0)
            {
                _context.Users.Add(new User
                {
                    Pseudo = "yas",
                    Password = "epfc",
                    Email = "yas@epfc.eu",
                    FirstName = "Yasmina",
                    LastName = "El Ghouate",
                    BirthDate = new DateTime(1983, 1, 27)
                }
                );
                _context.Users.Add(new User
                {
                    Pseudo = "oth",
                    Password = "epfc",
                    Email = "oth@epfc.eu",
                    FirstName = "Othman",
                    LastName = "Zamzam",
                    BirthDate = new DateTime(2000, 1, 27)
                }
                );
                _context.SaveChanges();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll()
        {
            return (await _context.Users.ToListAsync()).ToDTO();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetOne(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();
            return user.ToDTO();
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO data)
        {
            var user = await _context.Users.FindAsync(data.Id);

            if (user != null)
            {
                var err = new ValidationErrors().Add("Pseudo already in use", nameof(user.Pseudo));
                return BadRequest(err);
            }
            var newUser = new User()
            {
                Pseudo = data.Pseudo,
                Email = data.Email,
                Password = data.Password,
                FirstName = data.FirstName,
                LastName = data.LastName,
                BirthDate = data.BirthDate,
            };
            _context.Users.Add(newUser);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return CreatedAtAction(nameof(GetOne), new { Id = newUser.Id }, newUser.ToDTO());
        }

        private int GetIdByPseudo(string pseudo)
        {
            return (from u in _context.Users
                    where u.Pseudo == pseudo
                    select u.Id).FirstOrDefault();
        }

        [HttpPut("{pseudo}")]
        public async Task<IActionResult> PutUser(string pseudo, UserDTO userDTO)
        {
            if (pseudo != userDTO.Pseudo)
                return BadRequest();

            var user = await _context.Users.FindAsync(GetIdByPseudo(userDTO.Id));

            if (user == null)
                return NotFound();

            user.Pseudo = userDTO.Pseudo;
            user.FirstName = userDTO.FirstName;
            user.LastName = userDTO.LastName;
            user.BirthDate = userDTO.BirthDate;
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return NoContent();
        }

        [HttpDelete("{pseudo}")]
        public async Task<IActionResult> DeleteUser(string pseudo)
        {
            var user = await _context.Users.FindAsync(GetIdByPseudo(pseudo));

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

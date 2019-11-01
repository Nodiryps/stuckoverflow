using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace prid1920_g10.Models {
    public static class DTOMappers {
        public static UserDTO ToDTO(this User user) {
            return new UserDTO {
                Id = user.Id,
                Pseudo = user.Pseudo,
                // we don't put the password in the DTO for security reasons
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                BirthDate = user.BirthDate,
                Role = user.Role
            };
        }

        public static List<UserDTO> ToDTO(this IEnumerable<User> users) {
            return users.Select(m => m.ToDTO()).ToList();
        }
    }
}

using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Text;
using System;

namespace prid1920_g10.Helpers {
    public class TokenHelper {
        public static string GetPasswordHash(string password) {
            string salt = "Peodks;zsOK30S,s";
            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: Encoding.UTF8.GetBytes(salt),
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            return hashed;
        }
    }
}
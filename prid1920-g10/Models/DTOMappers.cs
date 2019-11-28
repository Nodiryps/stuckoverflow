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
                Role = user.Role,
                Posts = user.Posts,
                Comments = user.Comments,
                Votes = user.Votes
            };
        }
        public static List<UserDTO> ToDTO(this IEnumerable<User> users) {
            return users.Select(m => m.ToDTO()).ToList();
        }

        public static CommentDTO ToDTO(this Comment cmt) {
            return new CommentDTO {
                Id = cmt.Id,
                Body = cmt.Body,
                Timestamp = cmt.Timestamp,
                AuthorId = cmt.AuthorId,
                PostId = cmt.PostId
            };
        }
        public static List<CommentDTO> ToDTO(this IEnumerable<Comment> cmts) {
            return cmts.Select(c => c.ToDTO()).ToList();
        }

        public static PostDTO ToDTO(this Post post) {
            return new PostDTO {
                Id = post.Id,
                Title = post.Title,
                Body = post.Body,
                Timestamp = post.Timestamp,
                ParentId = post.ParentId,
                AuthorId = post.AuthorId,
                AcceptedAnswerId = post.AcceptedAnswerId,
                Answers = post.Answers,
                Votes = post.Votes,
                Comments = post.Comments,
                PostTags = post.PostTags
            };
        }
        public static List<PostDTO> ToDTO(this IEnumerable<Post> post) {
            return post.Select(p => p.ToDTO()).ToList();
        }

        public static TagDTO ToDTO(this Tag tag) {
            return new TagDTO {
                Id = tag.Id,
                Name = tag.Name
            };
        }
        public static List<TagDTO> ToDTO(this IEnumerable<Tag> tag) {
            return tag.Select(t => t.ToDTO()).ToList();
        }

        public static VoteDTO ToDTO(this Vote vote) {
            return new VoteDTO {
                UpDown = vote.UpDown,
                AuthorId = vote.AuthorId,
                PostId = vote.PostId
            };
        }
        public static List<VoteDTO> ToDTO(this IEnumerable<Vote> vote) {
            return vote.Select(v => v.ToDTO()).ToList();
        }
    }
}

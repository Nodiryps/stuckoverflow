using System;
using System.Collections.Generic;
using System.Linq;

namespace prid1920_g10.Models {
    public static class DTOMappers {

        public static UserDTO ToDTO(this User user) => new UserDTO {
            Id = user.Id,
            Pseudo = user.Pseudo,
            // we don't put the password in the DTO for security reasons
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            BirthDate = user.BirthDate,
            Role = user.Role,
            Posts = user.Posts.ToDTO(),
            Comments = user.Comments.ToDTO(),
            Votes = user.Votes.ToDTO()
        };
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
            List<PostDTO> list = post.Answers.ToDTO().ToList();
            return new PostDTO {
                Id = post.Id,
                Title = post.Title,
                Body = post.Body,
                Timestamp = post.Timestamp,
                ParentId = post.ParentId,
                AuthorId = post.AuthorId,
                AcceptedAnswerId = post.AcceptedAnswerId,
                Answers = post.Answers.ToDTO(),
                Votes = post.Votes.ToDTO(),
                Comments = post.Comments.ToDTO(),
                // PostTags = post.PostTags,
                Tags = post.Tags.Select(tag => tag.Name).ToList()
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

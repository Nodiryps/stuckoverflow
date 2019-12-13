using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using prid1920_g10.Models;
using prid1920_g10.Helpers;

namespace prid1920_g10.Helpers {
    public static class SeedData {
        public static IWebHost Seed(this IWebHost webHost) {
            using (var scope = webHost.Services.CreateScope()) {
                using (var context = scope.ServiceProvider.GetRequiredService<G10Context>()) {
                    try {
                        Console.Write("Seeding data ...");
                        if (context.Users.Count() == 0) {
                            context.Users.AddRange(
                                new User { Id = 1, Pseudo = "ben", Password = TokenHelper.GetPasswordHash("ben"), LastName = "Penelle", FirstName = "Benoît", Email = "ben@test.com" },
                                new User { Id = 2, Pseudo = "bruno", Password = TokenHelper.GetPasswordHash("bruno"), LastName = "Lacroix", FirstName = "Bruno", Email = "bruno@test.com" },
                                new User { Id = 3, Pseudo = "admin", Password = TokenHelper.GetPasswordHash("admin"), LastName = "Administrator", FirstName = "Administrator", Email = "admin@test.com", Role = Role.Admin },
                                new User { Id = 4, Pseudo = "boris", Password = TokenHelper.GetPasswordHash("boris"), LastName = "Verhaegen", FirstName = "Boris", Email = "boris@test.com", Role = Role.Admin },
                                new User { Id = 5, Pseudo = "alain", Password = TokenHelper.GetPasswordHash("alain"), LastName = "Silovy", FirstName = "Alain", Email = "alain@test.com" }
                            );
                            context.SaveChanges();
                        }
                        if (context.Posts.Count() == 0) {
                            context.Posts.AddRange(
                                new Post() {
                                    Id = 1,
                                    Title = "What does 'initialization' exactly mean?",
                                    Body = @"My csapp book says that if global and static variables are initialized, than they are contained in .data section in ELF relocatable object file.
                                            So my question is that if some `foo.c` code contains 
                                            ```
                                            int a;
                                            int main()
                                            {
                                                a = 3;
                                            }`
                                            ```
                                            and `example.c` contains,
                                            ```
                                            int b = 3;
                                            int main()
                                            {
                                            ...
                                            }
                                            ```
                                            is it only `b` that considered to be initialized? In other words, does initialization mean declaration and definition in same line?",
                                    AuthorId = 1,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 30, 0)
                                },
                                new Post() {
                                    Id = 2,
                                    Body = @"It means exactly what it says. Initialized static storage duration objects will have their init values set before the main function is called. Not initialized will be zeroed. The second part of the statement is actually implementation dependant,  and implementation has the full freedom of the way it will be archived. 
                                            When you declare the variable without the keyword `extern`  you always define it as well",
                                    ParentId = 1,
                                    AuthorId = 2,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 31, 0)
                                },
                                new Post() {
                                    Id = 3,
                                    Body = @"Both are considered initialized
                                            ------------------------------------
                                            They get [zero initialized][1] or constant initalized (in short: if the right hand side is a compile time constant expression).
                                            > If permitted, Constant initialization takes place first (see Constant
                                            > initialization for the list of those situations). In practice,
                                            > constant initialization is usually performed at compile time, and
                                            > pre-calculated object representations are stored as part of the
                                            > program image. If the compiler doesn't do that, it still has to
                                            > guarantee that this initialization happens before any dynamic
                                            > initialization.
                                            > 
                                            > For all other non-local static and thread-local variables, Zero
                                            > initialization takes place. In practice, variables that are going to
                                            > be zero-initialized are placed in the .bss segment of the program
                                            > image, which occupies no space on disk, and is zeroed out by the OS
                                            > when loading the program.
                                            To sum up, if the implementation cannot constant initialize it, then it must first zero initialize and then initialize it before any dynamic initialization happends.
                                            [1]: https://en.cppreference.com/w/cpp/language/zero_initialization
                                            ",
                                    ParentId = 1,
                                    AuthorId = 3,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 32, 0)
                                },
                                new Post() {
                                    Id = 4,
                                    Title = "How do I escape characters in an Angular date pipe?",
                                    Body = @"I have an Angular date variable `today` that I'm using the [date pipe][1] on, like so:
                                            {{today | date:'LLLL d'}}
                                        > February 13
                                        However, I would like to make it appear like this:
                                        > 13 days so far in February
                                        When I try a naive approach to this, I get this result:
                                            {{today | date:'d days so far in LLLL'}}
                                        > 13 13PM201818 18o fPMr in February
                                        This is because, for instance `d` refers to the day.
                                        How can I escape these characters in an Angular date pipe? I tried `\d` and such, but the result did not change with the added backslashes.
                                        [1]: https://angular.io/api/common/DatePipe",
                                    AuthorId = 1,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 33, 0)
                                },
                                new Post() {
                                    Id = 5,
                                    Body = @"How about this:
                                            {{today | date:'d \'days so far in\' LLLL'}}
                                            Anything inside single quotes is ignored. Just don't forget to escape them.",
                                    ParentId = 4,
                                    AuthorId = 1,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 34, 0)
                                },
                                new Post() {
                                    Id = 6,
                                    Body = @"Then only other alternative to stringing multiple pipes together as suggested by RichMcCluskey would be to create a custom pipe that calls through to momentjs format with the passed in date. Then you could use the same syntax including escape sequence that momentjs supports.
                                            Something like this could work, it is not an exhaustive solution in that it does not deal with localization at all and there is no error handling code or tests.
                                                import { Inject, Pipe, PipeTransform } from '@angular/core';
                                                @Pipe({ name: 'momentDate', pure: true })
                                                export class MomentDatePipe implements PipeTransform {
                                                    transform(value: any, pattern: string): string {
                                                        if (!value)
                                                            return '';
                                                        return moment(value).format(pattern);
                                                    }
                                                }
                                            And then the calling code:
                                                {{today | momentDate:'d [days so far in] LLLL'}}
                                            For all the format specifiers see the [documentation for format][1]. 
                                            Keep in mind you do have to import `momentjs` either as an import statement, have it imported in your cli config file, or reference the library from the root HTML page (like index.html).
                                            [1]: http://momentjs.com/docs/#/displaying/format/",
                                    ParentId = 4,
                                    AuthorId = 3,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 35, 0)
                                },
                                new Post() {
                                    Id = 7,
                                    Body = @"As far as I know this is not possible with the Angular date pipe at the time of this answer. One alternative is to use multiple date pipes like so:
                                                {{today | date:'d'}} days so far in {{today | date:'LLLL'}}
                                            EDIT:
                                            After posting this I tried @Gh0sT 's solution and it worked, so I guess there is a way to use one date pipe.",
                                    ParentId = 4,
                                    AuthorId = 2,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 36, 0)
                                },
                                new Post() {
                                    Id = 8,
                                    Title = "Q1",
                                    Body = "Q1",
                                    AuthorId = 5,
                                    Timestamp = new DateTime(2019, 11, 22, 8, 0, 0)
                                },
                                new Post() {
                                    Id = 9,
                                    Body = "R1",
                                    ParentId = 8,
                                    AuthorId = 1,
                                    Timestamp = new DateTime(2019, 11, 22, 8, 5, 0)
                                },
                                new Post() {
                                    Id = 10,
                                    Body = "R2",
                                    ParentId = 8,
                                    AuthorId = 2,
                                    Timestamp = new DateTime(2019, 11, 22, 8, 3, 0)
                                },
                                new Post() {
                                    Id = 11,
                                    Body = "R3",
                                    ParentId = 8,
                                    AuthorId = 3,
                                    Timestamp = new DateTime(2019, 11, 22, 8, 4, 0)
                                },
                                new Post() {
                                    Id = 12,
                                    Title = "Q2",
                                    Body = "Q2",
                                    AuthorId = 4,
                                    Timestamp = new DateTime(2019, 11, 22, 9, 0, 0)
                                },
                                new Post() {
                                    Id = 13,
                                    Body = "R4",
                                    ParentId = 12,
                                    AuthorId = 5,
                                    Timestamp = new DateTime(2019, 11, 22, 9, 1, 0)
                                },
                                new Post() {
                                    Id = 14,
                                    Title = "Q3",
                                    Body = "Q3",
                                    AuthorId = 1,
                                    Timestamp = new DateTime(2019, 11, 22, 10, 0, 0)
                                },
                                new Post() {
                                    Id = 15,
                                    Body = "R5",
                                    ParentId = 14,
                                    AuthorId = 5,
                                    Timestamp = new DateTime(2019, 11, 22, 10, 2, 0)
                                },
                                new Post() {
                                    Id = 16,
                                    Body = "R6",
                                    ParentId = 14,
                                    AuthorId = 3,
                                    Timestamp = new DateTime(2019, 11, 22, 10, 2, 0)
                                },
                                new Post() {
                                    Id = 17,
                                    Title = "Q4",
                                    Body = "Q4",
                                    AuthorId = 2,
                                    Timestamp = new DateTime(2019, 11, 22, 11, 0, 0)
                                },
                                new Post() {
                                    Id = 18,
                                    Body = "R7",
                                    ParentId = 17,
                                    AuthorId = 3,
                                    Timestamp = new DateTime(2019, 11, 22, 10, 2, 0)
                                },
                                new Post() {
                                    Id = 19,
                                    Title = "Q5",
                                    Body = "Q8",
                                    AuthorId = 4,
                                    Timestamp = new DateTime(2019, 11, 22, 11, 0, 0)
                                },
                                new Post() {
                                    Id = 20,
                                    Body = "R8",
                                    ParentId = 19,
                                    AuthorId = 3,
                                    Timestamp = new DateTime(2019, 11, 22, 10, 2, 0)
                                }
                            );
                            context.SaveChanges();
                            var post4 = context.Posts.Find(4);
                            post4.AcceptedAnswerId = 5;
                            context.SaveChanges();
                        }
                        if (context.Comments.Count() == 0) {
                            context.Comments.AddRange(
                                new Comment() {
                                    Id = 1,
                                    Body = @"Global ""uninitialized"" variables typically end up in a ""bss"" segment, which will be initialized to zero.",
                                    AuthorId = 1,
                                    PostId = 1,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 40, 0)
                                },
                                new Comment() {
                                    Id = 2,
                                    Body = @"[stackoverflow.com/questions/1169858/…]() This might help",
                                    AuthorId = 2,
                                    PostId = 1,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 41, 0)
                                },
                                new Comment() {
                                    Id = 3,
                                    Body = @"Verified that this works! Pretty cool",
                                    AuthorId = 2,
                                    PostId = 6,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 42, 0)
                                },
                                new Comment() {
                                    Id = 4,
                                    Body = @"For me it works with double quotes. `{{today | date:""d \'days so far in\' LLLL""}}`",
                                    AuthorId = 3,
                                    PostId = 7,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 43, 0)
                                },
                                new Comment() {
                                    Id = 5,
                                    Body = @"This does not provide an answer to the question. Once you have sufficient reputation you will be able to comment on any post; instead, provide answers that don't require clarification from the asker.",
                                    AuthorId = 2,
                                    PostId = 6,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 44, 0)
                                },
                                new Comment() {
                                    Id = 6,
                                    Body = @"Duplicate of [xxx](yyy). Please stop!",
                                    AuthorId = 1,
                                    PostId = 6,
                                    Timestamp = new DateTime(2019, 11, 15, 8, 45, 0)
                                }
                            );
                            context.SaveChanges();
                        }
                        if (context.Votes.Count() == 0) {
                            context.Votes.AddRange(
                                new Vote() { UpDown = 1, AuthorId = 5, PostId = 1 },
                                new Vote() { UpDown = -1, AuthorId = 3, PostId = 2 },
                                new Vote() { UpDown = -1, AuthorId = 2, PostId = 1 },
                                new Vote() { UpDown = -1, AuthorId = 3, PostId = 1 },
                                new Vote() { UpDown = 1, AuthorId = 2, PostId = 3 },
                                new Vote() { UpDown = 1, AuthorId = 5, PostId = 5 },
                                new Vote() { UpDown = -1, AuthorId = 3, PostId = 5 },
                                new Vote() { UpDown = 1, AuthorId = 4, PostId = 7 },
                                new Vote() { UpDown = -1, AuthorId = 4, PostId = 8 },
                                new Vote() { UpDown = -1, AuthorId = 1, PostId = 8 },
                                new Vote() { UpDown = 1, AuthorId = 4, PostId = 9 },
                                new Vote() { UpDown = -1, AuthorId = 2, PostId = 9 },
                                new Vote() { UpDown = 1, AuthorId = 1, PostId = 11 },
                                new Vote() { UpDown = 1, AuthorId = 2, PostId = 11 },
                                new Vote() { UpDown = 1, AuthorId = 1, PostId = 12 },
                                new Vote() { UpDown = 1, AuthorId = 2, PostId = 12 },
                                new Vote() { UpDown = 1, AuthorId = 3, PostId = 12 },
                                new Vote() { UpDown = -1, AuthorId = 1, PostId = 13 },
                                new Vote() { UpDown = -1, AuthorId = 2, PostId = 14 },
                                new Vote() { UpDown = -1, AuthorId = 2, PostId = 15 },
                                new Vote() { UpDown = -1, AuthorId = 4, PostId = 16 },
                                new Vote() { UpDown = 1, AuthorId = 1, PostId = 18 }
                            );
                            context.SaveChanges();
                        }
                        if (context.Tags.Count() == 0) {
                            context.Tags.AddRange(
                                new Tag() { Id = 1, Name = "angular" },
                                new Tag() { Id = 2, Name = "typescript" },
                                new Tag() { Id = 3, Name = "csharp" },
                                new Tag() { Id = 4, Name = "EntityFramework Core" },
                                new Tag() { Id = 5, Name = "dotnet core" },
                                new Tag() { Id = 6, Name = "mysql" }
                            );
                            context.SaveChanges();
                        }
                        if (context.PostTags.Count() == 0) {
                            context.PostTags.AddRange(
                                new PostTag() { PostId = 1, TagId = 1 },
                                new PostTag() { PostId = 1, TagId = 3 },
                                new PostTag() { PostId = 4, TagId = 2 }
                            );
                            context.SaveChanges();
                        }
                    } catch (Exception ex) {
                        Console.WriteLine(ex.ToString());
                    }
                }
            }
            return webHost;
        }
    }
}
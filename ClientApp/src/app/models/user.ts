import { Post } from "./post";
import { Comment } from "./comment";
import { Vote } from "./vote";

export enum Role { Visitor = 0, Member = 1, Admin = 2 }

export class User {
    id: number;
    pseudo: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    reputation: number;
    role: Role;
    // posts: Post[];
    // comments: Comment[];
    // votes: Vote[];

    token: string;



    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.pseudo = data.pseudo;
            this.password = data.password;
            this.email = data.email;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.birthDate = data.birthDate
                && data.birthDate.length > 10 ?
                data.birthDate.substring(0, 10) : data.birthDate;
            this.reputation = data.reputation;
            this.role = data.role || Role.Member;
            // this.posts = data.posts;
            // this.comments = data.comments;
            // this.votes = data.votes;
            this.token = data.token;
        }
    }

    public get roleAsString(): string {
        return Role[this.role];
    }
}
import { User } from "./user";

export class Comment {
    id: number;
    body: string;
    timestamp: string;
    authorId: number;
    postId: number;
    //author: User;

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.body = data.body;
            this.timestamp = data.timestamp;
            this.authorId = data.authorId;
            this.postId = data.postId;
            //this.author = new User({});
        }
    }
}
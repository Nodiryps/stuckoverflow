import { Tag } from "./tag";
import { Vote } from "./vote";
import { List } from "lodash";

export class Post {
    id: number;
    title: string;
    body: string;
    timestamp: string;
    parentId: number;
    authorId: number;
    acceptedAnswerId: number;
    answers: List<Post>;
    votes: Vote[];
    tags: List<Tag>;

    constructor(data: any) {
        if(data) {
            this.id = data.id;
            this.title = data.title;
            this.body = data.body;
            this.timestamp = data.timestamp;
            this.parentId = data.parentId;
            this.authorId = data.authorId;
            this.acceptedAnswerId = data.acceptedAnswerId;
            this.votes = data.votes;
            this.tags = data.tags;
        }
    }
}
import { Tag } from "./tag";
import { Vote } from "./vote";
import { Comment } from "./comment";
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
    comments: Comment[];
    author : string = 'UNKOWN';
    score: number = 0;

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.title = data.title;
            this.body = data.body;
            this.timestamp = data.timestamp;
            this.parentId = data.parentId;
            this.authorId = data.authorId;
            this.acceptedAnswerId = data.acceptedAnswerId;
            this.votes = data.votes;
            this.tags = data.tags;
            this.comments = data.comments;
            this.score = this.getScore();
        }
    }


    getScore() {
        let res = 0;
        this.votes.forEach(element => {
            res += element.upDown;
        });
        return res;
    }
}
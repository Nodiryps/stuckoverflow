import { Tag } from "./tag";
import { Vote } from "./vote";
import { Comment } from "./comment";
import { List } from "lodash";
import { empty } from "rxjs";
import { OverlayPositionBuilder } from "@angular/cdk/overlay";
import { PostTag } from "./postTag";

export class Post {
    id: number;
    title: string;
    body: string;
    timestamp: string;
    parentId: number;
    authorId: number;
    acceptedAnswerId: number;
    answers: Post[] = [];
    votes: Vote[] = [];
    tags: Tag[] = [];
    postTags: PostTag[] = [];
    comments: Comment[];
    author: string = 'UNKNOWN';
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
            this.postTags = data.postTags;
            this.comments = data.comments;
            this.score = this.getScore();
            this.answers = data.answers;
        }
    }


    getScore(): number {
        let res: number = 0;
        if (this.votes != null)
            this.votes.forEach(element => {
                res += element.upDown;
            });
        return res;
    }
}
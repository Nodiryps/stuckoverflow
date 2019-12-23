import { Tag } from "./tag";
import { Vote } from "./vote";
import { Comment } from "./comment";
import { List } from "lodash";
import { empty } from "rxjs";
import { OverlayPositionBuilder } from "@angular/cdk/overlay";

export class Post {
    id: number;
    title: string;
    body: string;
    timestamp: string;
    parentId: number;
    authorId: number;
    acceptedAnswerId: number;
    answers: List<Post>;
    votes: Vote[] = [];
    tags: Tag[] = [];
    comments: Comment[];
    author : string = 'UNKNOWN';
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
            //this.score = this.getScore();
        }
    }


    getScore(): number {
        let res: number = 0;
        // if(this.votes == null) {
        //     res = 1;
        //     this.votes = [];
        //     this.votes.push(this.defaultVote());
        // }
        if(this.votes != null)
            this.votes.forEach(element => {
                res += element.upDown;
            });
        return res;
    }

    // defaultVote(): Vote {
    //     const vote = new Vote({});
    //     vote.upDown = 1;
    //     vote.authorId = this.authorId;
    //     vote.postId = this.id;
    //     return vote;
    // }
}
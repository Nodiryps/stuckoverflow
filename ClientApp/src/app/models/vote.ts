export class Vote {
    upDown: number;
    authorId: number;
    postId: number;

    constructor(data: any) {
        if(data) {
            this.upDown = data.upDown;
            this.authorId = data.authorId;
            this.postId = data.postId;
        }
    }
}
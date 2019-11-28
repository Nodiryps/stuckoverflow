export class PostTag {
    postId: number;
    tagId: number;

    constructor(data: any) {
        if(data) {
            this.postId = data.postId;
            this.tagId = data.tagId;
        }
    }
}
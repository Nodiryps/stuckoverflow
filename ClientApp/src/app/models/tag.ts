export class Tag {
    id: number;
    name: string;
    nbOcc: number;

    constructor(data: any) {
        if(data) {
            this.id = data.id;
            this.name = data.name;
            this.nbOcc = data.nbOcc;
        }
    }
}
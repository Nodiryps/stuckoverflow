export class User {
    id: number;
    pseudo: string;
    password: string;
    email: string;
    firstName : string;
    lastName: string;
    birthDate: string;
    reputation: number;

    constructor(data: any) {
        if(data) { 
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
            
        }
    }
}
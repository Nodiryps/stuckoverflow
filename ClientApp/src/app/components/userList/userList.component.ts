import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-userList',
    templateUrl: './userList.component.html'
})

export class UserListComponent {
    users: User[] = [];

    constructor(private serv: UserService) {
        serv.getAll().subscribe(u => {
            this.users = u;
        })
    }
}
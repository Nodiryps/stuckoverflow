import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import {
    FormBuilder, FormGroup, Validators, FormControl,
    AsyncValidatorFn, ValidationErrors
} from '@angular/forms';
import * as _ from 'lodash';
import { User, Role } from 'src/app/models/user';

@Component({
    selector: 'app-edit-user-mat',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})

export class EditUserComponent {
    public frm: FormGroup;
    public ctlId: FormControl;
    public ctlPseudo: FormControl;
    public ctlEmail: FormControl;
    public ctlFirstName: FormControl;
    public ctlLastName: FormControl;
    public ctlPassword: FormControl;
    public ctlBirthDate: FormControl;
    public ctlReputation: FormControl;
    public ctlRole: FormControl;
    public isNew: boolean;

    private minLengthPseudoPasswordName: number = 3;
    private maxLengthPseudo: number = 10;
    private maxLengthName: number = 30;

    constructor(
        public dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User; isNew: boolean; },
        private fb: FormBuilder,
        private userService: UserService
    ) {
        // this.ctlId = this.fb.control('', []);
        this.ctlPseudo = this.fb.control('',
            [
                Validators.required,
                Validators.minLength(this.minLengthPseudoPasswordName),
                Validators.maxLength(this.maxLengthPseudo),
                // this.forbiddenValues(['@', ' '])
            ], [this.pseudoUsed()]
        );
        this.ctlEmail = this.fb.control('',
            [
                Validators.pattern(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)
            ], [this.emailUsed()]
        );
        this.ctlPassword = this.fb.control('', data.isNew ? [Validators.required, Validators.minLength(3)] : []);
        this.ctlFirstName = this.fb.control('', [Validators.minLength(this.minLengthPseudoPasswordName), Validators.maxLength(this.maxLengthName)]);
        this.ctlLastName = this.fb.control('', [Validators.minLength(this.minLengthPseudoPasswordName), Validators.maxLength(this.maxLengthName)]);
        this.ctlBirthDate = this.fb.control('', [this.validateBirthDate()]);
        this.ctlReputation = this.fb.control('', []);
        this.ctlRole = this.fb.control(Role.Member, []);
        this.frm = this.fb.group({
            id: this.ctlId,
            pseudo: this.ctlPseudo,
            password: this.ctlPassword,
            email: this.ctlEmail,
            firstname: this.ctlFirstName,
            lastname: this.ctlLastName,
            birthdate: this.ctlBirthDate,
            reputation: this.ctlReputation,
            role: this.ctlRole
        }, { validator: this.nameValidations });
        console.log(data);
        this.isNew = data.isNew;
        this.frm.patchValue(data.user);
    }

    nameValidations(group: FormGroup): ValidationErrors {
        if (!group.value) { return null; }
        if (group.value.firstname !== '' && group.value.lastname === '') {
            return { lastnameRequired: true };
        }
        if (group.value.firstname === '' && group.value.lastname !== '') {
            return { firstnameRequired: true };
        }
    }

    forbiddenValues(arr: Array<string>): any {
        return (ctl: FormControl) => {
            arr.forEach(element => {
                if (ctl.value === element) {
                    return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: element } };
                }
                return null;
            });
        };
    }

    validateBirthDate(): any {
        return (ctl: FormControl) => {
            const date = new Date(ctl.value);
            const diff = Date.now() - date.getTime();
            if (diff < 0)
                return { futureBorn: true }
            var age = new Date(diff).getUTCFullYear() - 1970;
            if (age < 18)
                return { tooYoung: true };
            return null;
        };
    }

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre
    pseudoUsed(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const pseudo = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        this.userService.getByPseudoOrEmail(pseudo, '').subscribe(user => {
                            resolve(user ? { pseudoUsed: true } : null);
                        });
                    }
                }, 300);
            });
        };
    }

    emailUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine || ctl.value === this.data.user.email) {
                        resolve(null);
                    }
                    else {
                        this.userService.getByPseudoOrEmail('', email).subscribe(user => {
                            resolve(user ? { emailUsed: true } : null);
                        });
                    }
                }, 300);
            });
        };
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        this.dialogRef.close(this.frm.value);

    }

    cancel() {
        this.dialogRef.close();
    }
}
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { resolve } from 'path';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignUpComponent {
    public frm: FormGroup;
    public ctlPseudo: FormControl;
    public ctlPassword: FormControl;
    public ctlPasswordConfirm: FormControl;
    public ctlEmail: FormControl;
    public ctlFirstName: FormControl;
    public ctlLastName: FormControl;
    public ctlBirthDate: FormControl;

    private minLengthPseudoPasswordName: number = 3;
    private maxLengthPseudo: number = 10;
    private maxLengthName: number = 30;

    constructor(
        public authService: AuthenticationService,  // pour pouvoir faire le login
        public router: Router,                      // pour rediriger vers la page d'accueil en cas de login
        private fb: FormBuilder                     // pour construire le formulaire, du côté TypeScript
    ) {
        this.ctlPseudo = this.fb.control('', 
            [
                Validators.required, 
                Validators.minLength(this.minLengthPseudoPasswordName), 
                Validators.maxLength(this.maxLengthPseudo),
                Validators.pattern(/^[a-z]+[a-z0-9._]/),
                // this.forbiddenValue('@')
            ], [this.pseudoUsed()]
        );
        this.ctlPassword = this.fb.control('', 
            [
                Validators.required, 
                Validators.minLength(this.minLengthPseudoPasswordName)
            ]
        );
        this.ctlPasswordConfirm = this.fb.control('', 
            [
                Validators.required, 
                Validators.minLength(3)
            ]
        );
        this.ctlEmail = this.fb.control('', 
            [
                Validators.pattern(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)
            ], [this.emailUsed()]
        );
        this.ctlFirstName = this.fb.control('', 
            [
                Validators.minLength(this.minLengthPseudoPasswordName), 
                Validators.maxLength(this.maxLengthName),
                Validators.pattern(/^(\w+\S+)$/)
            ]
        );
        this.ctlLastName = this.fb.control('', 
            [
                Validators.minLength(this.minLengthPseudoPasswordName), 
                Validators.maxLength(this.maxLengthName),
                Validators.pattern(/^(\w+\S+)$/)
            ]
        );
        this.ctlBirthDate = this.fb.control('', [this.validateBirthDate()]);
        
        this.frm = this.fb.group({
            pseudo: this.ctlPseudo,
            password: this.ctlPassword,
            passwordConfirm: this.ctlPasswordConfirm,
            firstname: this.ctlFirstName,
            lastname: this.ctlLastName
        }, { validator: this.crossValidations });
    }

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre.
    // Grâce au setTimeout et clearTimeout, on ne déclenche le service que s'il n'y a pas eu de frappe depuis 300 ms.
    pseudoUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const pseudo = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.authService.isAvailable(pseudo, '').subscribe(res => {
                        resolve(res ? null : { pseudoUsed: true });
                    });
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
                    this.authService.isAvailable('', email).subscribe(res => {
                        resolve(res ? null : { emailUsed: true });
                    });
                }, 300);
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

    crossValidations(group: FormGroup): ValidationErrors {
        if (!group.value) { return null; }
        // console.log(this.firstnameNotEmptyButLastnameIs(group));
        // console.log(this.lastnameNotEmptyButFirstnameIs(group));
        if (group.value.firstname !== '' && group.value.lastname === '') {
            return { lastnameRequired: true };
        }
        if (group.value.firstname === '' && group.value.lastname !== '') {
            return { firstnameRequired: true };
        }
        return group.value.password === group.value.passwordConfirm ? null : { passwordNotConfirmed: true };
    }

    forbiddenValue(val: string): any {
        return (ctl: FormControl) => {
            if (ctl.value.search(val)) {
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } };
            }
            return null;
        };
    }

    // firstnameNotEmptyButLastnameIs(group: FormGroup) {
    //     if (group.value.firstname !== '' && group.value.lastname === '') {
    //         return { lastnameRequired: true };
    //     }
    //     return { lastnameRequired: false };
    // }

    // lastnameNotEmptyButFirstnameIs(group: FormGroup) {
    //     if (group.value.firstname === '' && group.value.lastname !== '') {
    //         return { firstnameRequired: true };
    //     }
    //     return { firstnameRequired: false };
    // }

    signup() {
        this.authService.signup(this.ctlPseudo.value, this.ctlPassword.value,
            this.ctlEmail.value, this.ctlFirstName.value, this.ctlLastName.value,
            this.ctlBirthDate.value).subscribe(() => {
                if (this.authService.currentUser) {
                    // Redirect the user
                    this.router.navigate(['/']);
                }
            });
    }
}

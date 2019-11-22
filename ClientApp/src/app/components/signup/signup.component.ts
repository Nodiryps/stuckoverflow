import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

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

    constructor(
        public authService: AuthenticationService,  // pour pouvoir faire le login
        public router: Router,                      // pour rediriger vers la page d'accueil en cas de login
        private fb: FormBuilder                     // pour construire le formulaire, du côté TypeScript
    ) {
        this.ctlPseudo = this.fb.control('', [Validators.required, Validators.minLength(3)], [this.pseudoUsed()]);
        this.ctlPassword = this.fb.control('', [Validators.required, Validators.minLength(3)]);
        this.ctlPasswordConfirm = this.fb.control('', [Validators.required, Validators.minLength(3)]);
        this.ctlEmail = this.fb.control('',[]);
        this.ctlFirstName = this.fb.control('',[]);
        this.ctlLastName = this.fb.control('',[]);
        this.ctlBirthDate = this.fb.control('',[this.validateBirthDate()]);
        this.frm = this.fb.group({
            pseudo: this.ctlPseudo,
            password: this.ctlPassword,
            passwordConfirm: this.ctlPasswordConfirm,
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
                    this.authService.isPseudoAvailable(pseudo).subscribe(res => {
                        resolve(res ? null : { pseudoUsed: true });
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
        if(group.value.firstname !== '' && group.value.lastname === ''){
            return {lastnameRequired: true};
        }
        if(group.value.firstname === '' && group.value.lastname !== ''){
            return {firstnameRequired: true};
        }
        return group.value.password === group.value.passwordConfirm ? null : { passwordNotConfirmed: true };
    }

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

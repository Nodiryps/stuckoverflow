import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
//import { AuthenticationService } from 'src/app/services/authentication.service';
import { resolve } from 'path';
import { PostService } from 'src/app/services/post.service';

@Component({
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent {
    public frm: FormGroup;
    public ctlTitle: FormControl;
    public ctlBody: FormControl;


    private minLengthPseudoPasswordName: number = 3;
    private maxLengthPseudo: number = 10;
    private maxLengthName: number = 30;

    constructor(
        public postService: PostService,  // pour pouvoir faire le login
        public router: Router,                      // pour rediriger vers la page d'accueil en cas de login
        private fb: FormBuilder                     // pour construire le formulaire, du côté TypeScript
    ) {
        this.ctlTitle = this.fb.control('', 
            [
                Validators.required, 
                Validators.minLength(this.minLengthPseudoPasswordName), 
                Validators.maxLength(this.maxLengthPseudo),
                Validators.pattern(/^[a-z]+[a-z0-9._]/),
                // this.forbiddenValue('@')
            ]
        );
        this.ctlBody = this.fb.control('', 
            [
                Validators.required, 
                Validators.minLength(this.minLengthPseudoPasswordName)
            ]
        );

        this.frm = this.fb.group({
            title: this.ctlTitle,
            body: this.ctlBody,
        });

    }

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre.
    // Grâce au setTimeout et clearTimeout, on ne déclenche le service que s'il n'y a pas eu de frappe depuis 300 ms.


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

    create() {
        this.postService.create(this.ctlTitle.value, this.ctlBody.value).subscribe(() => {
                // Redirect the user
                this.router.navigate(['/']);
            
        });
    }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2'
/* Services */
import { LoginService } from '../../services/login.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { FuseConfigService } from '@fuse/services/config.service';
/* Interfaces */
import { RequestLoginModel, ResponseLoginModel } from '../../interfaces/login.interface';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _loginService: LoginService,
        private _localStorageService: LocalStorageService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    /* 
     * Properties
     */
    form: FormGroup;
    invalidLogin: boolean;
    loginEmAndamento: boolean;

    /*
     * Methods
     */
    login() {

        /* Teste */
        /*    if (this.form.value.email == 'admin' && this.form.value.senha == '123') {
    
                console.log('entrei')
                let responseFake: ResponseLoginModel = {
                    id: 1,
                    name: 'admin',
                    token: 'NFDJHBJFDBJFBDHBFDHBFHDBFHBHDNFKENJFNDJF'
                }
                this.invalidLogin = false;
                this.loginEmAndamento = false;
                this._localStorageService.set(responseFake, 'loginData');
                this._router.navigate(["/inicio/dashboard"]);
            }
            else {
                this.invalidLogin = true;
                this.loginEmAndamento = false;
                this.form.reset();
                Swal.fire('Ops!', 'Dados inválidos.', 'error');      
            }
         */

        //  Produção 
        let request: RequestLoginModel = {
            user: this.form.value.email,
            password: this.form.value.senha
        };
        this.loginEmAndamento = true;

        this._loginService.login(request).subscribe(response => {

            this.invalidLogin = false;
            this.loginEmAndamento = false;
            this._localStorageService.set(response, 'loginData');
            //TODO: deve ser passado o tipo de usuário do response
            this._localStorageService.set('1','perfilUsuario'); 
            this._router.navigate(["/inicio/dashboard"]);

        }, err => {
            this.invalidLogin = true;
            this.loginEmAndamento = false;
            this.form.reset();
            Swal.fire('Ops!', err.error.message, 'error');
        });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.form = this._formBuilder.group({
            email: [, {
                validators: [Validators.required, Validators.email],
                updateOn: "change",
            }],

            senha: ['', Validators.required]
        });
    }
}

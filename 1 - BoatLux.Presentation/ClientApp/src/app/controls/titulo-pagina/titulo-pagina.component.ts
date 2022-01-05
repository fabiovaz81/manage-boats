import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'titulo-pagina',
    templateUrl: './titulo-pagina.component.html'
})

export class ControlesTituloPaginaComponent implements OnInit {

    @Input() titulo: string;
    @Input() subTitulo: string;
    @Input() ocultaFavoritar: boolean;
    _favoritada: boolean = false;

    constructor(private _title: Title,
        private _router: Router,
        ) {
        
    }

    ngOnInit(): void {
        this._title.setTitle('BoatLux' + (this.titulo != null && this.titulo != '' ? ' - ' + this.titulo : '') + (this.subTitulo != null && this.subTitulo != '' ? ' - ' + this.subTitulo : ''));        
    }
}
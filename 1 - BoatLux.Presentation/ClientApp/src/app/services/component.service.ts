import { Injectable } from '@angular/core';
import { FuseNavigationService } from '../../@fuse/components/navigation/navigation.service';

@Injectable({
    providedIn: 'root'
})
export class ComponentService {
    constructor(private _fuseNavigationService: FuseNavigationService) { }

    public DefinirModuloAtual(modulo: Modulos) {

        switch (modulo) {

            case Modulos.Financeiro:

                // Define o menu de navegação
                this._fuseNavigationService.setCurrentNavigation('financeiro_navigation');
                break;

        }        
    }
}

export enum Modulos {
    Financeiro
}
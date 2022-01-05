import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustosFaturaAvulsaModel } from '../interfaces/financeiro.interface';
import { AdicionaCustoAvulsoComponent } from '../controls/adiciona-custo-avulso/adiciona-custo-avulso.component';

@Injectable()
export class DialogService {

    constructor(
        private _matDialog: MatDialog) { }

    abrirDialogGrande(component: any, data?: any): Observable<any> {
        const dialog = this._matDialog.open(component, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '90%',
            width: '95%',
            disableClose: true,
            data: data ? data : {}
        });

        return dialog.afterClosed().pipe(
            map(result => {

                if (result != null)
                    return result;
            }));
    }

    abrirDialogMedia(component: any, data?: any): Observable<any> {
        const dialog = this._matDialog.open(component, {
            maxWidth: '100vw',
            maxHeight: 'auto',
            height: 'auto',
            width: '80%',
            disableClose: true,
            data: data ? data : {}
        });

        return dialog.afterClosed().pipe(
            map(result => {

                if (result != null)
                    return result;
            }));
    }

    adicionaCustoAvulso(): Observable<CustosFaturaAvulsaModel> {

        const dialog = this._matDialog.open(AdicionaCustoAvulsoComponent, {
            width: '50%',
            height: '65%'
        });

        return dialog.afterClosed().pipe(
            map(result => {

                if (result != null)
                    return result;
            }));
    }
}
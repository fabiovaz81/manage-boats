import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { ReqCancelarFaturaModel } from "../../../../../interfaces/financeiro.interface";
// Services
import { FinanceiroService } from "../../../../../services/financeiro.service";

export interface DialogData {
    faturaIds: number[];
}

@Component({
    selector: 'cancela-fatura',
    templateUrl: './cancela-fatura.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class CancelaFaturaDialogComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------    
    constructor(
        public dialogRef: MatDialogRef<CancelaFaturaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private _financeiroService: FinanceiroService) {

        this.variasFaturas = data.faturaIds.length > 1;
        this.titulo = this.variasFaturas ? 'Cancelar faturas selecionadas' : 'Cancelar fatura';
        this.mensagemConfirmacao = this.variasFaturas ? "Confirma o cancelamento das faturas selecionadas?" : 'Confirma o cancelamento da fatura ' + data.faturaIds[0] + '?';
    }

    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------

    titulo: string;
    mensagemConfirmacao: string;
    variasFaturas: boolean = false;

    cancelaFaturaFormGroup = this._formBuilder.group(
        {
            observacao: []
        }
    );
    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------
    fecharModal(reload: boolean): void {
        this.dialogRef.close(reload);
    }

    cancelarFaturas(): void {

        Swal.fire({
            title: 'Aguarde...',
            html: this.variasFaturas ? 'Estamos cancelando as faturas selecionadas' : 'Estamos cancelando a fatura ' + this.data.faturaIds[0],
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });

        let requisicao: ReqCancelarFaturaModel = {
            faturaIds: this.data.faturaIds,
            observacao: this.cancelaFaturaFormGroup.value.observacao
        }

        this._financeiroService.cancelarFatura(requisicao).subscribe(resultado => {

            Swal.close();
            Swal.fire('Sucesso!',
                this.variasFaturas ? 'Faturas canceladas com sucesso!' : 'Fatura ' + this.data.faturaIds[0] + ' cancelada com sucesso!',
                'success'
            );
            this.fecharModal(true);
        }, (err) => {

            Swal.close();
            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível concluir o cancelamento de fatura. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.cancelarFaturas();
                }
            })
        });
    }
}
import { Component, Inject } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from "@angular/forms";
import Swal from "sweetalert2";
// Services
import { FinanceiroService } from "../../../../../services/financeiro.service";
// Interfaces
import { ReqAdicionarCustoModel } from "../../../../../interfaces/financeiro.interface";

@Component({
    selector: 'cadastro-custos-dialog',
    templateUrl: './cadastro-custos-dialog.component.html',
})

export class CadastroCustos_DialogComponent {
    // -----------------------------------------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------------------------------------
    constructor(
        public dialogRef: MatDialogRef<CadastroCustos_DialogComponent>,
        private _financeiroService: FinanceiroService,
        private _formBuilder: FormBuilder,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------  
    //Definição do formulário de cadastro
    cadastroFormGroup = this._formBuilder.group(
        {
            descricaoCusto: [],
            tipoCusto: ['1'],
        }
    );

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------
    fecharModal(reload: boolean): void {
        this.dialogRef.close(reload);
    }

    addCusto(): void {

        // Essa validação tá ruim. Precisa melhorar ela, validar no front-end via bootstrap
        if (this.cadastroFormGroup.value.descricaoCusto == null) {
            Swal.fire('Atenção', 'Informe a descrição do custo!', 'warning');
            return;
        }

        Swal.fire({
            title: 'Salvando',
            html: 'Estamos adicionando o novo custo, aguarde...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });

        let request: ReqAdicionarCustoModel = {
            nome: this.cadastroFormGroup.value.descricaoCusto,
            idTipoCusto: Number(this.cadastroFormGroup.value.tipoCusto),
            status: 1 // Ativo
        }

        this._financeiroService.addCusto(request).subscribe(custoId => {

            Swal.fire(
                'Sucesso!',
                'Custo ' + custoId + ' adicionado!',
                'success').then(costId => {

                    this.fecharModal(true);
                });

        }, (err) => {
            Swal.fire('Desculpe!', 'Não foi possível adicionar novo custo.' + err, 'error');
        });

    }
}
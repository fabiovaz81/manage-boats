import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
// Services
import { FinanceiroService } from "../../services/financeiro.service";
import { UtilsService } from '../../services/utils.service';
// Interfaces
import { ReqGerarSegundaViaFaturaModel } from "../../interfaces/financeiro.interface";

export interface DialogData {
    faturaIds: number[];
}

@Component({
    selector: 'gera-segunda-via-fatura',
    templateUrl: './gera-segunda-via-fatura.component.html',
})

export class GeraSegundaViaFaturaComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------    
    constructor(
        public dialogRef: MatDialogRef<GeraSegundaViaFaturaComponent>,
        public _utils: UtilsService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private _financeiroService: FinanceiroService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------

    segundaViaFormGroup = this._formBuilder.group(
        {
            dataSegundaVia: [],
            cobrarMulta: ['1'],
            cobrarJuros: ['1'],
        }
    );

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------

    gerarSegundaVia(): void {

        Swal.fire({
            title: 'Aguarde...',
            html: 'Estamos gerando 2° via',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });

        let requisicao: ReqGerarSegundaViaFaturaModel = {
            faturaIds: this.data.faturaIds,
            dataSegundaVia: this.segundaViaFormGroup.value.dataSegundaVia,
            cobrarMulta: this.segundaViaFormGroup.value.cobrarMulta,
            cobrarJuros: this.segundaViaFormGroup.value.cobrarJuros
        };

        this._financeiroService.gerarSegundaVia(requisicao).subscribe(resultado => {

            Swal.close();
            Swal.fire('Sucesso!', '2° via gerada com sucesso!', 'success');
            this.fecharJanela(true);
        }, (err) => {

            Swal.close();
            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível gerar 2° via das faturas. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.gerarSegundaVia();
                }
                else {
                    this.fecharJanela(false);
                }
            })
        });
    }

    fecharJanela(reload: boolean): void {
        this.dialogRef.close(reload)
    }
}

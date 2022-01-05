import { AfterViewInit, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
// Services
import { FinanceiroService } from "../../services/financeiro.service";
// Interfaces
import { ParcelaModel, ReqParcelasModel, ResParcelasModel } from "../../interfaces/financeiro.interface";

export interface DialogData {
    idCusto: number;
    idEmbarcacao: number;
    idCota?: number;
}

@Component({
    selector: 'visualiza-parcela',
    templateUrl: './visualiza-parcela.component.html',
})

export class VisualizaParcelaComponent implements AfterViewInit {
 
    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------    
    constructor(
        public dialogRef: MatDialogRef<VisualizaParcelaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _financeiroService: FinanceiroService) {
    }
    
    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------   
    // Lista de custos
    parcelasDataSource: ParcelaModel[];

    exibeLoading = false;
    temItens = false;

    // Grid columns
    gridColumns = ['dataVencimento', 'numeroParcela', 'valorParcela'];

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------

    obterParcelas(): void {

        this.exibeLoading = true;
        
        let requisicao: ReqParcelasModel = {
            idCusto: this.data.idCusto,
            //idEmbarcacao: this.data.idEmbarcacao,
            idCota: this.data.idCota
        }

        this._financeiroService.obterParcelasCusto(requisicao).subscribe((response: ResParcelasModel) => {

            this.exibeLoading = false;
            this.temItens = response.listaItens.length > 0;
            this.parcelasDataSource = response.listaItens;
        }, (err) => {

            this.exibeLoading = false;
            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter as parcelas. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.obterParcelas();
                }
            })
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    ngAfterViewInit(): void {
        this.obterParcelas()
    }
}

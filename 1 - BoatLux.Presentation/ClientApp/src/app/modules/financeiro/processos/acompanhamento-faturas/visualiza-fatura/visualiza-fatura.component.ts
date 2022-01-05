import { AfterViewInit, Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
// Services
import { FinanceiroService } from "../../../../../services/financeiro.service";
// Components
import { CancelaFaturaDialogComponent } from "../cancela-fatura/cancela-fatura.component";
// Interfaces
import { HistoricosFaturaModel, ItensFaturaModel, ResObterFaturaModel } from "../../../../../interfaces/financeiro.interface";
import { StatusFatura } from "../../../../../enums/status-fatura";

export interface DialogData {
    faturaId: number;
}

@Component({
    selector: 'visualiza-fatura',
    templateUrl: './visualiza-fatura.component.html',
})

export class VisualizaFaturaDialogComponent implements AfterViewInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------    
    constructor(
        public dialogRef: MatDialogRef<VisualizaFaturaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _financeiroService: FinanceiroService) {

        this.titulo = 'Fatura ' + data.faturaId;
    }

    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------
    itensDataSource: ItensFaturaModel[] = [];
    historicosDataSource: HistoricosFaturaModel[] = [];

    permiteCancelarFatura: boolean = false;
    temItens: boolean = false;
    temHistorico: boolean = false;
    tempIdHistoricoExpandido = 0;
    titulo: string;

    faturaFormGroup = this._formBuilder.group(
        {
            cotista: [],
            cota: [],
            embarcacao: [],
            valor: [],
            referencia: []
        }
    );

    colunasGridItens = ['itemId', 'descricao', 'valorItem'];
    colunasGridHistorico = ['id', 'ordemPagamento', 'linkFatura', 'status', 'dataVencimento', 'acoes'];
    colunasGridHistoricoDetalhes = [
        { nome: 'Data', coluna: 'data', visivel: true, editavel: false },
        { nome: 'Descrição', coluna: 'descricao', visivel: true, editavel: false },
        { nome: 'Notas', coluna: 'notas', visivel: true, editavel: false },
    ];

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------

    expandirHistorico(item: any) {

        if (this.tempIdHistoricoExpandido == item.id)
            this.tempIdHistoricoExpandido = 0;
        else
            this.tempIdHistoricoExpandido = item.id;
    }

    enviarBoleto(): void {

    }

    gerarSegundaVia(): void {

    }

    cancelarOrdemPagamento(): void {

    }

    fecharModal(reload: boolean): void {
        this.dialogRef.close(reload);
    }

    cancelarFatura(): void {

        const dialog = this._matDialog.open(CancelaFaturaDialogComponent, {
            data: {
                faturaIds: [this.data.faturaId]
            }
        });

        dialog.afterClosed().subscribe(resultado => {
            if (resultado)
                this.obterDadosFatura();
        });
    }

    private obterDadosFatura(): void {
        this._financeiroService.obterDadosFatura(this.data.faturaId).subscribe((resultado: ResObterFaturaModel) => {

            if (resultado != null) {

                this.faturaFormGroup.patchValue({
                    cotista: resultado.cotista + '-' + resultado.emailCotista,
                    cota: resultado.cota,
                    embarcacao: resultado.embarcacao,
                    valor: resultado.valor,
                    referencia: resultado.referencia
                });

                this.permiteCancelarFatura = resultado.status != StatusFatura.Cancelada && resultado.status != StatusFatura.Paga;
                this.temItens = resultado.itens != null && resultado.itens.length > 0;
                this.temHistorico = resultado.historicos != null && resultado.historicos.length > 0;

                this.itensDataSource = resultado.itens;
                this.historicosDataSource = resultado.historicos;
            }
        }, (err) => {

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter dados da fatura. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.obterDadosFatura();
                }
            })
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // LifeCycle Hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit(): void {

        this.obterDadosFatura();
    }
}

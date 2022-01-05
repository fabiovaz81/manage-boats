import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FuseNavigationService } from "../../../../../@fuse/components/navigation/navigation.service";
import Swal from "sweetalert2";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material/dialog";
import * as XLSX from 'xlsx';
// Services
import { FinanceiroService } from "../../../../services/financeiro.service";
import { UtilsService } from "../../../../services/utils.service";
import { DialogService } from "../../../../services/dialog.service";
// Components
import { GeraSegundaViaFaturaComponent } from "../../../../controls/gera-segunda-via-fatura/gera-segunda-via-fatura.component";
import { VisualizaFaturaDialogComponent } from "./visualiza-fatura/visualiza-fatura.component";
import { CancelaFaturaDialogComponent } from "./cancela-fatura/cancela-fatura.component";
import { ControlesLegendaComponent } from '../../../../controls/legenda/legenda.component';
// Interfaces
import { FaturasModel, ReqExportarDadosFaturasModel, ResBuscarFaturasModel } from "../../../../interfaces/financeiro.interface";
import { StatusFatura } from "../../../../enums/status-fatura";

@Component({
    selector: 'acompanhamento-faturas',
    templateUrl: './acompanhamento-faturas.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AcompanhamentoFaturasComponent implements AfterViewInit {

    // -----------------------------------------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------------------------------------
    constructor(
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _fuseNavigationService: FuseNavigationService,
        private _financeiroService: FinanceiroService,
        public _utilsService: UtilsService,
    ) {
        // Navigation
        this._fuseNavigationService.setCurrentNavigation('financeiro_navigation');
    }

    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------
    // Injected Properties
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('legenda') legenda: ControlesLegendaComponent;

    // Fonte de dados
    itensDataSource: FaturasModel[];
    selection = new SelectionModel<Number>(true, []);
    selectionModel: FaturasModel[] = [];

    //Flags 
    exibeLoading = false;
    temItens = false;

    // Search Form definition
    buscaFormGroup = this._formBuilder.group(
        {


        }
    );

    // Grid columns
    gridColumns = ['select', 'faturaId', 'franquia', 'embarcacao', 'cota', 'mesReferencia', 'dataVencimento', 'valorFatura', 'status', 'acoes'];

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------

    isAllSelected() {

        var allSelected = true;
        this.itensDataSource.forEach(i => {
            if (!this.selection.isSelected(i.faturaId)) {
                allSelected = false;
            }
        });
        return allSelected;
    }

    masterToggle() {
        if (this.isAllSelected()) {
            this.itensDataSource.forEach(i => {
                if (this.selection.isSelected(i.faturaId)) {
                    this.selection.toggle(i.faturaId);
                    this.addSelectionModel(i, false);
                }
            });
        }
        else {
            this.itensDataSource.forEach(row => {
                this.selection.select(row.faturaId);
                this.addSelectionModel(row, true);
            });

        }
    }

    addSelectionModel(item: FaturasModel, checked: boolean): void {

        if (checked) {
            if (this.selectionModel.indexOf(item) === -1) {
                this.selectionModel.push(item);
            }
        }
        else {
            this.selectionModel.splice(this.selectionModel.indexOf(item), 1);
        }
    }

    getFileName = (name: string) => {
        let timeSpan = new Date().toISOString();
        let sheetName = name || "ExportResult";
        let fileName = `${sheetName}-${timeSpan}`;
        return {
            sheetName,
            fileName
        };
    };

    exportarExcel(): void {

        Swal.fire({
            title: 'Aguarde...',
            html: 'Estamos exportando dados para excel',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });
        let requisicao: ReqExportarDadosFaturasModel = {

        }

        this._financeiroService.exportarDadosFaturas(requisicao).subscribe(resultado => {

            Swal.close();

            if (resultado != null && resultado.length > 0) {
                let { sheetName, fileName } = this.getFileName('Boatlux');

                var wb = XLSX.utils.book_new();
                var ws = XLSX.utils.json_to_sheet(resultado);
                XLSX.utils.book_append_sheet(wb, ws, sheetName);
                XLSX.writeFile(wb, `${fileName}.xlsx`);
            }
            else {

                Swal.fire('Atenção!', 'Não encontramos faturas para exportação de excel. Verifique os filtros e tente novamente', 'warning');
            }


        }, (err) => {

            Swal.close();

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter faturas para exportação de excel. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.exportarExcel();
                }
            })
        });

    }

    buscarItens(novaBusca: boolean): void {

        if (novaBusca) {
            this.selection.clear();
            this.selectionModel = [];
            this.paginator.pageIndex = 0;
        }

        this.exibeLoading = true;
        this.temItens = false;

        let requisicao = {
            paginacao: {
                paginaAtual: this.paginator.pageIndex,
                itensPorPagina: this.paginator.pageSize,
                colunaOrdenacao: this.sort.active,
                direcaoOrdenacao: this.sort.direction
            },
        };

        this._financeiroService.buscarFaturas(requisicao).subscribe((resultado: ResBuscarFaturasModel) => {

            resultado.listaItens.forEach(item => {
                item.dataVencimentoFormatada = this._utilsService.formatarDataString(item.dataVencimento, "DD/MM/YYYY");
                item.mesReferencia = item.mesReferencia.substring(0, 4) + "/" + item.mesReferencia.substring(4, 6);
            });

            this.exibeLoading = false;
            this.temItens = resultado.listaItens.length > 0;
            this.itensDataSource = resultado.listaItens;

            this.legenda.quantidadeResultados = resultado.paginacao.totalItens;
            this.paginator.length = resultado.paginacao.totalItens;
            this.paginator.page.subscribe(() => {
                //este trecho vai ser executado quando houver uma mudança de página ou tamanho da página

            });

        }, (err) => {

            this.exibeLoading = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível concluir a busca de faturas. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.buscarItens(true);
                }
            })
        });
    }

    gerarSegundaViaEmLote(): void {

        if (this.selection.selected.length > 0) {

            const dialog = this._matDialog.open(GeraSegundaViaFaturaComponent, {
                width: '400px',
                data: {
                    faturaIds: this.selection.selected
                }
            });

            dialog.afterClosed().subscribe(resultado => {
                if (resultado)
                    this.buscarItens(false);
            });
        }
        else {
            Swal.fire('Atenção!', 'Selecione faturas para gerar 2° via', 'warning');
        }
    }

    cancelarFaturaEmLote(): void {

        if (this.selection.selected.length == 0)
            throw Swal.fire('Atenção!', 'Selecione faturas para cancelar.', 'warning');

        var idsSelecionadosValidos = this.selectionModel.filter(i => i.status != StatusFatura.Cancelada && i.status != StatusFatura.Paga).map(i => i.faturaId);

        if (idsSelecionadosValidos.length > 0) {

            const dialog = this._matDialog.open(CancelaFaturaDialogComponent, {
                data: {
                    faturaIds: idsSelecionadosValidos
                }
            });

            dialog.afterClosed().subscribe(resultado => {
                if (resultado)
                    this.buscarItens(false);
            });
        }
        else {
            Swal.fire('Atenção!', 'Permitido o cancelamento somente de faturas que não foram pagas e que não estão canceladas. Verifique as faturas selecionadas.', 'warning');
        }
    }

    visualizarFatura(faturaId: number): void {

        this._dialogService.abrirDialogMedia(VisualizaFaturaDialogComponent, {
            faturaId: faturaId
        }).subscribe(resultado => {

            if (resultado) {
                this.buscarItens(true);
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngAfterViewInit(): void {

        this.paginator.page.subscribe(() => {
            this.buscarItens(false);
        });
        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
            this.buscarItens(false);
        });
    }

}
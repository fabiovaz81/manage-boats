import { AfterViewInit, ViewEncapsulation, Component, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
// Services
import { FuseNavigationService } from "../../../../../@fuse/components/navigation/navigation.service";
import { DialogService } from "../../../../services/dialog.service";
import { FinanceiroService } from "../../../../services/financeiro.service";
import { DATE_PICKER_MONTH_YEAR } from "../../../../services/constants.service";
// Interface
import { CentroCustosModel, ReqBuscarCentroCustosModel, ReqGerarFaturaModel, ResBuscarCentroCustosModel } from "../../../../interfaces/financeiro.interface";
// Components
import { FaturaEmbarcacao_DialogComponent } from './fatura-embarcacao-dialog/fatura-embarcacao-dialog.component';
import { GeraFaturaAvulsaComponent } from '../../../../controls/gera-fatura-avulsa/gera-fatura-avulsa.component';
import { MatDialog } from "@angular/material/dialog";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
import { UtilsService } from "../../../../services/utils.service";

@Component({
    selector: 'centro-custos',
    templateUrl: './centro-custos.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_MONTH_YEAR },
    ],
})

export class CentroCustosComponent implements AfterViewInit {

    // -----------------------------------------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------------------------------------
    constructor(
        public _utils: UtilsService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _fuseNavigationService: FuseNavigationService,
        private _financeiroService: FinanceiroService,
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

    // Lista de custos
    centroCustosDataSource: CentroCustosModel[];

    //Flags 
    exibeLoading = false;
    temItens = false;
    dataFaturamentoEhRetroativa = false;

    dataFaturamento = new FormControl(moment());

    // Search Form definition
    buscaFormGroup = this._formBuilder.group(
        {
            embarcacao: [],
            franquia: [],
            cotas: [],
            custos: [],

        }
    );

    // Grid columns
    gridColumns = ['centroCustosId', 'embarcacao', 'franquia', 'cotas', 'custos', 'acoes'];

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------

    // Eventos de data
    chosenYearHandler(normalizedYear) {
        const ctrlValue = this.dataFaturamento.value;
        ctrlValue.year(normalizedYear.year());
        this.dataFaturamento.setValue(ctrlValue);
    }

    chosenMonthHandler(normalizedMonth, datepicker) {
        const ctrlValue = this.dataFaturamento.value;
        ctrlValue.month(normalizedMonth.month());
        this.dataFaturamento.setValue(ctrlValue);
        datepicker.close();
    }

    reset(): void {
        this.buscaFormGroup.reset();
        this.dataFaturamento.setValue(moment());
        this.buscarItens(true);
    }

    buscarItens(novaBusca: boolean): void {

        if (novaBusca)
            this.paginator.pageIndex = 0;

        this.exibeLoading = true;
        this.temItens = false;

        let request: ReqBuscarCentroCustosModel =
        {
            paginacao: {
                paginaAtual: this.paginator.pageIndex,
                itensPorPagina: this.paginator.pageSize,
                colunaOrdenacao: this.sort.active,
                direcaoOrdenacao: this.sort.direction
            },
            embarcacao: this.buscaFormGroup.value.embarcacao,
            franquia: this.buscaFormGroup.value.franquia,
            cota: this.buscaFormGroup.value.cotas,
            custo: Number(this.buscaFormGroup.value.custo),
            dataFaturamento: this.dataFaturamento.value
        };

        this._financeiroService.buscarCentroCustos(request).subscribe((response: ResBuscarCentroCustosModel) => {

            this.dataFaturamentoEhRetroativa = moment().isAfter(this.dataFaturamento.value, 'day');
            this.exibeLoading = false;
            this.temItens = response.listaItens.length > 0;
            this.centroCustosDataSource = response.listaItens;

            this.paginator.length = response.paginacao.totalItens;
            this.paginator.page.subscribe(() => {
                //este trecho vai ser executado quando houver uma mudança de página ou tamanho da página

            });

        }, (err) => {

            this.exibeLoading = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível concluir a busca de centro de custos. Deseja tentar novamente?",
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

    // Esse método deve gerar fatura e enviar boleto
    gerarFatura(embarcacaoId: number): void {
        Swal.fire({
            title: 'Aguarde...',
            html: 'Estamos gerando a fatura',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });
        let requisicao: ReqGerarFaturaModel = {
            embarcacaoId: embarcacaoId,
            mesFaturamento: this.dataFaturamento.value
        }

        this._financeiroService.gerarFatura(requisicao).subscribe(resultado => {

            Swal.close();

            Swal.fire('Sucesso!', 'Fatura gerada', 'success');

        }, (err) => {

            Swal.close();

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível gerar fatura. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.gerarFatura(embarcacaoId);
                }
            })
        });
    }

    gerarFaturaAvulsa(item: CentroCustosModel): void {

        this._dialogService.abrirDialogGrande(GeraFaturaAvulsaComponent, {
            embarcacaoId: item.embarcacaoId,
            embarcacao: item.embarcacao
        }).subscribe(reload => {

            if (reload)
                this.buscarItens(false);
        });
    }

    visualizarEmbarcacao(embarcacao: CentroCustosModel) {

        this._dialogService.abrirDialogGrande(FaturaEmbarcacao_DialogComponent, {
            embarcacao: embarcacao,
            dataFaturamento: this.dataFaturamento.value
        }).subscribe(reload => {

            if (reload)
                this.buscarItens(true);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // Lifecycle Hooks
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

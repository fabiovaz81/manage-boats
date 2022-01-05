import { AfterViewInit, ViewEncapsulation, Component, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
// Services
import { FuseNavigationService } from "../../../../../@fuse/components/navigation/navigation.service";
import { FinanceiroService } from "../../../../services/financeiro.service";
// Interface
import { CustosModel, ReqBuscarCustosModel, ResBuscarCustosModel } from "../../../../interfaces/financeiro.interface";
// Components
import { ControlesLegendaComponent } from "../../../../controls/legenda/legenda.component";
import { CadastroCustos_DialogComponent } from "./cadastro-custos-dialog/cadastro-custos-dialog.component";
import { UtilsService } from "../../../../services/utils.service";

@Component({
    selector: 'custos',
    templateUrl: './custos.component.html',
    encapsulation: ViewEncapsulation.None
})

export class CustosComponent implements AfterViewInit {

    // -----------------------------------------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------------------------------------
    constructor(
        public _utils: UtilsService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
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
    @ViewChild('legenda') legenda: ControlesLegendaComponent;

    // Lista de custos
    custosDataSource: CustosModel[];

    //Flag loading
    exibeLoading = false;
    temItens = false;

    // Search Form definition
    buscaFormGroup = this._formBuilder.group(
        {
            custoId: [],
            descricao: [],
            tipoCusto: [],
            ativos: ['1'],
        }
    );

    // Grid columns
    gridColumns = ['custoId', 'descricao', 'tipoCusto', 'status', 'acoes'];

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------
    reset(): void {
        this.buscaFormGroup.reset();
        this.buscarItens(true);
    }

    buscarItens(novaBusca: boolean): void {

        if (novaBusca)
            this.paginator.pageIndex = 0;

        this.exibeLoading = true;
        this.temItens = false;

        let request: ReqBuscarCustosModel =
        {
            paginacao: {
                paginaAtual: this.paginator.pageIndex,
                itensPorPagina: this.paginator.pageSize,
                colunaOrdenacao: this.sort.active,
                direcaoOrdenacao: this.sort.direction
            },

            custoId: Number(this.buscaFormGroup.value.custoId),
            descricao: this.buscaFormGroup.value.descricao,
            tipoCusto: Number(this.buscaFormGroup.value.tipoCusto),
            ativos: Boolean(this.buscaFormGroup.value.ativos)
        };

        this._financeiroService.buscarCustos(request).subscribe((response: ResBuscarCustosModel) => {

            this.exibeLoading = false;
            this.temItens = response.listaItens.length > 0;
            this.custosDataSource = response.listaItens;

            this.legenda.quantidadeResultados = response.paginacao.totalItens;
            this.paginator.length = response.paginacao.totalItens;

        }, (err) => {

            this.exibeLoading = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível concluir a busca de custos. Deseja tentar novamente?",
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
            });
        });
    }

    alterarStatus(custoId: number, status: number): void {

        this._financeiroService.alterarStatusCustos(custoId, Number(!status)).subscribe(response => {

            Swal.fire({
                title: 'Sucesso!',
                text: "Custo " + (status == 1 ? " desativado " : " ativado") + " com sucesso.",
                icon: 'success'
            });

        this.buscarItens(false);

        }, (err) => {

            this.exibeLoading = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível " + (status == 1 ? "desativar" : "ativar") + " o custo.",
                icon: 'error'
            });
        });
    }

    novoCusto(): void {

        const dialog = this._matDialog.open(CadastroCustos_DialogComponent, {
            width: '60%'
        });

        dialog.afterClosed().subscribe(reload => {

            if (reload)
                this.buscarItens(false);
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
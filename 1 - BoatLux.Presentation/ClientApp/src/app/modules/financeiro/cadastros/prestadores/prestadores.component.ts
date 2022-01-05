import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
// Services
import { FuseNavigationService } from "../../../../../@fuse/components/navigation/navigation.service";
import { FinanceiroService } from "../../../../services/financeiro.service";
// Components
import { ControlesLegendaComponent } from "../../../../controls/legenda/legenda.component";
import { CadastroPrestador_DialogComponent } from '../prestadores/cadastro-prestador-dialog/cadastro-prestador-dialog.component';
// Interfaces
import { PrestadorModel, ReqBuscarPrestadoresModel, ResBuscarPrestadoresModel } from "../../../../interfaces/financeiro.interface";
import { UtilsService } from "../../../../services/utils.service";


@Component({
    selector: 'prestadores',
    templateUrl: './prestadores.component.html',
    encapsulation: ViewEncapsulation.None
})

export class PrestadoresComponent implements AfterViewInit {

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

    prestadoresDataSource: PrestadorModel[];
    exibeLoading = false;
    temItens = false;

    // Search Form definition
    buscaFormGroup = this._formBuilder.group(
        {
            prestadorId: [],
            razaoFantasia: [],
            cpfCnpj: [],
            ativos: ['1'],
        }
    );

    // Grid columns
    gridColumns = ['prestadorId', 'razao', 'cfpCnpj', 'status', 'acoes'];

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------
    reset(): void {
        this.buscaFormGroup.reset();
        this.buscarPrestadores(true);
    }

    buscarPrestadores(ehNovaBusca: boolean): void {

        if (ehNovaBusca)
            this.paginator.pageIndex = 0;

        this.exibeLoading = true;
        this.temItens = false;

        let requisicao: ReqBuscarPrestadoresModel = {

            paginacao: {
                paginaAtual: this.paginator.pageIndex,
                itensPorPagina: this.paginator.pageSize,
                colunaOrdenacao: this.sort.active,
                direcaoOrdenacao: this.sort.direction
            },

            prestadorId: Number(this.buscaFormGroup.value.prestadorId),
            razaoFantasia: this.buscaFormGroup.value.razaoFantasia,
            cnpjCpf: this.buscaFormGroup.value.cpfCnpj,
            ativos: Boolean(this.buscaFormGroup.value.ativos),
        }

        this._financeiroService.buscarPrestadores(requisicao).subscribe((result: ResBuscarPrestadoresModel) => {

            this.exibeLoading = false;
            this.temItens = result.listaItens.length > 0;
            this.prestadoresDataSource = result.listaItens;
            this.legenda.quantidadeResultados = result.paginacao.totalItens;
            this.paginator.length = result.paginacao.totalItens;
        }, (err) => {

            this.exibeLoading = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível concluir a busca de prestadores. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.buscarPrestadores(true);
                }
            });
        });
    }

    alterarStatus(prestadorId: number, status: number): void {

        this._financeiroService.alterarStatusPrestador(prestadorId, Number(!status)).subscribe(response => {

            Swal.fire({
                title: 'Sucesso!',
                text: "Prestador " + (status == 1 ? " desativado " : " ativado") + " com sucesso.",
                icon: 'success'
            });

            this.buscarPrestadores(false);

        }, (err) => {

            this.exibeLoading = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível " + (status == 1 ? "desativar" : "ativar") + " o prestador.",
                icon: 'error'
            });
        });
    }

    editarPrestador(prestador: PrestadorModel): void {

        const dialog = this._matDialog.open(CadastroPrestador_DialogComponent, {
            width: '60%',
            data: {
                prestador: prestador
            }
        });

        dialog.afterClosed().subscribe(reload => {

            if (reload)
                this.buscarPrestadores(false);
        });
    }

    novoPrestador(): void {

        const dialog = this._matDialog.open(CadastroPrestador_DialogComponent, {
            width: '60%'
        });

        dialog.afterClosed().subscribe(reload => {

            if (reload)
                this.buscarPrestadores(false);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    ngAfterViewInit(): void {

        this.paginator.page.subscribe(() => {
            this.buscarPrestadores(false);
        });
        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
            this.buscarPrestadores(false);
        });
    }
}

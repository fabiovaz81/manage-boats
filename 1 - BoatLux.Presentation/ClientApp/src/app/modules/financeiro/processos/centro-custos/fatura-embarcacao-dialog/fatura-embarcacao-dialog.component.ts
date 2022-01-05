import { AfterViewInit, Component, Inject } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from "sweetalert2";
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DATE_PICKER_MONTH_YEAR } from "../../../../../services/constants.service";
// Services
import { FinanceiroService } from "../../../../../services/financeiro.service";
import { DialogService } from "../../../../../services/dialog.service";
// Components
import { AdicionaCustoComponent } from "../../../../../controls/adiciona-custo/adiciona-custo.component";
import { GeraFaturaAvulsaComponent } from "../../../../../controls/gera-fatura-avulsa/gera-fatura-avulsa.component";
import { VisualizaParcelaComponent } from "../../../../../controls/visualiza-parcela/visualiza-parcela.component";
// Interfaces e Enums
import {
    CentroCustosModel, CustoFixoCotaModel, CustoFixoEmbarcacaoModel, CustoVariavelCotaModel, CustoVariavelEmbarcacaoModel, DemonstrativoCustosModel,
    FaturaAvulsaModel, ResBuscarDemonstrativoCustosModel, ReqAtualizarTaxaAdm, ResObterTaxaAdmModel, ReqInativarCustoModel
} from "../../../../../interfaces/financeiro.interface";
import { ModalidadeCusto } from '../../../../../enums/modalidade-custo';
import { PerfilUsuario } from '../../../../../enums/perfil-usuario';
import { TipoCusto } from "../../../../../enums/tipo-custo";

export interface ControlesFaturaEmbarcacaoComponentData {
    embarcacao: CentroCustosModel;
    dataFaturamento: Date;
}

@Component({
    selector: 'fatura-embarcacao-dialog',
    templateUrl: './fatura-embarcacao-dialog.component.html',
    styleUrls: ['./fatura-embarcacao-dialog.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_MONTH_YEAR },
    ],
})

export class FaturaEmbarcacao_DialogComponent implements AfterViewInit {
    // -----------------------------------------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------------------------------------
    constructor(
        public dialogRef: MatDialogRef<FaturaEmbarcacao_DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ControlesFaturaEmbarcacaoComponentData,
        private _financeiroService: FinanceiroService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _dialogService: DialogService
    ) {
        this.descricaoEmbarcacao = data.embarcacao.embarcacao;
        this.cotas = "Cotas: " + data.embarcacao.cotasUsadas + "/" + data.embarcacao.totalCotas;
        this.totalEmbarcacao = "R$ " + data.embarcacao.custo;
        this.dataFaturamentoEhRetroativa = moment().isAfter(this.data.dataFaturamento, 'day');

        this.obterTaxaAdministracao();
    }


    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------  

    //Armazena em memória
    demonstrativoCustosDataSource: DemonstrativoCustosModel[];
    faturaAvulsaDataSource: FaturaAvulsaModel[];
    embarcacaoCustosFixosDataSource: CustoFixoEmbarcacaoModel[];
    embarcacaoCustosVariaveisDataSource: CustoVariavelEmbarcacaoModel[];
    cotaCustosFixosDataSource: CustoFixoCotaModel[];
    cotaCustosVariaveisDataSource: CustoVariavelCotaModel[];

    resObterTaxaAdmModel: ResObterTaxaAdmModel;

    // Flag Loadings
    // Demonstrativos
    exibeLoadingDemonstrativo: boolean = false;
    temDemonstrativo = false;
    tempIdCotaExpandida = 0;
    // Embarcação - Custos fixos
    exibeLoadingCustoFixoEmbarcacao = false;
    temCustoFixoEmbarcacao = false;
    // Embarcação - Custos variáveis
    exibeLoadingCustoVariavelEmbarcacao = false;
    temCustoVariavelEmbarcacao = false;
    // Cotas - Custos fixos
    exibeLoadingCustoFixoCota = false;
    temCustoFixoCota = false;
    // Cotas - Custos variáveis
    exibeLoadingCustoVariavelCota = false;
    temCustoVariavelCota = false;
    // Fatura avulsa
    exibeLoadingFaturas = false;
    temFaturas = false;

    // Dados da embarcação
    descricaoEmbarcacao: string;
    cotas: string;
    totalEmbarcacao: string
    dataFaturamentoEhRetroativa = false;
    taxaAdministracao: number = 0.00;
    taxaAdministracaoInicial: number = 0.00;
    habilitaEdicaoTaxaAdministracao: boolean = false;

    dataFaturaAvulsa = new FormControl(moment());
    dataReferenciaEmbarcacao = new FormControl(moment());
    dataReferenciaCotas = new FormControl(moment());

    //Colunas do grid
    colunasEmbarcacaoCustoFixo = ['id', 'custo', 'valor', 'observacao', 'acoes'];
    colunasEmbarcacaoCustoVariavel = ['id', 'custo', 'referenciaFatura', 'parcelas', 'valor', 'observacao', 'acoes'];
    colunasFaturaAvulsa = ['faturaId', 'cotaFatura', 'dataVencimento', 'valorFatura'];

    colunasCotas = ['cota', 'total'];
    colunasCotasCustoFixo = [
        { nome: 'ID', coluna: 'id', visivel: true, editavel: false },
        { nome: 'Descrição do custo', coluna: 'descricaoCusto', visivel: true, editavel: false },
        { nome: 'R$ Custo', coluna: 'valor', visivel: true, editavel: false },
        { nome: 'Ações', coluna: 'acoes', visivel: true, editavel: false },
    ];
    colunasCotasCustoVariavel = [
        { nome: 'ID', coluna: 'id', visivel: true, editavel: false },
        { nome: 'Descrição do custo', coluna: 'descricaoCusto', visivel: true, editavel: false },
        { nome: 'Mês referência', coluna: 'referenciaFatura', visivel: true, editavel: false },
        { nome: 'Parcelas', coluna: 'parcelas', visivel: true, editavel: false },
        { nome: 'R$ Custo', coluna: 'valor', visivel: true, editavel: false },
        { nome: 'Ações', coluna: 'acoes', visivel: true, editavel: false },
    ];

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------

    // Eventos de data
    chosenYearHandler(normalizedYear) {
        const ctrlValue = this.dataFaturaAvulsa.value;
        ctrlValue.year(normalizedYear.year());
        this.dataFaturaAvulsa.setValue(ctrlValue);
    }

    chosenMonthHandler(normalizedMonth, datepicker) {
        const ctrlValue = this.dataFaturaAvulsa.value;
        ctrlValue.month(normalizedMonth.month());
        this.dataFaturaAvulsa.setValue(ctrlValue);
        datepicker.close();
    }

    chosenYearHandlerEmbarcacao(normalizedYear) {
        const ctrlValue = this.dataReferenciaEmbarcacao.value;
        ctrlValue.year(normalizedYear.year());
        this.dataReferenciaEmbarcacao.setValue(ctrlValue);
    }

    chosenMonthHandlerEmbarcacao(normalizedMonth, datepicker) {
        const ctrlValue = this.dataReferenciaEmbarcacao.value;
        ctrlValue.month(normalizedMonth.month());
        this.dataReferenciaEmbarcacao.setValue(ctrlValue);
        datepicker.close();
    }

    chosenYearHandlerCotas(normalizedYear) {
        const ctrlValue = this.dataReferenciaCotas.value;
        ctrlValue.year(normalizedYear.year());
        this.dataReferenciaCotas.setValue(ctrlValue);
    }

    chosenMonthHandlerCotas(normalizedMonth, datepicker) {
        const ctrlValue = this.dataReferenciaCotas.value;
        ctrlValue.month(normalizedMonth.month());
        this.dataReferenciaCotas.setValue(ctrlValue);
        datepicker.close();
    }

    fecharModal(reload: boolean): void {
        this.dialogRef.close(reload);
    }

    // Métodos da aba Demonstrativos
    gerarFatura(): void {

    }

    enviarBoleto(): void {

    }

    expandirCota(item: DemonstrativoCustosModel) {

        if (this.tempIdCotaExpandida == item.cotaId)
            this.tempIdCotaExpandida = 0;
        else
            this.tempIdCotaExpandida = item.cotaId;
    }

    lancarCusto(): void {

        this._dialogService.abrirDialogMedia(
            AdicionaCustoComponent, {
            embarcacaoId: this.data.embarcacao.embarcacaoId
        },
        ).subscribe(result => {
            // Evento quando fecha o componente
        });
    }

    removerCustoEmbarcacao(custoId: number): void {

    }

    carregarDemonstrativo(): void {

        this.exibeLoadingDemonstrativo = true;
        this.temDemonstrativo = false;

        this._financeiroService.buscarDemonstrativoCustos(this.data.embarcacao.embarcacaoId, moment(this.data.dataFaturamento).format('YYYY-MM-DD')).subscribe((response: ResBuscarDemonstrativoCustosModel) => {

            this.exibeLoadingDemonstrativo = false;
            this.temDemonstrativo = response.listaItens.length > 0;
            this.demonstrativoCustosDataSource = response.listaItens

        }, (err) => {

            this.exibeLoadingDemonstrativo = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter o demonstrativo das cotas. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.carregarDemonstrativo();
                }
            })
        });
    }

    adicionarFaturaAvulsa(): void {

        this._dialogService.abrirDialogGrande(GeraFaturaAvulsaComponent, {
            embarcacaoId: this.data.embarcacao.embarcacaoId,
            embarcacao: this.data.embarcacao.embarcacao,
        }).subscribe(reload => {

            //if (reload)
            //this.buscarFaturasAvulsas(false);
        });
    }

    buscarFaturasAvulsas(): void {

        this.exibeLoadingFaturas = true;
        this.temFaturas = false;

        this._financeiroService.buscarFaturasAvulsas(this.data.embarcacao.embarcacaoId, moment(this.dataFaturaAvulsa.value).format('YYYY-MM-DD')).subscribe(resposta => {

            this.exibeLoadingFaturas = false;
            this.temFaturas = resposta.listaItens.length > 0;
            this.faturaAvulsaDataSource = resposta.listaItens

        }, (err) => {

            this.exibeLoadingFaturas = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter faturas avulsas. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.buscarFaturasAvulsas();
                }
            })
        });
    }

    buscarCustosEmbarcacao(): void {

        this.carregarCustosFixosEmbarcacao();
        this.carregarCustosVariaveisEmbarcacao();

    }

    buscarCustosCotas(): void {

        this.carregarCustosFixosCotas();
        this.carregarCustosVariaveisCotas();
    }

    atualizarTaxaAdministracao(): void {

        this.habilitaEdicaoTaxaAdministracao = false;

        console.log(this.taxaAdministracao);

        Swal.fire({
            title: 'Atenção!',
            text: "Confirma a atualização da taxa de administração?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim!',
            cancelButtonText: 'Não!'
        }).then((result) => {
            if (result.value) {

                Swal.fire({
                    title: 'Aguarde...',
                    html: 'Estamos atualizando a taxa de administração',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }
                });
                this.enviarAtualizarTaxaAdministracao();
            }
            else {
                this.taxaAdministracao = this.taxaAdministracaoInicial;
            }
        });
    }

    desabilitarCusto(id: number, tipoCusto: TipoCusto, cotaId?: number): void {
        Swal.fire({
            title: 'Atenção!',
            text: 'O custo ' + id + ' será desabilitado. Confirma a operação?',
            icon: 'warning',
            input: 'checkbox',
            inputPlaceholder: 'Desativar todas as parcelas desse custo',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim!',
            cancelButtonText: 'Não!',
            onOpen: function () {

                if (tipoCusto == TipoCusto.CustoFixoEmbarcacao || tipoCusto == TipoCusto.CustoFixoCota)
                    Swal.disableInput();
            }
        }).then(result => {

            if (result.isDismissed) return;

            let requisicao: ReqInativarCustoModel = {
                id: id,
                tipoCusto: tipoCusto,
                idEmbarcacao: this.data.embarcacao.embarcacaoId,
                idCota: cotaId,
                desativarParcelasFuturas: Boolean(result.value)
            }

            this._financeiroService.desabilitarCusto(requisicao).subscribe(resposta => {

                Swal.fire('Sucesso!', 'Custo desabilitado com sucesso!', 'success');

                switch (tipoCusto) {

                    case TipoCusto.CustoFixoEmbarcacao:
                        this.carregarCustosFixosEmbarcacao();
                        break;
                    case TipoCusto.CustoVariavelEmbarcacao:
                        this.carregarCustosVariaveisEmbarcacao();
                        break;
                    case TipoCusto.CustoFixoCota:
                        this.carregarCustosFixosCotas();
                        break;
                    case TipoCusto.CustoVariavelCota:
                        this.carregarCustosVariaveisCotas();
                        break;
                }
            }, (err) => {

                Swal.fire('Desculpe!', "Não foi possível desabilitar o custo.", 'error');
            });
        });
    }

    visualizarParcelas(idCusto: number, idCota?: number): void {

        this._matDialog.open(VisualizaParcelaComponent, {
            width: '40%',
            data: {
                idCusto: idCusto,
                idEmbarcacao: this.data.embarcacao.embarcacaoId,
                idCota: idCota
            }
        });
    }

    private carregarCustosFixosEmbarcacao(): void {
        this.exibeLoadingCustoFixoEmbarcacao = true;
        this.temCustoFixoEmbarcacao = false;

        this._financeiroService.buscarCustosFixosEmbarcacao(this.data.embarcacao.embarcacaoId).subscribe(resposta => {

            this.exibeLoadingCustoFixoEmbarcacao = false;
            this.temCustoFixoEmbarcacao = resposta.listaItens.length > 0;
            this.embarcacaoCustosFixosDataSource = resposta.listaItens

        }, (err) => {

            this.exibeLoadingCustoFixoEmbarcacao = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter os custos fixos da embarcação. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.carregarCustosFixosEmbarcacao();
                }
            })
        });
    }

    private carregarCustosVariaveisEmbarcacao(): void {

        this.exibeLoadingCustoVariavelEmbarcacao = true;
        this.temCustoVariavelEmbarcacao = false;

        this._financeiroService.buscarCustosVariaveisEmbarcacao(this.data.embarcacao.embarcacaoId, moment(this.dataReferenciaEmbarcacao.value).format('YYYY-MM-DD')).subscribe(resposta => {

            this.exibeLoadingCustoVariavelEmbarcacao = false;
            this.temCustoVariavelEmbarcacao = resposta.listaItens.length > 0;
            this.embarcacaoCustosVariaveisDataSource = resposta.listaItens

        }, (err) => {

            this.exibeLoadingCustoVariavelEmbarcacao = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter os custos variáveis da embarcação. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.carregarCustosVariaveisEmbarcacao();
                }
            })
        });
    }

    private carregarCustosFixosCotas(): void {

        this.exibeLoadingCustoFixoCota = true;
        this.temCustoFixoCota = false;

        this._financeiroService.buscarCustosFixosCota(this.data.embarcacao.embarcacaoId).subscribe(resposta => {

            this.exibeLoadingCustoFixoCota = false;
            this.temCustoFixoCota = resposta.listaItens.length > 0;
            this.cotaCustosFixosDataSource = resposta.listaItens;

        }, (err) => {

            this.exibeLoadingCustoFixoCota = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter os custos fixos das cotas. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.carregarCustosFixosCotas();
                }
            })
        });
    }

    private carregarCustosVariaveisCotas(): void {

        this.exibeLoadingCustoVariavelCota = true;
        this.temCustoVariavelCota = false;

        this._financeiroService.buscarCustosVariaveisCota(this.data.embarcacao.embarcacaoId, moment(this.dataReferenciaCotas.value).format('YYYY-MM-DD')).subscribe(resposta => {

            this.exibeLoadingCustoVariavelCota = false;
            this.temCustoVariavelCota = resposta.listaItens.length > 0;
            this.cotaCustosVariaveisDataSource = resposta.listaItens;

        }, (err) => {

            this.exibeLoadingCustoVariavelCota = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter os custos fixos das cotas. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.carregarCustosFixosCotas();
                }
            })
        });
    }

    private enviarAtualizarTaxaAdministracao(): void {

        //TODO: Acertar o tipo depois com o gravado no storage
        const reqAtualizarTaxaAdm: ReqAtualizarTaxaAdm = {
            embarcacaoId: this.data.embarcacao.embarcacaoId,
            valor: this.taxaAdministracao,
            tipo: Number(localStorage.getItem('profileType')) == 1 ? PerfilUsuario.Administrador : PerfilUsuario.Franqueado,
        };

        this._financeiroService.atualizarTaxaAdministracao(reqAtualizarTaxaAdm).subscribe(resultado => {

            Swal.close();
            Swal.fire('Sucesso!', 'Taxa de administração atualizada com sucesso!', 'success');
        }, (err) => {

            this.taxaAdministracao = this.taxaAdministracaoInicial;
            Swal.close();
            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível concluir a atualização da taxa de administração. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.enviarAtualizarTaxaAdministracao();
                }
            })
        });
    }

    private obterTaxaAdministracao(): void {
        this._financeiroService.obterTaxaAdministracao(this.data.embarcacao.embarcacaoId).subscribe(resultado => {
            this.resObterTaxaAdmModel = resultado;
            this.taxaAdministracao = resultado.taxaAdm;
        }, (err) => {

            this.exibeLoadingCustoFixoCota = false;

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível obter os custos fixos das cotas. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {
                    this.obterTaxaAdministracao();
                }
            })
        });
    }

    maskMoney(valor): string {
        return `R$${parseFloat(valor).toFixed(2).replace(".", ",")}`;
    }

    // -----------------------------------------------------------------------------------------------------
    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit(): void {

    }
}

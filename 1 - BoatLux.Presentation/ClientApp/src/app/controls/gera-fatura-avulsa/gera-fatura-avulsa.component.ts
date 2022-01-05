import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Guid } from 'guid-typescript';
import * as moment from 'moment';
import { MatStepper } from "@angular/material/stepper";
import Swal from "sweetalert2";
import { animate, state, style, transition, trigger } from "@angular/animations";
// Services
import { FinanceiroService } from "../../services/financeiro.service";
import { DialogService } from "../../services/dialog.service";
import { UtilsService } from "../../services/utils.service";
// Components
import { MultiSelectComponent } from "../multi-select/multi-select.component";
import { AdicionaCustoCombustivelComponent } from "../adiciona-custo-combustivel/adiciona-custo-combustivel.component";
// Interfaces
import { CustoCombustivelModel, CustoFaturaAvulsaModel, CustosFaturaAvulsaModel, GridCustosFaturaAvulsaModel, ReqGravarFaturaAvulsaModel, ReqAtualizarTaxaAdm } from "../../interfaces/financeiro.interface";
import { AdicionaCustoAvulsoComponent } from "../adiciona-custo-avulso/adiciona-custo-avulso.component";
// Enums
import { PerfilUsuario } from '../../enums/perfil-usuario';

export interface GeraFaturaAvulsaComponentData {
    embarcacaoId: number;
    embarcacao: string;
}

@Component({
    selector: 'gera-fatura-avulsa',
    templateUrl: './gera-fatura-avulsa.component.html',
    styleUrls: ['./gera-fatura-avulsa.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class GeraFaturaAvulsaComponent implements AfterViewInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------    
    constructor(
        public dialogRef: MatDialogRef<GeraFaturaAvulsaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: GeraFaturaAvulsaComponentData,
        private _formBuilder: FormBuilder,
        private _financeiroService: FinanceiroService,
        private _dialogService: DialogService,
        private _utilsService: UtilsService) {

        this.embarcacao = data.embarcacao;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Properties
    // -----------------------------------------------------------------------------------------------------   
    //Propriedades injetadas
    @ViewChild('multiselect') cotas: MultiSelectComponent;
    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    // DataSources
    custosFaturaDataSource = new MatTableDataSource<GridCustosFaturaAvulsaModel>();
    custosCombustivelDataSource = new MatTableDataSource<CustoCombustivelModel>();

    step1: MatStepper;
    step2: MatStepper;
    step3: MatStepper;

    files: any[] = [];
    fileToUpload: File = null;
    tempIdCustoExpandido = 0;
    embarcacao: string;
    ehFaturaParcelada: boolean = false;
    // Taxa de administração
    taxaAdministracaoInicial: number = 0.00;
    habilitaEdicaoTaxaAdministracao: boolean = false;

    // Flag Loadings
    exibeLoading: boolean = false;
    temCustos = false;
    temCustosCombustivel = false;

    step1FormGroup = this._formBuilder.group(
        {
            tipoFatura: ['1'],
            proRata: [],
            dataInicio: [],
        }
    );

    step2FormGroup = this._formBuilder.group(
        {

        }
    );

    step3FormGroup = this._formBuilder.group(
        {
            quantidadeParcelas: ['1'],
            dataVencimento: [],
            taxaAdministracao: [0.00],
        }
    );

    //Colunas do grid
    gridColumns = ['id', 'receptorFatura', 'totalCusto'];

    colunasCustos = [
        { nome: 'ID', coluna: 'custoId', visivel: true, editavel: false },
        { nome: 'Descrição', coluna: 'descricaoCusto', visivel: true, editavel: false },
        { nome: 'R$ Custo', coluna: 'valorCusto', visivel: true, editavel: false },
    ];

    gridColumnsCombustivel = ['combustivel', 'prestador', 'dataUso', 'dataAbastecimento', 'taxaAbastecimento', 'litros', 'valor'];

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------        

    // Eventos do upload file
    uploadFileToActivity() {

        this._financeiroService.postFile(this.fileToUpload).subscribe(data => {
            // do something, if upload success
        }, error => {
            console.log(error);
        });
    }

    /**
  * on file drop handler
  */
    onFileDropped($event) {
        this.prepareFilesList($event);
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(files) {
        this.prepareFilesList(files);
    }

    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFile(index: number) {
        if (this.files[index].progress < 100) {
            console.log("Upload in progress.");
            return;
        }
        this.files.splice(index, 1);
    }

    /**
  * Simulate the upload process
  */
    uploadFilesSimulator(index: number) {
        setTimeout(() => {
            if (index === this.files.length) {
                return;
            } else {
                const progressInterval = setInterval(() => {
                    if (this.files[index].progress === 100) {
                        clearInterval(progressInterval);
                        this.uploadFilesSimulator(index + 1);
                    } else {
                        this.files[index].progress += 5;
                    }
                }, 200);
            }
        }, 1000);
    }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>) {
        for (const item of files) {
            item.progress = 0;
            this.files.push(item);
        }
        this.fileDropEl.nativeElement.value = "";
        this.uploadFilesSimulator(0);
    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return "0 Bytes";
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    gerarFaturaAvulsa(): void {

        Swal.fire({
            title: 'Aguarde...',
            html: 'Estamos gerando fatura avulsa',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });

        this._financeiroService.gravarFaturaAvulsa(this.montarRequisicao()).subscribe(response => {

            Swal.close();
            Swal.fire('Sucesso!', 'Fatura inserida.', 'success');
        }, (err) => {

            Swal.close();
            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível gerar fatura avulsa. Deseja tentar novamente?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não!'
            }).then((result) => {
                if (result.value) {

                    this.gerarFaturaAvulsa();
                }
            })
        });
    }

    carregarStep2(stepper: MatStepper): void {

        this.validarStep1(stepper);

        // Limpa array
        this.custosFaturaDataSource.data = [];
        this.custosCombustivelDataSource.data = [];
        // Loading e mensagem de tela
        this.temCustos = false
        this.temCustosCombustivel = false;

        switch (Number(this.step1FormGroup.value.tipoFatura)) {
            case TipoFatura.Mensal:
                this.carregarCustosFixosEmbarcacao();
                break;
            case TipoFatura.Parcelada:
                this.ehFaturaParcelada = true;
                break;
            case TipoFatura.Combustivel:
                break;
            case TipoFatura.Diversas:
                break;
        }
    }

    private carregarCustosFixosEmbarcacao(): void {

        this.exibeLoading = true;

        this._financeiroService.buscarCustosFixos(this.data.embarcacaoId).subscribe(response => {

            this.exibeLoading = false;
            this.temCustos = true;

            if (this.step1FormGroup.value.proRata) {

                let quantidadeDiasFimMes = this._utilsService.getQuantidadeDiasFimMes(this.step1FormGroup.value.dataInicio);

                response.listaItens.forEach(item => {
                    item.valorCusto = (item.valorCusto * quantidadeDiasFimMes) / moment().daysInMonth();
                })
            }

            // Cotas
            this.cotas.obterItensSelecionados().forEach(cota => {

                let item: GridCustosFaturaAvulsaModel = {
                    id: cota,
                    receptorFatura: 'Cota ' + cota,
                    totalCusto: response.listaItens.reduce(function (total, item) {
                        return total + item.valorCusto;
                    }, 0),
                    custosFatura: response.listaItens
                }
                this.custosFaturaDataSource.data.push(item);
            });

            this.custosFaturaDataSource._updateChangeSubscription();


        }, (err) => {

            Swal.fire({
                title: 'Desculpe!',
                text: "Não foi possível buscar custos fixos. Deseja tentar novamente?",
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

    private montarRequisicao(): ReqGravarFaturaAvulsaModel {

        let custosFatura: CustoFaturaAvulsaModel[] = [];

        if (Number(this.step1FormGroup.value.tipoFatura) == TipoFatura.Combustivel) {

            this.custosCombustivelDataSource.data.forEach(custo => {

                custosFatura.push({
                    cotaId: this.cotas.obterItemSelecionado(),
                    combustivelId: custo.combustivelId,
                    valor: custo.valor,
                    litros: custo.litros,
                    taxaAbastecimento: custo.taxaAbastecimento,
                    dataUso: custo.dataUso,
                    dataAbastecimento: custo.dataAbastecimento,
                    prestadorId: custo.prestadorId,
                    guid: Guid.create().toString(),
                });
            });
        }
        else {

            this.custosFaturaDataSource.data.forEach(cota => {

                cota.custosFatura.map(custo => {

                    let item: CustoFaturaAvulsaModel = {
                        cotaId: cota.id,
                        custoId: custo.custoId,
                        valor: custo.valorCusto,
                        mesReferencia: custo.mesCobranca,
                        observacao: custo.observacao,
                        guid: Guid.create().toString(),
                    }

                    custosFatura.push(item);
                });
            });
        }

        return {
            embarcacaoId: this.data.embarcacaoId,
            dataVencimento: this._utilsService.formatarData(this.step3FormGroup.value.dataVencimento),
            quantidadeParcelas: this.ehFaturaParcelada ? Number(this.step3FormGroup.value.quantidadeParcelas) : 1,
            tipoFaturaAvulsa: Number(this.step1FormGroup.value.tipoFatura), //Combustivel, Mensal...
            custosFatura: custosFatura
        }
    }

    // Step 2

    removerCusto(item: any): void {


    }

    adicionarCusto(): void {

        if (Number(this.step1FormGroup.value.tipoFatura) === TipoFatura.Combustivel) {

            this._dialogService.abrirDialogMedia(AdicionaCustoCombustivelComponent, {
                proRata: this.step1FormGroup.value.proRata,
                dataInicio: this.step1FormGroup.value.dataInicio,

            }).subscribe((resultado: CustoCombustivelModel) => {

                if (resultado != null) {

                    this.temCustosCombustivel = true;

                    this.custosCombustivelDataSource.data.push(resultado);
                    this.custosCombustivelDataSource._updateChangeSubscription();
                }
            });
        }
        else {

            this._dialogService.abrirDialogMedia(AdicionaCustoAvulsoComponent, {
                proRata: this.step1FormGroup.value.proRata,
                dataInicio: this.step1FormGroup.value.dataInicio,
            }).subscribe(resultado => {

                if (resultado != null) {

                    this.temCustos = true;

                    if (this.custosFaturaDataSource.data.length == 0) {

                        this.cotas.obterItensSelecionados().forEach(cotaId => {

                            let item: GridCustosFaturaAvulsaModel = {
                                id: cotaId,
                                receptorFatura: 'Cota ' + cotaId,
                                totalCusto: resultado.valorCusto,
                                custosFatura: [resultado]
                            }

                            this.custosFaturaDataSource.data.push(item);
                        });
                    }
                    else {

                        if (Number(this.step1FormGroup.value.tipoFatura) === TipoFatura.Mensal) {

                            this.adicionarCustoMensal(resultado);
                        }
                        else {

                            this.custosFaturaDataSource.data.map(item => {
                                item.custosFatura.push(resultado);
                                item.totalCusto = item.custosFatura.reduce(function (total, item) {
                                    return total + item.valorCusto;
                                }, 0);
                            });
                        }
                    }

                    this.custosFaturaDataSource._updateChangeSubscription();
                }
            });
        }
    }

    expandirCusto(item: GridCustosFaturaAvulsaModel) {

        if (this.tempIdCustoExpandido == item.id)
            this.tempIdCustoExpandido = 0;
        else
            this.tempIdCustoExpandido = item.id;
    }

    private validarStep1(stepper: MatStepper) {

        let temErro = false;
        let mensagemErro = "";

        if (this.cotas.obterItensSelecionados().length == 0) {
            temErro = true;
            mensagemErro += 'É obrigatório informar as cotas <br>';
        }

        if (Number(this.step1FormGroup.value.tipoFatura) == TipoFatura.Combustivel && this.cotas.obterItensSelecionados().length > 1) {
            temErro = true;
            mensagemErro += 'Selecione apenas uma cota para gerar fatura de combustível <br>';
        }

        if (this.step1FormGroup.value.proRata && this.step1FormGroup.value.dataInicio == null) {
            temErro = true;
            mensagemErro += 'É obrigatório informar a Data de início quando selecionada opção pró-rata <br>';
        }

        if (temErro) {
            stepper.previous();
            throw Swal.fire('Atenção', mensagemErro, 'warning');
        }
    }

    private adicionarCustoMensal(novoCusto: CustosFaturaAvulsaModel): void {

        let custoAdicionado = false;

        this.custosFaturaDataSource.data.map(item => {

            if (!custoAdicionado) {
                // Adiciona o custo apenas uma vez no array
                item.custosFatura.push(novoCusto);
                custoAdicionado = true;
            }

            item.totalCusto = item.custosFatura.reduce(function (total, item) {

                return total + item.valorCusto;

            }, 0);
        });
    }

    // Step 3
    atualizarTaxaAdministracao(): void {
        /*  this.gerenciarEdicaoTaxaAdministracao(false);
  
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
                  this.step3FormGroup.patchValue({
                      taxaAdministracao: this.taxaAdministracaoInicial
                  });
              }
          });*/
    }

    private enviarAtualizarTaxaAdministracao(): void {
        //TODO: Acertar o tipo depois com o gravado no storage
        const reqAtualizarTaxaAdm: ReqAtualizarTaxaAdm = {
            embarcacaoId: this.data.embarcacaoId,
            valor: 0,//this.taxaAdministracao,
            tipo: Number(localStorage.getItem('perfilUsuario')) == 1 ? PerfilUsuario.Administrador : PerfilUsuario.OperadorFranquia,
        };

        this._financeiroService.atualizarTaxaAdministracao(reqAtualizarTaxaAdm).subscribe(resultado => {

            Swal.close();
            Swal.fire('Sucesso!', 'Taxa de administração atualizada com sucesso!', 'success');
        }, (err) => {

            this.step3FormGroup.patchValue({
                taxaAdministracao: this.taxaAdministracaoInicial
            });

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

    public verificarExibeTaxaAdministracao(): boolean {
        return this.step1FormGroup.value.tipoFatura == TipoFatura.Mensal;
    }

    public gerenciarEdicaoTaxaAdministracao(habilitarEdicao: boolean): void {

        this.habilitaEdicaoTaxaAdministracao = habilitarEdicao;

        if (habilitarEdicao)
            this.step3FormGroup.controls.taxaAdministracao.enable()
        else
            this.step3FormGroup.controls.taxaAdministracao.disable()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ LifeCycle Hooks
    // -----------------------------------------------------------------------------------------------------        
    ngAfterViewInit(): void {
        this.gerenciarEdicaoTaxaAdministracao(false);
    }
}

// -----------------------------------------------------------------------------------------------------
// @ Enums
// -----------------------------------------------------------------------------------------------------        
enum TipoFatura {
    Mensal = 1,
    Parcelada = 2,
    Combustivel = 3,
    Diversas = 4
}
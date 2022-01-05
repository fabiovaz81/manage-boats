import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import Swal from "sweetalert2";
// Services
import { FinanceiroService } from '../../services/financeiro.service';
import { DATE_PICKER_MONTH_YEAR } from "../../services/constants.service";
// Components
import { ControlesBuscaRapidaComponent } from "../busca-rapida/busca-rapida.component";
import { MultiSelectComponent } from "../multi-select/multi-select.component";
import { CadastroCustos_DialogComponent } from "../../modules/financeiro/cadastros/custos/cadastro-custos-dialog/cadastro-custos-dialog.component";
import { CadastroPrestador_DialogComponent } from "../../modules/financeiro/cadastros/prestadores/cadastro-prestador-dialog/cadastro-prestador-dialog.component";
// Interfaces
import { ResPadrao } from "../../interfaces/uteis.interface";
import { ReqInserirCustoEmbarcacaoModel } from "../../interfaces/financeiro.interface";

export interface ControlesAdicionarCustoComponentData {
    embarcacaoId: number;
}

@Component({
    selector: 'adiciona-custo',
    templateUrl: './adiciona-custo.component.html',
    styleUrls: ['./adiciona-custo.component.scss'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_MONTH_YEAR },
    ],
})

export class AdicionaCustoComponent implements AfterViewInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------    
    constructor(
        public dialogRef: MatDialogRef<AdicionaCustoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ControlesAdicionarCustoComponentData,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _financeiroService: FinanceiroService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Properties
    // -----------------------------------------------------------------------------------------------------   
    //Propriedades injetadas
    @ViewChild('multiselect') cotas: MultiSelectComponent;
    @ViewChild('custos') custos: ControlesBuscaRapidaComponent;
    @ViewChild('prestadores') prestadores: ControlesBuscaRapidaComponent;
    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;

    date = new FormControl(moment());
    files: any[] = [];
    fileToUpload: File = null;
    ehCustoVariavel = true;
    ehLancamentoParaCota = false;

    // Search Form definition
    custoFormGroup = this._formBuilder.group(
        {
            tipoCusto: [],
            tipoOperacao: [],
            descricao: [],
            valor: [],
            tipoValorParcela: [],
            quantidadeParcelas: [],
            tipoLancamento: [],
            observacao: [],
        }
    );

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------        

    // Eventos de data
    chosenYearHandler(normalizedYear) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
    }

    chosenMonthHandler(normalizedMonth, datepicker) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        datepicker.close();
    }

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

    tipoCustoChanged(): void {
        this.ehCustoVariavel = this.custoFormGroup.value.tipoCusto == 1
    }

    tipoLancamentoChanged(): void {
        this.ehLancamentoParaCota = this.custoFormGroup.value.tipoLancamento == 2
    }

    reset(): void {

        this.custoFormGroup.patchValue({
            tipoCusto: '1',
            tipoOperacao: '1',
            tipoValorParcela: '1',
            quantidadeParcelas: 1,
            tipoLancamento: '1',
        })

    }

    lancarCusto(): void {

        Swal.fire({
            title: 'Aguarde...',
            html: 'Estamos criando o novo custo',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });


        let erro = this.validarDados();

        if (erro.length == 0) {

            let requisicao: ReqInserirCustoEmbarcacaoModel = {
                embarcacaoId: this.data.embarcacaoId,
                custoId: this.custos.obterCodigoSelecionado(),
                descricao: this.custoFormGroup.value.descricao,
                mesInicialFaturamento: this.date.value,
                quantidadeParcelas: this.custoFormGroup.value.quantidadeParcelas,
                tipoCusto: Number(this.custoFormGroup.value.tipoCusto),
                tipoLancamento: this.custoFormGroup.value.tipoLancamento,
                tipoValorparcela: this.custoFormGroup.value.tipoValorParcela,
                valor: this.custoFormGroup.value.valor,
                cotaIds: this.ehLancamentoParaCota ? this.cotas.obterItensSelecionados() : [],
                prestadorId: this.prestadores.obterCodigoSelecionado(),
                observacao: this.custoFormGroup.value.observacao,
            }

            this._financeiroService.inserirCusto(requisicao).subscribe(custoEmbarcacaoId => {
                
                if (custoEmbarcacaoId > 0) {

                    const formData = new FormData();

                    if (this.files.length > 0) {
                        this.files.forEach(i => {

                            let fileToUpload = <File>i;
                            console.log(fileToUpload)
                            formData.append('file', fileToUpload, fileToUpload.name);
                        });

                        this._financeiroService.inserirCustoComprovante(formData, custoEmbarcacaoId).subscribe((resultado: ResPadrao) => {
                            if (resultado.status)
                                Swal.close();
                                Swal.fire('Sucesso!', resultado.message, 'success');
                                this.fecharJanela(true);
                        })
                    }
                }

            });
        }
        else {

            Swal.close();
            Swal.fire('Atenção', erro, 'warning')
        }
    }

    validarDados(): string {

        let mensagemErro: string = '';

        if (this.files.length === 0)
            mensagemErro += '- É obrigatório inserir comprovante(s). <br>';

        if (Number(this.custos.obterCodigoStringSelecionado()) === 0)
            mensagemErro += '- É obrigatório informar o custo. <br>';

        if (Number(this.custoFormGroup.value.valor) === 0)
            mensagemErro += '- Valor deve ser maior que R$0,00. <br>';

        if (Number(this.custoFormGroup.value.tipoCusto) === 1) {

            if (Number(this.custoFormGroup.value.quantidadeParcelas) === 0)
                mensagemErro += '- Quantidade de parcelas deve ser maior que 0. <br>';

            if (this.date.value === null)
                mensagemErro += '- É obrigatório informar Mês inicial de faturamento. <br>';
        }

        if (this.ehLancamentoParaCota && this.cotas.obterItensSelecionados().length == 0)
            mensagemErro += '- É obrigatório informar uma cota para gerar a fatura. <br>';

        return mensagemErro;
    }

    fecharJanela(reload: boolean):void{
        this.dialogRef.close(reload);
    }

    novoCusto(): void {
        this._matDialog.open(CadastroCustos_DialogComponent, {
            width: '60%'
        });
    }

    novoPrestador(): void {

        this._matDialog.open(CadastroPrestador_DialogComponent, {
            width: '60%'
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------    

    ngAfterViewInit(): void {

        this.reset();
    }
}
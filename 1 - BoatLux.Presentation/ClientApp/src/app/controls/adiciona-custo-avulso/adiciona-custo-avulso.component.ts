import { AfterViewInit, Component, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from 'moment';
import Swal from "sweetalert2";
// Services
import { UtilsService } from "../../services/utils.service";
import { DATE_PICKER_MONTH_YEAR } from "../../services/constants.service";
// Components
import { ControlesBuscaRapidaComponent } from "../busca-rapida/busca-rapida.component";
import { CadastroCustos_DialogComponent } from "../../modules/financeiro/cadastros/custos/cadastro-custos-dialog/cadastro-custos-dialog.component";
// Interfaces
import { CustosFaturaAvulsaModel } from "../../interfaces/financeiro.interface";

export interface DialogData {
    proRata: boolean;
    dataInicio: Date,
}

@Component({
    selector: 'adiciona-custo-avulso',
    templateUrl: './adiciona-custo-avulso.component.html',
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_MONTH_YEAR },
    ],
})

export class AdicionaCustoAvulsoComponent implements AfterViewInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------    
    constructor(
        public dialogRef: MatDialogRef<AdicionaCustoAvulsoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _utilsService: UtilsService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Properties
    // -----------------------------------------------------------------------------------------------------   
    //Propriedades injetadas
    @ViewChild('custos') custos: ControlesBuscaRapidaComponent;

    date = new FormControl(moment());

    // Search Form definition
    custoFormGroup = this._formBuilder.group(
        {
            tipoCusto: [],
            valorCusto: [],
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

    adicionarCustoFixo(): void {

        if (this.custos.obterCodigoSelecionado() == null)
            throw Swal.fire('Atenção!', 'É obrigatório informar um custo.', 'warning');

        let custoCombustivel = this.custoFormGroup.value.valorCusto;

        if (this.data.proRata) {

            let quantidadeDiasFimMes = this._utilsService.getQuantidadeDiasFimMes(this.data.dataInicio);
            custoCombustivel = (custoCombustivel * quantidadeDiasFimMes) / moment().daysInMonth();
        }

        let custo: CustosFaturaAvulsaModel = {
            custoId: this.custos.obterCodigoSelecionado(),
            descricaoCusto: this.custos.obterItemSelecionado().titulo,
            valorCusto: custoCombustivel,
            mesCobranca: this.date.value,
            observacao: this.custoFormGroup.value.observacao,
        }

        this.dialogRef.close(custo);
    }

    novoCusto(): void {
        this._matDialog.open(CadastroCustos_DialogComponent, {
            width: '60%'
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------    

    ngAfterViewInit(): void {

    }
}
import { Component, Inject, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from 'moment';
// Components
import { ControlesBuscaRapidaComponent } from "../busca-rapida/busca-rapida.component";
import { CadastroPrestador_DialogComponent } from "../../modules/financeiro/cadastros/prestadores/cadastro-prestador-dialog/cadastro-prestador-dialog.component";
// Services
import { UtilsService } from "../../services/utils.service";
// Interfaces
import { CustoCombustivelModel } from "../../interfaces/financeiro.interface";

export interface DialogData {
    proRata: boolean;
    dataInicio: Date,
}

@Component({
    selector: 'adiciona-custo-combustivel',
    templateUrl: './adiciona-custo-combustivel.component.html',
})

export class AdicionaCustoCombustivelComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------    
    constructor(
        public dialogRef: MatDialogRef<AdicionaCustoCombustivelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _utilsService: UtilsService) {

    }

    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------  
    @ViewChild('combustiveis') combustiveis: ControlesBuscaRapidaComponent;
    @ViewChild('prestadores') prestadores: ControlesBuscaRapidaComponent;

    //Definição do formulário de cadastro
    cadastroFormGroup = this._formBuilder.group(
        {
            valor: [],
            litros: [],
            combustivel: [],
            taxaAbastecimento: [],
            dataUso: [],
            dataAbastecimento: [],
        }
    );

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------        

    adicionarCustoCombustivel(): void {

        let custoCombustivel = this.cadastroFormGroup.value.valor;

        if (this.data.proRata) {

            let quantidadeDiasFimMes = this._utilsService.getQuantidadeDiasFimMes(this.data.dataInicio);
            custoCombustivel = (custoCombustivel * quantidadeDiasFimMes) / moment().daysInMonth();
        }

        let custo: CustoCombustivelModel = {
            prestadorId: this.prestadores.obterCodigoSelecionado(),
            prestador: this.prestadores.obterItemSelecionado().titulo,
            dataUso: this.cadastroFormGroup.value.dataUso,
            dataAbastecimento: this.cadastroFormGroup.value.dataAbastecimento,
            taxaAbastecimento: Number(this.cadastroFormGroup.value.taxaAbastecimento),
            combustivelId: this.combustiveis.obterCodigoSelecionado(),
            combustivel: this.combustiveis.obterItemSelecionado().titulo,
            litros: this.cadastroFormGroup.value.litros,
            valor: custoCombustivel,
        }

        this.dialogRef.close(custo);
    }

    novoPrestador(): void {

        this._matDialog.open(CadastroPrestador_DialogComponent, {
            width: '60%'
        });
    }
}

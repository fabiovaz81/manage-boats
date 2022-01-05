import { Component, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
// Services
import { BuscaRapidaService } from '../../services/busca-rapida.service';
// Interfaces
import { RequisicaoBuscaRapida } from '../../interfaces/busca-rapida.interface';

@Component({
    selector: 'multi-select',
    templateUrl: './multi-select.component.html'
})

export class MultiSelectComponent implements AfterViewInit {

    constructor(
        private _buscaRapidaService: BuscaRapidaService,
    ) { }

    selectFormControl = new FormControl();
    @Input() formControlName: string;
    @Input() multiSelect: boolean;
    @Input() formGroup: FormGroup;
    @Input() titulo: string;
    @Output() alterado = new EventEmitter();
    @Output() aoSelecionarItem = new EventEmitter();
    @Input() tipo: string;

    label: string;
    placeholder: string;
    marcarTodas: boolean = true;

    public itensDataSource = [];

    dispararEventoAlteracao() {
        this.alterado.emit();
        this.aoSelecionarItem.emit();
    }

    public definirItemSelecionado(codigo?: number) {
        if (codigo != null) {
            this.selectFormControl.setValue(codigo.toString());
        }
    }

    public definirItensSelecionados(codigos?: number[]) {
        if (codigos != null) {
            this.selectFormControl.setValue(codigos.map(i => i.toString()));
        }
    }

    public obterItemSelecionado(): number {
        if (this.selectFormControl.value)
            return Number(this.selectFormControl.value);
        else
            return 0;
    }

    public obterItensSelecionados(): number[] {
        if (this.selectFormControl.value)
            return this.selectFormControl.value.map(Number);
        else
            return [];
    }

    marcarDesmarcarTodas(matSelect: MatSelect) {
        if (this.marcarTodas) {
            this.selectFormControl.setValue(this.itensDataSource.map(i => i.id.toString()));
            matSelect.close();
        }
        else {
            this.selectFormControl.setValue(null);
        }

        this.marcarTodas = !this.marcarTodas;
        this.dispararEventoAlteracao();
    }

    public pesquisar(valor: string, buscaExata: boolean): void {

        let requisicao: RequisicaoBuscaRapida =
        {
            tipo: this.tipo.toUpperCase(),
            valor: valor,
            buscaExata: buscaExata,
            param1: null,
            param2: null,
            param3: null,
        };

        this._buscaRapidaService.buscar(requisicao).subscribe(result => {

            //Carrega os itens
            if (result && result.itens.length > 0) {

                this.itensDataSource = result.itens.map(i => ({ id: i.id, name: i.titulo }));
                this.aoSelecionarItem.emit();
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
        * AfterViewInit
        */
    ngAfterViewInit(): void {

        //Informações de tela padrão
        this.label = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);

        // Aqui preciso remover esse 1 e passar vazio
        // Aguardando ajuste na API
        this.pesquisar('1', true);   
    }
}
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { BuscaRapidaService } from '../../services/busca-rapida.service';
import { ResultadoBuscaRapida, RequisicaoBuscaRapida, ItemBuscaRapida } from '../../interfaces/busca-rapida.interface';
import { TipoBuscaRapida } from '../../enums/tipo-busca-rapida';
import { cwd } from 'process';

@Component({
    selector: 'controles-busca-rapida',
    templateUrl: './busca-rapida.component.html'
})

export class ControlesBuscaRapidaComponent implements OnInit {

    public resultadosEncontrados$: Observable<ResultadoBuscaRapida[]> = null;
    public buscaRapidaFormControl = new FormControl();
    public estaCarregando = false;
    public nenhumItemEncontrado = false;

    @Input() formControlName: string;
    @Input() tipo: string;
    @Input() param1: string;
    @Input() param2: string;
    @Input() param3: string;
    label: string;
    placeholder: string;
    private ultimaBuscaExata: string = '';

    @Output() aoSelecionarItem: EventEmitter<any> = new EventEmitter();

    definirParametros(param1: any, param2: any = null, param3: any = null) {
        if (param1)
            this.param1 = param1.toString();
        if (param2)
            this.param2 = param2.toString();
        if (param3)
            this.param3 = param3.toString();

        //Limpa item selecionado
        this.limpar();
    }

    public obterCodigoStringSelecionado(): any {

        if (this.buscaRapidaFormControl.value && this.buscaRapidaFormControl.value.id)
            return this.buscaRapidaFormControl.value.id;
        else
            return null;
    }

    public obterCodigoSelecionado(): number {

        if (this.buscaRapidaFormControl.value && this.buscaRapidaFormControl.value.id)
            return Number(this.buscaRapidaFormControl.value.id);
        else
            return null;
    }

    public obterItemSelecionado(): ItemBuscaRapida {

        if (this.buscaRapidaFormControl.value)
            return this.buscaRapidaFormControl.value;
        else
            return null;
    }

    constructor(
        private _buscaRapidaService: BuscaRapidaService
    ) { }

    public exibirTitulo(item: ItemBuscaRapida) {
        return item ? item.titulo : '';
    }

    public definirCodigoSelecionado(codigo?: any) {
        if (codigo != null) {
            this.pesquisar(codigo.toString(), true).subscribe(result => {
                let resultado = result[0];
                if (resultado != undefined) {
                    this.buscaRapidaFormControl.setValue(resultado);
                    this.aoSelecionarItem.emit();
                }
            });
        }
    }

    public selecionarItemLista() {
        this.definirCodigoSelecionado(this.obterCodigoSelecionado());
    }

    public limpar() {
        this.buscaRapidaFormControl.setValue(null);
        this.ultimaBuscaExata = '';
    }

    public tentarBuscarCodigo() {

        if (this.buscaRapidaFormControl.value && !this.buscaRapidaFormControl.value.id && this.ultimaBuscaExata != this.buscaRapidaFormControl.value) {
            this.definirCodigoSelecionado(this.buscaRapidaFormControl.value);
        }
    }

    public pesquisar(valor: string, buscaExata: boolean): Observable<ItemBuscaRapida[]> {

        if (buscaExata)
            this.ultimaBuscaExata = valor;

        let requisicao: RequisicaoBuscaRapida =
        {
            tipo: this.tipo,
            valor: valor,
            buscaExata: buscaExata,
            param1: this.param1,
            param2: this.param2,
            param3: this.param3,
        };

        return this._buscaRapidaService.buscar(requisicao).pipe(
            // map the item property of the github results as our return object
            map(result => { this.estaCarregando = false; this.nenhumItemEncontrado = (valor != '' && (result == null || result.itens.length == 0)); return result.itens; }),
            // catch errors
            catchError(_ => {
                return of(null);
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
        * On init
        */
    ngOnInit(): void {

        //Informações de tela padrão
        this.label = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
        this.placeholder = 'Digite o nome ou código.';

        //Informações de tela customizadas
        switch (this.tipo.toUpperCase()) {

            case 'CUSTOS':
                this.placeholder = 'Digite o custo';
                break;
            case 'COTAS':
                this.placeholder = 'Digite a cota';
                break;
            case 'PRESTADORES':
                this.placeholder = 'Digite o prestador';
                break;
            case 'COMBUSTIVEIS':
                this.placeholder = 'Digite o combustível';
                break;
        }

        this.resultadosEncontrados$ = this.buscaRapidaFormControl.valueChanges.pipe(
            startWith(''),
            // delay na busca
            debounceTime(250),
            switchMap(value => {
                if (value !== '' && value !== null && !(value instanceof Object)) {
                    this.estaCarregando = true;
                    this.nenhumItemEncontrado = false;
                    return this.pesquisar(value, false);
                } else {
                    return of(null);
                }
            })
        );
    }
}
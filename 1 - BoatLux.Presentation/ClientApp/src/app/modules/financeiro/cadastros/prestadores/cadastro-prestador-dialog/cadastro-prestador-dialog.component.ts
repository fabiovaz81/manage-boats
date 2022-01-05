import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
// Services
import { FinanceiroService } from "../../../../../services/financeiro.service";
import { ViaCepService } from "../../../../../services/viacep.service";
// Interfaces
import { LocalidadeModel } from "../../../../../interfaces/uteis.interface";
import { PrestadorModel } from "../../../../../interfaces/financeiro.interface";

export interface CadastroPrestadorComponentData {
    prestador?: PrestadorModel;
}

@Component({
    selector: 'cadastro-prestador-dialog',
    templateUrl: './cadastro-prestador-dialog.component.html',
})

export class CadastroPrestador_DialogComponent {

    // -----------------------------------------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------------------------------------
    constructor(
        public dialogRef: MatDialogRef<CadastroPrestador_DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CadastroPrestadorComponentData,
        private _financeiroService: FinanceiroService,
        private _viaCepService: ViaCepService,
        private _formBuilder: FormBuilder,
    ) {
        if (data != null) {
            this.tituloModal = "Edição de prestador";
            this.prestadorId = data.prestador.prestadorId;

            this.carregarDados(data.prestador);

        }

    }

    // -----------------------------------------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------------------------------------  

    //Definição do formulário de cadastro
    cadastroFormGroup = this._formBuilder.group(
        {
            razao: [],
            fantasia: [],
            cpfCnpj: [],
            ie: [],
            cep: [],
            logradouro: [],
            numero: [],
            bairro: [],
            cidade: [],
            uf: [],
            complemento: [],
            contato: [],
            telefone: [],
            celular: [],
            email: [, {
                validators: [Validators.email],
                updateOn: "change",
            }],
            banco: [],
            agencia: [],
            conta: [],
            pix: [],
            tipoPix: [],
            status: ['1'],
        }
    );

    tituloModal: string = "Cadastro de prestador";
    prestadorId: number = 0;

    // -----------------------------------------------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------------------------------------------
    fecharModal(reload: boolean): void {
        this.dialogRef.close(reload);
    }

    carregarDados(prestador: PrestadorModel): void {

        this.cadastroFormGroup.patchValue({
            razao: prestador.razao,
            fantasia: prestador.fantasia,
            cpfCnpj: prestador.cpfCnpj,
            ie: prestador.ie,
            cep: prestador.cep,
            logradouro: prestador.logradouro,
            numero: prestador.numero,
            bairro: prestador.bairro,
            cidade: prestador.cidade,
            uf: prestador.uf,
            complemento: prestador.complemento,
            contato: prestador.contato,
            telefone: prestador.telefone,
            celular: prestador.celular,
            email: prestador.email,
            banco: prestador.banco,
            agencia: prestador.agencia,
            conta: prestador.conta,
            pix: prestador.pix,
            tipoPix: prestador.tipoPix,
            status: prestador.status
        });
    }

    buscarDadosCep(): void {
        let cep = Number(this.cadastroFormGroup.value.cep);

        if (cep != null) {
            this._viaCepService.getLocalidadeByCep(cep).subscribe((res: LocalidadeModel) => {

                if (res.erro) {
                    Swal.fire('Atenção!', 'Não encontramos o CEP. Verifique a informação.', 'warning');
                    return;
                }

                this.cadastroFormGroup.patchValue({
                    logradouro: res.logradouro,
                    bairro: res.bairro,
                    cidade: res.localidade,
                    uf: res.uf,
                });
            }, (err) => {
                Swal.fire('Atenção!', 'CEP inválido. Verifique a informação.', 'warning');
            })
        }
    }

    salvarDados(): void {

        Swal.fire({
            title: 'Salvando',
            html: 'Estamos ' + (this.prestadorId > 0 ? 'alterando' : 'inserindo') + ' dados do prestador, aguarde...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });

        let tipoDocumento = this.cadastroFormGroup.value.cpfCnpj == 11 ? 0 : 1;

        let requisicao: PrestadorModel = {
            prestadorId: this.prestadorId,
            razao: this.cadastroFormGroup.value.razao,
            fantasia: this.cadastroFormGroup.value.fantasia,
            tipoDocumento: tipoDocumento,
            cpfCnpj: this.cadastroFormGroup.value.cpfCnpj,
            ie: this.cadastroFormGroup.value.ie,
            cep: this.cadastroFormGroup.value.cep,
            logradouro: this.cadastroFormGroup.value.logradouro,
            numero: this.cadastroFormGroup.value.numero,
            bairro: this.cadastroFormGroup.value.bairro,
            cidade: this.cadastroFormGroup.value.cidade,
            uf: this.cadastroFormGroup.value.uf,
            complemento: this.cadastroFormGroup.value.complemento,
            contato: this.cadastroFormGroup.value.contato,
            telefone: this.cadastroFormGroup.value.telefone,
            celular: this.cadastroFormGroup.value.celular,
            email: this.cadastroFormGroup.value.email,
            banco: this.cadastroFormGroup.value.banco,
            agencia: this.cadastroFormGroup.value.agencia,
            conta: this.cadastroFormGroup.value.conta,
            pix: this.cadastroFormGroup.value.pix,
            tipoPix: this.cadastroFormGroup.value.tipoPix,
            status: Number(this.cadastroFormGroup.value.status),
        }

        if (this.prestadorId > 0)
            this.alterarPrestador(requisicao);
        else
            this.adicionarPrestador(requisicao);
    }

    // -----------------------------------------------------------------------------------------------------
    // Private Methods
    // -----------------------------------------------------------------------------------------------------

    private adicionarPrestador(requisicao: PrestadorModel): void {

        console.log(requisicao)
        this._financeiroService.salvarPrestador(requisicao).subscribe(prestadorId => {

            Swal.fire(
                'Sucesso!',
                'Prestador ' + prestadorId + ' adicionado com sucesso!',
                'success').then(prestadorId => {

                    this.fecharModal(true);
                });

        }, (err) => {
            Swal.fire('Desculpe!', 'Não foi possível salvar os dados do prestador.' + err, 'error');
        });
    }

    private alterarPrestador(requisicao: PrestadorModel): void {

        this._financeiroService.alterarPrestador(requisicao).subscribe(resultado => {

            Swal.fire(
                'Sucesso!',
                'Prestador ' + this.prestadorId + ' alterado com sucesso!',
                'success').then(resultado => {

                    this.fecharModal(true);
                });

        }, (err) => {
            Swal.fire('Desculpe!', 'Não foi possível alterar os dados do prestador.' + err, 'error');
        });
    }
}

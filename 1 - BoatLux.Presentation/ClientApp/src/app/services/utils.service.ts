import { Injectable } from "@angular/core";
import * as moment from 'moment';
// Services
import { LocalStorageService } from "./local-storage.service";
// Enums
import { PerfilUsuario } from "../enums/perfil-usuario";

@Injectable({
    providedIn: 'root'
})

export class UtilsService {

    constructor(
        private _localStorageService: LocalStorageService
    ) { }

    // Commom
    filterUnique() {
        return (value, index, self) => {
            return self.indexOf(value) === index
        }
    }

    strToNumber(value: string) {
        return Number(value.toString().replace(/[^-0-9,]*/g, '').replace(',', '.'))
    }

    /** Formata qualquer data, retornando o tipo Date
        * @param {any} data
        * @returns {Date}
    */
    formatarData(data: any): Date {
        return new Date(data);
    }

    /** Formata qualquer data, recebendo o formato desejado, retornando o tipo String
        Exemplo de Formato: DD/MM/YYYY
        * @param {any} data
        * @param {string} formato
        * @returns {string}
    */
    formatarDataString(data: any, formato: string): string {
        return moment(data).format(formato)
    }

    /** Calcula e retorna quantidade de dias para o fim do mês
        Caso não informado o parâmetro dataAtual, retorna quantidade de dias baseado na data atual
        * @param {date} dataAtual
        * @returns {number}
    */
    getQuantidadeDiasFimMes(dataAtual?: Date): number {

        var ultimoDiaMes = moment(moment().clone().endOf('month'), "YYYY-MM-DD");
        var diaAtual = dataAtual != null ? moment(dataAtual).startOf('day') : moment().startOf('day');

        return Math.round(moment.duration(ultimoDiaMes.diff(diaAtual)).asDays());
    }

    isAdministrador(): boolean {
        return this._localStorageService.get('perfilUsuario') == PerfilUsuario.Administrador;
    }

    isOperadorFranqueadora(): boolean {
        return this._localStorageService.get('perfilUsuario') == PerfilUsuario.OperadorFranqueadora;
    }

    isOperadorFranquia(): boolean {
        return this._localStorageService.get('perfilUsuario') == PerfilUsuario.OperadorFranquia;
    }
}
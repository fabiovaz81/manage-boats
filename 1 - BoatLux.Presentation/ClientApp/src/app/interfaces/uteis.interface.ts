import { SortDirection } from '@angular/material/sort';

export interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

export interface ReqBuscaPaginadaModel {
    paginaAtual: number;
    itensPorPagina: number;
    colunaOrdenacao: string;
    direcaoOrdenacao: SortDirection
}

export interface ResBuscaPaginadaModel {
    paginaAtual: number;
    totalItens: number;
}

export interface ResPadrao {
    status: boolean;
    message: string;
}

export interface LocalidadeModel{
  cep: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: number;
  ddd?: number;
  erro?: boolean;
}

export interface RequisicaoBuscaPaginadaModel {
    paginaAtual: number;
    itensPorPagina: number;
    colunaOrdenacao: string;
    direcaoOrdenacao: SortDirection
}

export interface ResultadoBuscaPaginadaModel {
    paginaAtual: number;
    totalItens: number;
}

export interface RequisicaoBuscaRapida {
    tipo: string,
    valor: string;
    buscaExata: boolean;
    param1: string;
    param2: string;
    param3: string;
}

export interface ResultadoBuscaRapida {
    itens: ItemBuscaRapida[];
}

export interface ItemBuscaRapida {
    id: string;
    titulo: string;
}


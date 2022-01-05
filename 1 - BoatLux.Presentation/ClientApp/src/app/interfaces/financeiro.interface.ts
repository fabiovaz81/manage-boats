import { TipoCusto } from '../enums/tipo-custo';
import { ReqBuscaPaginadaModel, RequisicaoBuscaPaginadaModel, ResBuscaPaginadaModel, ResultadoBuscaPaginadaModel } from './uteis.interface';
import { DateRange } from './uteis.interface';

/*
 Cadastros
 */
export interface CustosModel {
    custoId: number;
    descricao: string;
    tipo: number;
    descricaoTipo: string;
    status: number;
}

export interface ReqBuscarCustosModel {
    paginacao: ReqBuscaPaginadaModel;
    custoId: number;
    descricao: string;
    tipoCusto: number;
    ativos: boolean;
}

export interface ResBuscarCustosModel {
    paginacao: ResBuscaPaginadaModel;
    listaItens: CustosModel[];
}

export interface ReqAdicionarCustoModel {
    nome: string;
    idTipoCusto: number;
    status: number;
}

export interface PrestadorModel {
    prestadorId: number;
    razao: string;
    fantasia: string;
    tipoDocumento?: number;
    cpfCnpj: string;
    ie: string;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    complemento: string;
    contato: string;
    telefone: string;
    celular: string;
    email: string;
    banco: string;
    agencia: string;
    conta: string;
    pix: string;
    tipoPix: string;
    status: number;
}

export interface ReqBuscarPrestadoresModel {
    paginacao: ReqBuscaPaginadaModel;
    prestadorId?: number;
    razaoFantasia?: string;
    cnpjCpf?: string;
    ativos: boolean;
}

export interface ResBuscarPrestadoresModel {
    paginacao: ResBuscaPaginadaModel;
    listaItens: PrestadorModel[];
}

/*
Processos
*/
export interface CentroCustosModel {
    embarcacaoId: number;
    embarcacao: string;
    franquiaId?: number;
    franquia: string;
    cotasUsadas?: number;
    totalCotas?: number;
    custo: number;
}

export interface ReqBuscarCentroCustosModel {
    paginacao: ReqBuscaPaginadaModel;
    embarcacao: string;
    franquia: string;
    cota: string;
    custo: number;
    dataFaturamento: Date;
}

export interface ReqGerarFaturaModel {
    embarcacaoId: number;
    mesFaturamento: Date;
}

export interface ResBuscarCentroCustosModel {
    paginacao: ResBuscaPaginadaModel;
    listaItens: CentroCustosModel[];
}

export interface ResBuscarDemonstrativoCustosModel {
    listaItens: DemonstrativoCustosModel[];
}

export interface DemonstrativoCustosModel {
    cotaId: number;
    nomeCota: string;
    totalCusto: number;
    custos?: [{
        custoId: number;
        descricaoCusto: string;
        custo?: number;
    }];
}

export interface EmbarcacaoCustosModel {
    custoId: number;
    descricaoCusto: string;
    tipoCusto: string;
    valorCusto: number;
}

export interface ReqInserirCustoEmbarcacaoModel {
    embarcacaoId: number;
    tipoCusto: number;
    descricao: string;
    valor: number;
    custoId: number;
    prestadorId?: number;
    tipoValorparcela: number;
    quantidadeParcelas: number;
    mesInicialFaturamento: string;
    tipoLancamento: number;
    cotaIds?: number[];
    observacao?: string;
}

export interface CustosFaturaAvulsaModel {
    custoId: number;
    descricaoCusto: String;
    valorCusto: number;
    mesCobranca?: string;
    observacao?: string;
}

// Grid genérico Cotas
export interface GridCustosFaturaAvulsaModel {

    id?: number; // Cota
    receptorFatura?: string;
    totalCusto?: number;
    custosFatura: CustosFaturaAvulsaModel[];
}

export interface ReqBuscarCustosFixosModel {
    listaItens: CustosFaturaAvulsaModel[];
}

export interface ReqGravarFaturaAvulsaModel {
    embarcacaoId?: number;
    dataVencimento: Date;
    quantidadeParcelas?: number;
    tipoFaturaAvulsa: number; //Combustivel, Mensal...
    custosFatura: CustoFaturaAvulsaModel[];
}

export interface CustoFaturaAvulsaModel {
    id?: number; // ID inserido no banco, não precisa enviar, só receber
    custoId?: number; //Colocar o id custo combustivel
    valor: number;
    litros?: number;
    combustivelId?: number;
    taxaAbastecimento?: number;
    dataUso?: Date;
    dataAbastecimento?: Date;
    prestadorId?: number;
    mesReferencia?: string;
    observacao?: string;
    cotaId: number;
    guid: string; //"XPTO", //Apenas auxiliar         
}

export interface CustoCombustivelModel {
    prestadorId: number;
    prestador: string;
    dataUso: Date;
    dataAbastecimento: Date;
    taxaAbastecimento: number;
    combustivelId: number;
    combustivel: string;
    litros: number;
    valor: number;
}

export interface FaturaAvulsaModel {
    faturaId: number;
    cotaId: number;
    nomeCota: string;
    valorFatura: number;
}

export interface ResBuscarFaturaAvulsaModel {
    listaItens: FaturaAvulsaModel[];
}

export interface CustoFixoEmbarcacaoModel {
    id: number;
    custoId: number;
    descricaoCusto: string;
    valor: number;
    observacao: string;
}

export interface ResBuscarCustosFixosEmbarcacaoModel {
    listaItens: CustoFixoEmbarcacaoModel[];
}

export interface CustoVariavelEmbarcacaoModel {
    id: number;
    custoId: number;
    descricaoCusto: string;
    referenciaFatura: string;
    parcelas: string;
    valor: number;
    observacao: string;
}

export interface ResBuscarCustosVariaveisEmbarcacaoModelModel {
    listaItens: CustoVariavelEmbarcacaoModel[];
}

export interface CustoFixoCotaModel {
    cotaId: number;
    nomeCota: string;
    total: number;
    custos?: [{
        id: number;
        custoId: number;
        descricaoCusto: string;
        valor: number;
    }];
}

export interface ResBuscarCustosFixosCotaModel {
    listaItens: CustoFixoCotaModel[];
}

export interface CustoVariavelCotaModel {
    cotaId: number;
    nomeCota: string;
    total: number;
    custos?: [{
        id: number;
        custoId: number;
        descricaoCusto: string;
        referenciaFatura: string;
        parcelas: string;
        valor: number;
    }];
}

export interface ResBuscarCustosVariaveisCotaModelModel {
    listaItens: CustoVariavelCotaModel[];
}

/*
  ACOMPANHAMENTO DE FATURAS
*/
export interface ReqBuscarFaturasModel {
    paginacao: ReqBuscaPaginadaModel;
}

export interface ResBuscarFaturasModel {
    paginacao: ResultadoBuscaPaginadaModel,
    listaItens: FaturasModel[];
}

export interface FaturasModel {
    faturaId: number;
    franquia: string;
    embarcacaoId: number;
    nomeEmbarcacao: string;
    cotaId?: number;
    nomeCota: string;
    mesReferencia?: string;
    dataVencimento?: Date;
    dataVencimentoFormatada?: string;
    valorFatura: number;
    status: string;
}

export interface ReqGerarSegundaViaFaturaModel {
    faturaIds: number[];
    dataSegundaVia: Date;
    cobrarMulta: number;
    cobrarJuros: number;
}

export interface ReqCancelarFaturaModel {
    faturaIds: number[];
    observacao: string;
}

export interface ResObterFaturaModel {
    cotista: string;
    emailCotista: string;
    cota: string;
    embarcacao: string;
    valor: number;
    referencia: string;
    status: string;
    itens: ItensFaturaModel[];
    historicos: HistoricosFaturaModel[];
}

export interface ItensFaturaModel {
    itemId: number;
    descricao: string;
    valorItem: number;
}

export interface HistoricosFaturaModel {
    historicoId: number;
    ordemPagamento: string;
    linkFatura: string;
    status: string;
    dataVencimento: Date;
    detalhes: [{
        data: Date;
        descricao: string;
        notas: string;
    }];
}

export interface ReqExportarDadosFaturasModel {
    tipoPeriodo?: number;
    periodo?: DateRange;
    mesCompetencia?: string;
    franquiaId?: number;
    embarcacaoId?: number;
    cotaId?: number;
    statusFatura?: number;
}

export interface ReqAtualizarTaxaAdm {
    embarcacaoId: number;
    tipo: number;
    valor: number;
}

export interface ResObterTaxaAdmModel {
    embarcacaoId: number;
    taxaAdm: number;
    taxaAdmMinima: number;
}

export interface ReqParcelasModel{
    idCusto: number;
    idEmbarcacao?: number;
    idCota?: number;
}

export interface ResParcelasModel {
    listaItens: ParcelaModel[];
}

export interface ParcelaModel {
    dataVencimento: Date;
    numeroParcela: number;
    valorParcela: number;
}

export interface ReqInativarCustoModel {
    id: number;
    idCota?: number;
    idEmbarcacao?: number;
    tipoCusto: TipoCusto;
    desativarParcelasFuturas?: boolean;
}

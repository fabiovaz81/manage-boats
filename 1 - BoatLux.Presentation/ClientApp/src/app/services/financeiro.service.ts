import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import {
    ReqBuscarCustosModel, ResBuscarCustosModel, ReqAdicionarCustoModel, ReqBuscarCentroCustosModel, ResBuscarCentroCustosModel,
    ResBuscarDemonstrativoCustosModel, ReqInserirCustoEmbarcacaoModel, ReqBuscarPrestadoresModel, ResBuscarPrestadoresModel,
    PrestadorModel, ReqBuscarCustosFixosModel, ReqGravarFaturaAvulsaModel, ResBuscarFaturaAvulsaModel, ResBuscarCustosFixosEmbarcacaoModel,
    ResBuscarCustosVariaveisEmbarcacaoModelModel, ResBuscarCustosFixosCotaModel, ResBuscarCustosVariaveisCotaModelModel, ResBuscarFaturasModel,
    ReqBuscarFaturasModel, ReqGerarSegundaViaFaturaModel, ReqCancelarFaturaModel, ResObterFaturaModel, ReqExportarDadosFaturasModel,
    FaturasModel, ReqGerarFaturaModel, ReqAtualizarTaxaAdm, ResObterTaxaAdmModel, ResParcelasModel, ReqInativarCustoModel, ReqParcelasModel
} from '../interfaces/financeiro.interface';
import { EndpointService } from './endpoint.service';
import { ResPadrao } from '../interfaces/uteis.interface';

@Injectable({
    providedIn: 'root'
})
export class FinanceiroService {
    constructor(
        private _http: HttpClient,
        private _localStorageService: LocalStorageService,
        private _endpointService: EndpointService) { }


    private _obterHeaders(): any {
        let loginData = this._localStorageService.get("loginData");
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + loginData.token,
        };
    }

    private _obterHeadersFormData(): any {
        let loginData = this._localStorageService.get("loginData");
        return {
            'Authorization': 'Bearer ' + loginData.token
        };
    }

    /*
     * Boatlux
     * /

    /*
     Cadastros
     */
    buscarCustos(requisicao: ReqBuscarCustosModel): Observable<ResBuscarCustosModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/cadastros/buscarCustos');
        return this._http
            .post<ResBuscarCustosModel>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    alterarStatusCustos(custoId: number, status: number): Observable<any> {
        let url = this._endpointService.GetUrlRestService('financeiro/cadastros/alterarStatusCusto/' + custoId + '/' + status);
        return this._http
            .put<any>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    addCusto(requisicao: ReqAdicionarCustoModel): Observable<number> {
        let url = this._endpointService.GetUrlRestService('financeiro/cadastros/addCusto');
        return this._http
            .post<number>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    buscarPrestadores(requisicao: ReqBuscarPrestadoresModel): Observable<ResBuscarPrestadoresModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/cadastros/buscarPrestadores');
        return this._http
            .post<ResBuscarPrestadoresModel>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    alterarStatusPrestador(prestadorId: number, status: number): Observable<any> {
        let url = this._endpointService.GetUrlRestService('financeiro/cadastros/alterarStatusPrestador?id=' + prestadorId + '&status=' + status);
        return this._http
            .patch<any>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    salvarPrestador(requisicao: PrestadorModel): Observable<number> {
        let url = this._endpointService.GetUrlRestService('financeiro/cadastros/salvarPrestador');
        return this._http
            .post<number>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    alterarPrestador(requisicao: PrestadorModel): Observable<any> {
        let url = this._endpointService.GetUrlRestService('financeiro/cadastros/alterarPrestador');
        return this._http
            .put<any>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    /* Processos */
    inserirCusto(request: ReqInserirCustoEmbarcacaoModel): Observable<number> {

        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/inserirCusto');
        return this._http
            .post<number>(url, request, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    inserirCustoComprovante(formData: FormData, custoEmbarcacaoId: number): Observable<ResPadrao> {

        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/inserirCustoComprovante?id=' + custoEmbarcacaoId);
        return this._http
            .post<ResPadrao>(url, formData, {
                observe: 'response',
                headers: this._obterHeadersFormData()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    buscarCentroCustos(request: ReqBuscarCentroCustosModel): Observable<ResBuscarCentroCustosModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/buscarCentroCustos');
        return this._http
            .post<ResBuscarCentroCustosModel>(url, request, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    gerarFatura(requisicao: ReqGerarFaturaModel): Observable<void> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/gerarFatura');
        return this._http
            .put<void>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    buscarDemonstrativoCustos(idEmbarcacao: number, dataFaturamento: string): Observable<ResBuscarDemonstrativoCustosModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/buscarDemonstrativoCustos?id=' + idEmbarcacao + '&dataFaturamento=' + dataFaturamento);
        return this._http
            .get<ResBuscarDemonstrativoCustosModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    buscarFaturasAvulsas(idEmbarcacao: number, mesFaturas: string): Observable<ResBuscarFaturaAvulsaModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/buscarFaturasAvulsas?id=' + idEmbarcacao + '&mesFaturas=' + mesFaturas);
        return this._http
            .get<ResBuscarFaturaAvulsaModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    buscarCustosFixosEmbarcacao(idEmbarcacao: number): Observable<ResBuscarCustosFixosEmbarcacaoModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/buscarCustosFixosEmbarcacao?id=' + idEmbarcacao);
        return this._http
            .get<ResBuscarCustosFixosEmbarcacaoModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    buscarCustosVariaveisEmbarcacao(idEmbarcacao: number, mesReferencia: string): Observable<ResBuscarCustosVariaveisEmbarcacaoModelModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/buscarCustosVariaveisEmbarcacao?id=' + idEmbarcacao + '&mesFaturas=' + mesReferencia);
        return this._http
            .get<ResBuscarCustosVariaveisEmbarcacaoModelModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    buscarCustosFixosCota(idEmbarcacao: number): Observable<ResBuscarCustosFixosCotaModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/buscarCustosFixosCota?id=' + idEmbarcacao);
        return this._http
            .get<ResBuscarCustosFixosCotaModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    buscarCustosVariaveisCota(idEmbarcacao: number, mesReferencia: string): Observable<ResBuscarCustosVariaveisCotaModelModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/buscarCustosVariaveisCota?id=' + idEmbarcacao + '&mesFaturas=' + mesReferencia);
        return this._http
            .get<ResBuscarCustosVariaveisCotaModelModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    postFile(fileToUpload: File): Observable<boolean> {

        let url = this._endpointService.GetUrlRestService('financeiro/cadastros/uploadfile');
        return this._http
            .post<boolean>(url, fileToUpload, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    desabilitarCusto(requisicao: ReqInativarCustoModel): Observable<void> {
        let url = this._endpointService.GetUrlRestService('financeiro/custo/inativarCusto');
        return this._http
            .put<void>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    obterParcelasCusto(requisicao: ReqParcelasModel): Observable<ResParcelasModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/custo/obterParcelasCusto');
        return this._http
            .post<ResParcelasModel>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    /* Taxa de administração */
    atualizarTaxaAdministracao(reqAtualizarTaxaAdm: ReqAtualizarTaxaAdm): Observable<any> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/atualizarTaxaAdministracao');
        return this._http
            .post<any>(url, reqAtualizarTaxaAdm, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    obterTaxaAdministracao(embarcacaoId: number): Observable<any> {
        let url = this._endpointService.GetUrlRestService(`financeiro/embarcacao/obterTaxaAdm?embarcacaoId=${embarcacaoId}`);
        return this._http
            .get<ResObterTaxaAdmModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    /* Fatura Avulsa */
    buscarCustosFixos(embarcacaoId: number): Observable<ReqBuscarCustosFixosModel> {
        let url = this._endpointService.GetUrlRestService(`financeiro/embarcacao/buscarCustosFixos?id=${embarcacaoId}`);
        return this._http
            .get<ReqBuscarCustosFixosModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    gravarFaturaAvulsa(requisicao: ReqGravarFaturaAvulsaModel): Observable<ReqGravarFaturaAvulsaModel> {
        let url = this._endpointService.GetUrlRestService(`financeiro/fatura/gravarFaturaAvulsa`);
        return this._http
            .post<ReqGravarFaturaAvulsaModel>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    /* Acompanhamento de faturas */
    buscarFaturas(requisicao: ReqBuscarFaturasModel): Observable<ResBuscarFaturasModel> {
        let url = this._endpointService.GetUrlRestService('financeiro/embarcacao/buscarFaturas');
        return this._http
            .post<ResBuscarFaturasModel>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    gerarSegundaVia(requisicao: ReqGerarSegundaViaFaturaModel): Observable<void> {
        let url = this._endpointService.GetUrlRestService('financeiro/fatura/gerarSegundaVia');
        return this._http
            .post<void>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    cancelarFatura(requisicao: ReqCancelarFaturaModel): Observable<void> {
        let url = this._endpointService.GetUrlRestService('financeiro/fatura/cancelarFatura');
        return this._http
            .post<void>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    obterDadosFatura(faturaId: number): Observable<ResObterFaturaModel> {
        let url = this._endpointService.GetUrlRestService(`financeiro/fatura/obterDadosFatura?id=${faturaId}`);
        return this._http
            .get<ResObterFaturaModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }

    exportarDadosFaturas(requisicao: ReqExportarDadosFaturasModel): Observable<FaturasModel[]> {
        let url = this._endpointService.GetUrlRestService('financeiro/fatura/exportarDadosFaturas');
        return this._http
            .post<FaturasModel[]>(url, requisicao, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }
}

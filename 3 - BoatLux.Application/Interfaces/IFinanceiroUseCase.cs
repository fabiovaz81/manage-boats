using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Models.Fatura;
using BoatLux.Domain.Models.Financeiro;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BoatLux.Application.Interfaces
{
    public interface IFinanceiroUseCase
    {
        #region Custos
        List<CustoEntity> GetAllCustos();
        void Insert(CustoEntity custo);
        void Update(CustoEntity custo);
        void Delete(CustoEntity custo); 
        
        void InativarCusto(ReqInativarCustosModel req);

        List<ParcelasPorCustoModel> BuscarParcelasPorCusto(ReqObterParcerlasPorCustosModel req);
        #endregion

        #region Cadastros
        ListPaginationEntity BuscarCustos(ReqBuscarCustosModel reqBuscarCustosModel);
        bool UpdateStatus(int custoId, int status);
        int InsertCusto(CustoEntity custo);
        Task InserirPrestador(PrestadorEntity prestador);
        #endregion

        #region Embarcacao
        ReqInserirCustoEmbarcacaoModel InserirCusto(ReqInserirCustoEmbarcacaoModel reqCusto);
        Task InserirCustoComprovante(int idCapa, IFormCollection file);

        ListItensEntity BuscarCustosFixos(int id);

        List<CustoFixoEmbarcacaoModel> BuscarCustosFixosEmbarcacao(int id, DateTime? mesFaturas);
        List<CustoVariavelEmbarcacaoModel> BuscarCustosVariaveisEmbarcacao(int id, DateTime? mesFaturas);
        List<CustoFixoCotaModel> BuscarCustosFixosCota(int id, DateTime? mesFaturas);
        List<CustoVariavelCotaModel> BuscarCustosVariaveisCota(int id, DateTime? mesFaturas);

        List<FaturaAvulsaModel> BuscarFaturasAvulsas(int id, DateTime? mesFaturas);

        ListPaginationEntity BuscarFaturas(ReqBuscarFaturasModel request);
        #endregion

        ListPaginationEntity BuscarCCustos(ReqBuscarCCustosModel reqBuscarCCustosModel);
        List<DemonstrativoCustosModel> BuscarDemoCustos(int id, DateTime dataFaturamento);
        Task InserirFatura(int embarcacaoId, DateTime mesReferencia);
        ReqFaturaAvulsaModel GravarFaturaAvulsa(ReqFaturaAvulsaModel fatura);
        List<FaturasModel> ExportarDadosFaturas(ReqExportarDadosFaturaModel request);
        Task<ListPaginationEntity> BuscarPrestadores(ReqPrestadorModel prestador);
        bool AlterarStatusPrestador(int id, int status);
        Task<PrestadorEntity> AlterarPrestador(PrestadorEntity prestador);
        void GerarSegundaVia(ReqGerarSegundaViaFaturaModel request);
        void CancelarFatura(ReqCancelarFaturaModel request);
        ResObterFaturaModel ObterFatura(int faturaId);
        bool AtualizarTaxaAdm(ReqAtualizarTaxaAdm request);
        ResObterTaxaAdmModel ObterTaxaAdm(int embarcacaoId);
        List<ResObterCotaDaTaxaAdm> ObterCotaDaTaxaDeEmbarcacao(ReqObterTaxaPorCotista request);

    }
}

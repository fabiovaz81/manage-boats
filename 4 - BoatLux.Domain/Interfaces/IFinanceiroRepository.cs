using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Models.Fatura;
using BoatLux.Domain.Models.Financeiro;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BoatLux.Domain.Interfaces
{
    public interface IFinanceiroRepository
    {
        List<CustoEntity> GetAllCustos();
        void Update(CustoEntity custo);
        void Insert(CustoEntity custo);
        void Delete(CustoEntity custo);
        bool UpdateStatus(int custoId, int status);
        int InsertCusto(CustoEntity custo);

        void InativarCusto(string query);
        List<ParcelasPorCustoModel> BuscarParcelasPorCusto(ReqObterParcerlasPorCustosModel req);

        Task InserirPrestador(PrestadorEntity prestador);
        List<ReqBuscarCustosFixosModel> BuscarCustosFixos(int id);
        List<CustosModel> BuscarCustos(ReqBuscarCustosModel reqBuscarCustosModel);
        List<CCustosModel> BuscarCCustos(ReqBuscarCCustosModel reqBuscarCCustosModel);
        List<DemonstrativoCustosModel> BuscarDemoCustos(int id, DateTime dataFaturamento);
        Task<List<PrestadorEntity>> BuscarPrestadores(ReqPrestadorModel prestador);
        bool AlterarStatusPrestador(int id, int status);
        Task<PrestadorEntity> AlterarPrestador(PrestadorEntity prestador);
        int InserirCapaCusto(CustoCapaEntity custo);
        int InserirCustoFixoEmbarcacao(CustoFixoEmbarcacaoEntity custo);
        int InserirCustoFixoCota(CustoFixoCotaEntity custo);
        int InserirCustoVariavelEmbarcacao(CustoVariavelEmbarcacaoEntity custo);
        int InserirCustoVariavelCota(CustoVariavelCotaEntity custo);
        Task InsertComprovanteCusto(int idCapa, string guidName);
        int InserirFatura(FaturaEntity fatura);
        int InserirFaturaItem(FaturaItemEntity faturaItem);

        List<CustoFixoEmbarcacaoModel> BuscarCustosFixosEmbarcacao(int id, DateTime? mesFaturas);
        List<CustoVariavelEmbarcacaoModel> BuscarCustosVariaveisEmbarcacao(int id, DateTime? mesFaturas);
        List<CustoFixoCotaModel> BuscarCustosFixosCota(int id, DateTime? mesFaturas);
        List<CustoVariavelCotaModel> BuscarCustosVariaveisCota(int id, DateTime? mesFaturas);
        List<FaturaAvulsaModel> BuscarFaturasAvulsas(int id, DateTime? mesFaturas);
        List<FaturasModel> BuscarFaturas(ReqBuscarFaturasModel request);
        List<FaturasModel> ExportarDadosFaturas(ReqExportarDadosFaturaModel request);
        void CancelarFatura(ReqCancelarFaturaModel request);
        List<string> ObterIdsIugu(int[] faturaIds);
        ResObterFaturaModel ObterFatura(int faturaId);
        FaturaEntity GetFaturaById(int faturaId);
        List<ResObterFaturaModel.ItensFaturaModel> ObterFaturaItensPeloId(int faturaId);

        EmbarcacaoFinanceiroEntity ObterTaxaAdmEmbarcacao(int embarcacaoId);
        bool AtualizarTaxaAdmPadrao(ReqAtualizarTaxaAdm request);
        bool AtualizarTaxaAdmMinima(ReqAtualizarTaxaAdm request);
        ResObterTaxaAdmModel ObterTaxaAdm(int embarcacaoId);
        List<ResObterCotaDaTaxaAdm> ObterCotaDaTaxaDeEmbarcacao(ReqObterTaxaPorCotista request);
        void AtualizarTaxaAdmFatura(ResObterCotaDaTaxaAdm res);
        List<CustoParceladoModel> ObterCustosFuturo(ReqInativarCustosModel req);
    }
}

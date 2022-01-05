using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Extensions;
using BoatLux.Domain.Interfaces;
using BoatLux.Domain.Models.Fatura;
using BoatLux.Domain.Models.Financeiro;
using BoatLux.Domain.Models.Paginacao;
using BoatLux.Infra.Context;
using BoatLux.Infra.DapperContext;
using BoatLux.Infra.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BoatLux.Infra.Repositories
{
    public class FinanceiroRepository : IFinanceiroRepository
    {
        private readonly DBContext _context;
        private readonly IOptions<MyAppSettings> _myAppSettings;

        public FinanceiroRepository(DBContext context, IOptions<MyAppSettings> myAppSettings)
        {
            _myAppSettings = myAppSettings;
            _context = context;
        }

        public List<CustoEntity> GetAllCustos()
        {
            var custos = new List<CustoEntity>();

            var dbCustos = _context.Custo;

            foreach (var custo in dbCustos)
                custos.Add(custo);

            return custos;
        }

        public void Update(CustoEntity custo)
        {
            _context.Custo.Update(custo);
            _context.SaveChanges();
        }

        public void Insert(CustoEntity custo)
        {
            _context.Custo.Add(custo);
            _context.SaveChanges();
        }

        public void Delete(CustoEntity custo)
        {
            _context.Custo.Remove(custo);
            _context.SaveChanges();
        }

        public List<CustosModel> BuscarCustos(ReqBuscarCustosModel reqBuscarCustosModel)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            var custos = financeiroContext.SelectCustos(reqBuscarCustosModel);

            return custos;
        }

        public List<CCustosModel> BuscarCCustos(ReqBuscarCCustosModel request)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            var custos = financeiroContext.SelectCCustos(request);

            return custos;
        }

        public List<DemonstrativoCustosModel> BuscarDemoCustos(int id, DateTime dataFaturamento)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            var demoCustos = financeiroContext.BuscarDemoCustos(id, dataFaturamento);

            return demoCustos;
        }

        public bool UpdateStatus(int custoId, int status)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.UpdateStatus(custoId, status);
        }

        public int InsertCusto(CustoEntity custo)
        {
            _context.Custo.Add(custo);
            _context.SaveChanges();

            return custo.Id;
        }

        public async Task InserirPrestador(PrestadorEntity prestador)
        {
            _context.Prestador.Add(prestador);
            await _context.SaveChangesAsync();
        }

        public async Task<List<PrestadorEntity>> BuscarPrestadores(ReqPrestadorModel prestador)
            => await new FinanceiroContext(_myAppSettings).BuscarPrestadores(prestador);

        public bool AlterarStatusPrestador(int id, int status)
        => new FinanceiroContext(_myAppSettings).AlterarStatusPrestador(id, status);

        public async Task<PrestadorEntity> AlterarPrestador(PrestadorEntity prestador)
        {
            prestador.UpdateId();
            _context.Prestador.Update(prestador);
            await _context.SaveChangesAsync();
            return prestador;
        }


        public void InativarCusto(string query)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            financeiroContext.InativarCusto(query);
        } 
           
        public List<ParcelasPorCustoModel> BuscarParcelasPorCusto(ReqObterParcerlasPorCustosModel req)
        {
            var financeiro = new FinanceiroContext(_myAppSettings);
            return financeiro.SelectParcelasPorCusto(req);
        }

        #region Inserir Custos 
        public int InserirCapaCusto(CustoCapaEntity custo)
        {
            _context.CustoCapa.Add(custo);
            _context.SaveChanges();
            return custo.Id;
        }
        public int InserirCustoFixoEmbarcacao(CustoFixoEmbarcacaoEntity custo)
        {
            _context.CustoFixoEmbarcacao.Add(custo);
            _context.SaveChanges();
            return custo.Id;
        }
        public int InserirCustoFixoCota(CustoFixoCotaEntity custo)
        {
            _context.CustoFixoCota.Add(custo);
            _context.SaveChanges();
            return custo.Id;
        }
        public int InserirCustoVariavelEmbarcacao(CustoVariavelEmbarcacaoEntity custo)
        {
            _context.CustoVariavelEmbarcacao.Add(custo);
            _context.SaveChanges();
            return custo.Id;
        }
        public int InserirCustoVariavelCota(CustoVariavelCotaEntity custo)
        {
            _context.CustoVariavelCota.Add(custo);
            _context.SaveChanges();
            return custo.Id;
        }

        #endregion

        public Task InsertComprovanteCusto(int idCapa, string guidName)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            financeiroContext.InsertComprovanteCusto(idCapa, guidName);
            return Task.CompletedTask;
        }

        public List<ReqBuscarCustosFixosModel> BuscarCustosFixos(int id)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.BuscarCustosFixos(id);
        }

        public int InserirFatura(FaturaEntity fatura)
        {
            _context.Fatura.Add(fatura);
            _context.SaveChanges();

            var status = new FaturaStatusEntity((int)fatura.Id, 5, DateTime.Now, "Nova fatura");
            _context.FaturaStatus.Add(status);
            _context.SaveChanges();

            return (int)fatura.Id;
        }
        public int InserirFaturaItem(FaturaItemEntity faturaItem)
        {
            _context.FaturaItem.Add(faturaItem);
            _context.SaveChanges();
            return (int)faturaItem.Id;
        }

        public List<CustoFixoEmbarcacaoModel> BuscarCustosFixosEmbarcacao(int id, DateTime? mesFaturas)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.BuscarCustosFixosEmbarcacao(id, mesFaturas);
        }

        public List<CustoVariavelEmbarcacaoModel> BuscarCustosVariaveisEmbarcacao(int id, DateTime? mesFaturas)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.BuscarCustosVariaveisEmbarcacao(id, mesFaturas);
        }

        public List<CustoFixoCotaModel> BuscarCustosFixosCota(int id, DateTime? mesFaturas)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.BuscarCustosFixosCota(id, mesFaturas);
        }

        public List<CustoVariavelCotaModel> BuscarCustosVariaveisCota(int id, DateTime? mesFaturas)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.BuscarCustosVariaveisCota(id, mesFaturas);
        }

        public List<FaturaAvulsaModel> BuscarFaturasAvulsas(int id, DateTime? mesFaturas)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.BuscarFaturasAvulsas(id, mesFaturas);
        }

        public List<FaturasModel> BuscarFaturas(ReqBuscarFaturasModel request)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.BuscarFaturas(request);
        }

        public List<FaturasModel> ExportarDadosFaturas(ReqExportarDadosFaturaModel request)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            return financeiroContext.ExportarDadosFaturas(request);
        }

        public void CancelarFatura(ReqCancelarFaturaModel request) =>
            new FinanceiroContext(_myAppSettings).CancelarFatura(request);

        public List<string> ObterIdsIugu(int[] faturaIds) =>
            new FinanceiroContext(_myAppSettings).ObterIdsIugu(faturaIds);
        public ResObterFaturaModel ObterFatura(int faturaId)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);

            var fatura = financeiroContext.ObterFaturaPeloId(faturaId);
            fatura.Itens = financeiroContext.ObterFaturaItensPeloId(faturaId);

            //ToDo: Carregar Histórico
            // fatura.HistoricosFaturaModel = financeiroContext.ObterFaturaHistoricoPeloId(request);
            // fatura.Detalhe = financeiroContext.ObterFaturaDetalhesPeloId(request);

            return fatura;
        }

        public FaturaEntity GetFaturaById(int faturaId) => new FinanceiroContext(_myAppSettings).GetFaturaById(faturaId);

        public List<ResObterFaturaModel.ItensFaturaModel> ObterFaturaItensPeloId(int faturaId) => new FinanceiroContext(_myAppSettings).ObterFaturaItensPeloId(faturaId);

        public EmbarcacaoFinanceiroEntity ObterTaxaAdmEmbarcacao(int embarcacaoId) => new FinanceiroContext(_myAppSettings).ObterTaxaAdm(embarcacaoId);
        public bool AtualizarTaxaAdmPadrao(ReqAtualizarTaxaAdm request) => new FinanceiroContext(_myAppSettings).AtualizarTaxaAdmPadrao(request);
        public bool AtualizarTaxaAdmMinima(ReqAtualizarTaxaAdm request) => new FinanceiroContext(_myAppSettings).AtualizarTaxaAdmMinima(request);

        public ResObterTaxaAdmModel ObterTaxaAdm(int embarcacaoId)
            => new ResObterTaxaAdmModel(new FinanceiroContext(_myAppSettings).ObterTaxaAdm(embarcacaoId));

        public List<ResObterCotaDaTaxaAdm> ObterCotaDaTaxaDeEmbarcacao(ReqObterTaxaPorCotista request)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            var cotasPorFatura = financeiroContext.ObterCotaDaTaxaDeEmbarcacao(request);

            return cotasPorFatura;
        }

        public List<CustoParceladoModel> ObterCustosFuturo(ReqInativarCustosModel req)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            var custos = financeiroContext.ObterCustosFuturo(req);

            return custos;
        }

        public void AtualizarTaxaAdmFatura(ResObterCotaDaTaxaAdm res)
        {
            var financeiroContext = new FinanceiroContext(_myAppSettings);
            financeiroContext.AtualizarTaxaAdmFatura(res);

        }

    }
}



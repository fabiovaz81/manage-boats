using Amazon.S3.Model;
using BoatLux.Application.Interfaces;
using BoatLux.Domain.Entities;
using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Enums.Financeiro;
using BoatLux.Domain.Extensions;
using BoatLux.Domain.Interfaces;
using BoatLux.Domain.Models.Fatura;
using BoatLux.Domain.Models.Financeiro;
using BoatLux.Infra.Mapping;
using BoatLux.Infra.Options;
using BoatLux.Infra.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BoatLux.Domain.Models.Fatura.ReqFaturaAvulsaModel;

namespace BoatLux.Application.UseCases
{
    public class FinanceiroUseCase : IFinanceiroUseCase
    {
        private readonly IFinanceiroRepository _repository;
        private readonly ISubscribe _subscribe;
        private readonly IS3Service _s3Service;
        private readonly IOptions<MyAppSettings> _myAppSettings;

        public FinanceiroUseCase(IFinanceiroRepository repository, ISubscribe subscribe, IS3Service s3Service, IOptions<MyAppSettings> myAppSettings)
        {
            _repository = repository;
            _subscribe = subscribe;
            _s3Service = s3Service;
            _myAppSettings = myAppSettings;
        }

        public List<CustoEntity> GetAllCustos()
        {
            var custos = _repository.GetAllCustos();
            return custos;
        }

        public void Insert(CustoEntity custo)
        {
            _repository.Insert(custo);
        }

        public void Update(CustoEntity custo)
        {
            _repository.Update(custo);
        }

        public void Delete(CustoEntity custo)
        {
            _repository.Delete(custo);
        }


        public void InativarCusto(ReqInativarCustosModel req)
        {
            _repository.InativarCusto(CriarQueryInativarCusto(req));
            if ((bool)req.DesativarParcelasFuturas)
                DesativarCustosFuturo(req);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="FixoCota">3</param>
        /// <param name="FixoEmbarcacao">1</param>
        /// <param name="VariavelCota">4</param>
        /// <param name="VariavelEmbarcacao">2</param>
        /// <returns></returns>
        private string CriarQueryInativarCusto(ReqInativarCustosModel model)
        {
            string tabela = string.Empty;
            string where = string.Empty;

            tabela= model.tipoCusto  switch
            {
                (int)FinanceiroTipoCustosEnum.FixoCota => "_financeiro_cota_custos_fixos",
                (int)FinanceiroTipoCustosEnum.VariavelCota => "_financeiro_cota_custos_variaveis",
                (int)FinanceiroTipoCustosEnum.FixoEmbarcacao => "_financeiro_embarcacao_custos_fixos",
                (int)FinanceiroTipoCustosEnum.VariavelEmbarcacao => "_financeiro_embarcacao_custos_variaveis",
            };

            where = model.idEmbarcacao.HasValue ? $"id_embarcacao={model.idEmbarcacao}" : $"id_cota={model.idCota}";
            
            return $"update {tabela} set status=0  where id={model.id} and {where}" ;
        }
      

        public List<ParcelasPorCustoModel> BuscarParcelasPorCusto(ReqObterParcerlasPorCustosModel req) {
            var parcelas = _repository.BuscarParcelasPorCusto(req);
            return parcelas;
        }

        #region Cadastros
        public ListPaginationEntity BuscarCustos(ReqBuscarCustosModel reqBuscarCustosModel)
        {
            var custosModel = _repository.BuscarCustos(reqBuscarCustosModel);

            reqBuscarCustosModel.Paginacao.TotalItens = custosModel.Count();

            custosModel = custosModel.Paginar(reqBuscarCustosModel.Paginacao);

            return new ListPaginationEntity(custosModel, reqBuscarCustosModel.Paginacao); 
        }

        public bool UpdateStatus(int custoId, int status) => _repository.UpdateStatus(custoId, status);

        public int InsertCusto(CustoEntity custo) => _repository.InsertCusto(custo);

        public async Task InserirPrestador(PrestadorEntity prestador)
        {
            await _repository.InserirPrestador(prestador);
            prestador.UpdatePrestadorId();
        }

        public async Task<ListPaginationEntity> BuscarPrestadores(ReqPrestadorModel prestador)
        {
            var response = await _repository.BuscarPrestadores(prestador);
            prestador.Paginacao.TotalItens = response.Count();
            response = response.Paginar(prestador.Paginacao);
            return new ListPaginationEntity(response, prestador.Paginacao);
        }

        public bool AlterarStatusPrestador(int id, int status)
            => _repository.AlterarStatusPrestador(id, status);

        public Task<PrestadorEntity> AlterarPrestador(PrestadorEntity prestador)
            => _repository.AlterarPrestador(prestador);
        #endregion

        #region Embarcacoes
        public ListPaginationEntity BuscarCCustos(ReqBuscarCCustosModel reqBuscarCCustosModel)
        {
            var cCustosModel = _repository.BuscarCCustos(reqBuscarCCustosModel);

            reqBuscarCCustosModel.Paginacao.TotalItens = cCustosModel.Count();

            cCustosModel = cCustosModel.Paginar(reqBuscarCCustosModel.Paginacao);

            return new ListPaginationEntity(cCustosModel, reqBuscarCCustosModel.Paginacao);
        }

        public List<DemonstrativoCustosModel> BuscarDemoCustos(int id, DateTime dataFaturamento) => _repository.BuscarDemoCustos(id, dataFaturamento);

        public List<CustoFixoEmbarcacaoModel> BuscarCustosFixosEmbarcacao(int id, DateTime? mesFaturas)
            => _repository.BuscarCustosFixosEmbarcacao(id, mesFaturas);

        public List<CustoVariavelEmbarcacaoModel> BuscarCustosVariaveisEmbarcacao(int id, DateTime? mesFaturas)
            => _repository.BuscarCustosVariaveisEmbarcacao(id, mesFaturas);

        public List<CustoFixoCotaModel> BuscarCustosFixosCota(int id, DateTime? mesFaturas)
           => _repository.BuscarCustosFixosCota(id, mesFaturas);

        public List<CustoVariavelCotaModel> BuscarCustosVariaveisCota(int id, DateTime? mesFaturas)
            => _repository.BuscarCustosVariaveisCota(id, mesFaturas);

        public List<FaturaAvulsaModel> BuscarFaturasAvulsas(int id, DateTime? mesFaturas)
            => _repository.BuscarFaturasAvulsas(id, mesFaturas);

        public ListPaginationEntity BuscarFaturas(ReqBuscarFaturasModel request)
        {

            var faturas = _repository.BuscarFaturas(request);

            request.Paginacao.TotalItens = faturas.Count();

            faturas = faturas.Paginar(request.Paginacao);

            return new ListPaginationEntity(faturas, request.Paginacao);
        }


        #region Inserir Custo
        public ReqInserirCustoEmbarcacaoModel InserirCusto(ReqInserirCustoEmbarcacaoModel reqCusto)
        {
            var idCapa = Equals(reqCusto.TipoCusto, 1)
                ? InserirCustoVariavel(reqCusto)
                : InserirCustoFixo(reqCusto);

            reqCusto.UpdateCustoId(idCapa);

            return reqCusto;
        }

        private int InserirCustoFixo(ReqInserirCustoEmbarcacaoModel custo)
        {
            if (string.Equals(custo.TipoLancamento, "1"))
            {
                int idCapa = _repository.InserirCapaCusto(new CustoCapaEntity((int)FinanceiroTipoCustosEnum.FixoEmbarcacao));

                _repository.InserirCustoFixoEmbarcacao(new CustoFixoEmbarcacaoEntity(custo.EmbarcacaoId, custo.CustoId, custo.Valor, 0, idCapa, custo.Observacao));

                return idCapa;
            }
            else
            {
                int idCapa = _repository.InserirCapaCusto(new CustoCapaEntity((int)FinanceiroTipoCustosEnum.FixoCota));

                foreach (int cotaId in custo.CotaIds)
                {
                    _repository.InserirCustoFixoCota(
                        new CustoFixoCotaEntity(cotaId, custo.CustoId, custo.Valor, 0, idCapa, custo.Observacao)
                    );
                }

                return idCapa;
            }
        }

        private int InserirCustoVariavel(ReqInserirCustoEmbarcacaoModel custo)
        {
            if (string.Equals(custo.TipoLancamento, "1"))
            {
                int idCapa = _repository.InserirCapaCusto(new CustoCapaEntity((int)FinanceiroTipoCustosEnum.FixoEmbarcacao));

                double valorCusto = Equals(custo.TipoValorparcela, "1") ? custo.Valor / custo.QuantidadeParcelas : custo.Valor;

                for (int numeroParcela = 1; numeroParcela <= custo.QuantidadeParcelas; numeroParcela++)
                {
                    DateTime dataReferencia = Convert.ToDateTime(custo.MesInicialFaturamento);
                    if (numeroParcela > 1) dataReferencia = dataReferencia.AddMonths(numeroParcela - 1);
                    string referenciaFatura = $"{dataReferencia.Year}{dataReferencia.Month.ToString().PadLeft(2, '0')}";

                    _repository.InserirCustoVariavelEmbarcacao(
                        new CustoVariavelEmbarcacaoEntity(
                            custo.EmbarcacaoId, custo.CustoId, referenciaFatura, valorCusto,
                            $"{numeroParcela}/{custo.QuantidadeParcelas}", custo.Observacao,
                            0, idCapa
                            )
                        );
                }

                return idCapa;
            }
            else
            {
                int idCapa = _repository.InserirCapaCusto(new CustoCapaEntity((int)FinanceiroTipoCustosEnum.FixoCota));

                double valorCusto = Equals(custo.TipoValorparcela, "1") ? custo.Valor / custo.QuantidadeParcelas : custo.Valor;

                for (int numeroParcela = 1; numeroParcela <= custo.QuantidadeParcelas; numeroParcela++)
                {
                    DateTime dataReferencia = Convert.ToDateTime(custo.MesInicialFaturamento);
                    if (numeroParcela > 1) dataReferencia = dataReferencia.AddMonths(numeroParcela - 1);
                    string referenciaFatura = $"{dataReferencia.Year}{dataReferencia.Month.ToString().PadLeft(2, '0')}";

                    foreach (int cotaId in custo.CotaIds)
                    {
                        _repository.InserirCustoVariavelCota(
                            new CustoVariavelCotaEntity(
                                cotaId, custo.CustoId, referenciaFatura, valorCusto,
                                $"{numeroParcela}/{custo.QuantidadeParcelas}", custo.Observacao,
                                0, 0, 0, idCapa
                            )
                        );
                    }
                }

                return idCapa;
            }
        }

        #endregion

        public async Task InserirCustoComprovante(int idCapa, IFormCollection files)
        {
            //[id]_[yyyy-MM-dd]_[fileName]
            string date = DateTime.Now.ToString("yyyy-MM-dd");
            foreach (var file in files.Files)
            {
                string guidName = $"{idCapa}_{date}_{file.FileName}";
                var putRequest = new PutObjectRequest()
                {
                    Key = guidName,
                    BucketName = _myAppSettings.Value.S3.BucketName,
                    InputStream = file.OpenReadStream(),
                    ContentType = file.ContentType,
                };
                await _repository.InsertComprovanteCusto(idCapa, guidName);
                await _s3Service.UploadFile(putRequest);
            }
        }

        public ListItensEntity BuscarCustosFixos(int id)
        {
            return new ListItensEntity(_repository.BuscarCustosFixos(id));
        }


        #endregion

        #region Fatura
        public async Task InserirFatura(int embarcacaoId, DateTime mesReferencia)
        {
            var faturaEntity = new FaturaEntity("a", DateTime.Now, 0, 0, 0, 0, 0, 0, 0, 0);
            _repository.InserirFatura(faturaEntity);

            //ToDo: Buscar custos Lançados para embarcacao pelo mesReferencia

            //ToDo: Inserir fatura Status

            await Task.CompletedTask;
        }

        #region Fatura Avulsa
        public ReqFaturaAvulsaModel GravarFaturaAvulsa(ReqFaturaAvulsaModel fatura)
        {
            var resFatura = fatura.TipoFaturaAvulsa switch
            {
                (int)TipoFaturaEnum.Mensal => GravarFaturaMensal(fatura),
                (int)TipoFaturaEnum.Parcelada => GravarFaturaParcelada(fatura),
                (int)TipoFaturaEnum.Combustivel => GravarFaturaCombustivel(fatura),
                (int)TipoFaturaEnum.Diversas => GravarFaturaDiversas(fatura),
                _ => fatura,
            };

            return resFatura;
        }
        private ReqFaturaAvulsaModel GravarFaturaMensal(ReqFaturaAvulsaModel fatura)
        {
            var faturas = new List<FaturaEntity>();

            foreach (FaturaAvulsaCustos custos in fatura.CustosFatura)
            {
                int idCapa = _repository.InserirCapaCusto(new CustoCapaEntity((int)FinanceiroTipoCustosEnum.VariavelEmbarcacao));

                double valor = custos.Valor;
                var custo = new CustoVariavelCotaEntity(
                    (int)custos.CotaId,
                    (int)custos.CustoId,
                    $"{fatura.DataVencimento.Year}{fatura.DataVencimento.Month.ToString().PadLeft(2, '0')}",
                    custos.Valor, //
                    "1/1",
                    custos.Observacao,
                    0,
                    1,
                    0,
                    idCapa
                );

                custo.Id = _repository.InserirCustoVariavelCota(custo);

                var faturaParaCotaExiste = faturas.FirstOrDefault(
                    x => x.FaturaItens.FirstOrDefault(
                        x => x.CotaId == custos.CotaId) is null ? false : true
                    ) is null ? false : true;

                if (!faturaParaCotaExiste)
                {
                    var dataVencimento = fatura.DataVencimento;

                    var faturaCotas = new FaturaEntity(
                        $"{fatura.DataVencimento.Year}{fatura.DataVencimento.Month.ToString().PadLeft(2, '0')}",
                        dataVencimento, (int)custos.CotaId, 0, 1, 0, 0, 0, 0, 1
                    );

                    faturaCotas.Id = _repository.InserirFatura(faturaCotas);

                    faturas.Add(faturaCotas);
                }

                var faturaCotaAtual = faturas.FirstOrDefault(x => x.CotaId == custo.CotaId);
                var faturaItem = new FaturaItemEntity((int)faturaCotaAtual.Id, custo.CustoId, custo.Valor, "CVC", 0, custo.CotaId);

                if (faturaCotaAtual.FaturaItens is null)
                    faturaCotaAtual.FaturaItens = new List<FaturaItemEntity>();

                faturaCotaAtual.FaturaItens.Add(faturaItem);

                _repository.InserirFaturaItem(faturaItem);
                fatura.UpdateCustoByGuid(idCapa, custos.Guid);
            }
            return fatura;
        }
        private ReqFaturaAvulsaModel GravarFaturaParcelada(ReqFaturaAvulsaModel fatura)
        {
            var faturas = new List<FaturaEntity>();

            for (int numeroParcela = 1; numeroParcela <= fatura.QuantidadeParcelas; numeroParcela++)
            {
                foreach (FaturaAvulsaCustos custos in fatura.CustosFatura)
                {
                    int idCapa = _repository.InserirCapaCusto(new CustoCapaEntity((int)FinanceiroTipoCustosEnum.VariavelEmbarcacao));

                    double valor = custos.Valor;
                    var custo = new CustoVariavelCotaEntity(
                        (int)custos.CotaId,
                        (int)custos.CustoId,
                        $"{fatura.DataVencimento.Year}{fatura.DataVencimento.Month.ToString().PadLeft(2, '0')}",
                        custos.Valor,
                        $"{numeroParcela}/{fatura.QuantidadeParcelas}",
                        custos.Observacao,
                        0,
                        1,
                        0,
                        idCapa
                    );

                    custo.Id = _repository.InserirCustoVariavelCota(custo);

                    var faturaParaCotaExiste = faturas.FirstOrDefault(
                        x => x.FaturaItens.FirstOrDefault(
                            x => x.CotaId == custos.CotaId) is null ? false : true
                        ) is null ? false : true;

                    if (!faturaParaCotaExiste)
                    {
                        var dataVencimento = fatura.DataVencimento;

                        var faturaCotas = new FaturaEntity(
                            $"{fatura.DataVencimento.Year}{fatura.DataVencimento.Month.ToString().PadLeft(2, '0')}",
                            dataVencimento, (int)custos.CotaId, 0, 1, 0, 0, 0, 0, 1
                        );

                        faturaCotas.Id = _repository.InserirFatura(faturaCotas);

                        faturas.Add(faturaCotas);
                    }

                    var faturaCotaAtual = faturas.FirstOrDefault(x => x.CotaId == custo.CotaId);
                    var faturaItem = new FaturaItemEntity((int)faturaCotaAtual.Id, custo.CustoId, custo.Valor, "CVC", 0, custo.CotaId);

                    if (faturaCotaAtual.FaturaItens is null)
                        faturaCotaAtual.FaturaItens = new List<FaturaItemEntity>();

                    faturaCotaAtual.FaturaItens.Add(faturaItem);

                    _repository.InserirFaturaItem(faturaItem);
                    fatura.UpdateCustoByGuid(idCapa, custos.Guid);
                }
            }
            return fatura;
        }
        private ReqFaturaAvulsaModel GravarFaturaCombustivel(ReqFaturaAvulsaModel fatura)
        {
            var faturas = new List<FaturaEntity>();

            foreach (FaturaAvulsaCustos custos in fatura.CustosFatura)
            {
                int idCapa = _repository.InserirCapaCusto(new CustoCapaEntity((int)FinanceiroTipoCustosEnum.VariavelEmbarcacao));

                double valor = custos.Valor;
                var custo = new CustoVariavelCotaEntity(
                    (int)custos.CotaId,
                    0,//(int)custos.CustoId,
                    $"{fatura.DataVencimento.Year}{fatura.DataVencimento.Month.ToString().PadLeft(2, '0')}",
                    custos.Valor,
                    "1/1",
                    custos.Observacao,
                    0,
                    1,
                    idCapa,
                    (int)custos.CombustivelId,
                    (double)custos.Litros,
                    (double)custos.TaxaAbastecimento,
                    (DateTime)custos.DataUso,
                    (DateTime)custos.DataAbastecimento,
                    (int)custos.PrestadorId
                );

                custo.Id = _repository.InserirCustoVariavelCota(custo);

                var faturaParaCotaExiste = faturas.FirstOrDefault(
                    x => x.FaturaItens.FirstOrDefault(
                        x => x.CotaId == custos.CotaId) is null ? false : true
                    ) is null ? false : true;

                if (!faturaParaCotaExiste)
                {
                    var dataVencimento = fatura.DataVencimento;

                    var faturaCotas = new FaturaEntity(
                        $"{fatura.DataVencimento.Year}{fatura.DataVencimento.Month.ToString().PadLeft(2, '0')}",
                        dataVencimento, (int)custos.CotaId, 0, 1, 0, 0, 0, 0, 1
                    );

                    faturaCotas.Id = _repository.InserirFatura(faturaCotas);

                    faturas.Add(faturaCotas);
                }

                var faturaCotaAtual = faturas.FirstOrDefault(x => x.CotaId == custo.CotaId);
                var faturaItem = new FaturaItemEntity((int)faturaCotaAtual.Id, custo.CustoId, custo.Valor, "CVC", 0, custo.CotaId);

                if (faturaCotaAtual.FaturaItens is null)
                    faturaCotaAtual.FaturaItens = new List<FaturaItemEntity>();

                faturaCotaAtual.FaturaItens.Add(faturaItem);

                _repository.InserirFaturaItem(faturaItem);
                fatura.UpdateCustoByGuid(idCapa, custos.Guid);
            }
            return fatura;
        }
        private ReqFaturaAvulsaModel GravarFaturaDiversas(ReqFaturaAvulsaModel fatura)
        {
            var faturas = new List<FaturaEntity>();

            foreach (FaturaAvulsaCustos custos in fatura.CustosFatura)
            {
                int idCapa = _repository.InserirCapaCusto(new CustoCapaEntity((int)FinanceiroTipoCustosEnum.VariavelEmbarcacao));

                double valor = custos.Valor;
                var custo = new CustoVariavelCotaEntity(
                    (int)custos.CotaId,
                    (int)custos.CustoId,
                    $"{fatura.DataVencimento.Year}{fatura.DataVencimento.Month.ToString().PadLeft(2, '0')}",
                    custos.Valor, //
                    "1/1",
                    custos.Observacao,
                    0,
                    1,
                    0,
                    idCapa
                );

                custo.Id = _repository.InserirCustoVariavelCota(custo);

                var faturaParaCotaExiste = faturas.FirstOrDefault(
                    x => x.FaturaItens.FirstOrDefault(
                        x => x.CotaId == custos.CotaId) is null ? false : true
                    ) is null ? false : true;

                if (!faturaParaCotaExiste)
                {
                    var dataVencimento = fatura.DataVencimento;

                    var faturaCotas = new FaturaEntity(
                        $"{fatura.DataVencimento.Year}{fatura.DataVencimento.Month.ToString().PadLeft(2, '0')}",
                        dataVencimento, (int)custos.CotaId, 0, 1, 0, 0, 0, 0, 1
                    );

                    faturaCotas.Id = _repository.InserirFatura(faturaCotas);

                    faturas.Add(faturaCotas);
                }

                var faturaCotaAtual = faturas.FirstOrDefault(x => x.CotaId == custo.CotaId);
                var faturaItem = new FaturaItemEntity((int)faturaCotaAtual.Id, custo.CustoId, custo.Valor, "CVC", 0, custo.CotaId);

                if (faturaCotaAtual.FaturaItens is null)
                    faturaCotaAtual.FaturaItens = new List<FaturaItemEntity>();

                faturaCotaAtual.FaturaItens.Add(faturaItem);

                _repository.InserirFaturaItem(faturaItem);
                fatura.UpdateCustoByGuid(idCapa, custos.Guid);
            }
            return fatura;
        }
        #endregion

        public List<FaturasModel> ExportarDadosFaturas(ReqExportarDadosFaturaModel request)
            => _repository.ExportarDadosFaturas(request);

        #endregion

        public void GerarSegundaVia(ReqGerarSegundaViaFaturaModel request)
        {
            //ToDo: Se gera Juros
            //ToDo: Se gera Multa

            foreach (int id in request.FaturaIds)
            {
                var fatura = _repository.GetFaturaById(id);
                fatura.Id = null;
                fatura.Vencimento = request.DataSegundaVia;

                _repository.InserirFatura(fatura);

                var faturaItens = _repository.ObterFaturaItensPeloId(id);

                foreach (ResObterFaturaModel.ItensFaturaModel item in faturaItens)
                {
                    var faturaItem = new FaturaItemEntity((int)fatura.Id, item.CustoId, item.ValorItem, item.TipoCusto, 0, 0);
                    _repository.InserirFaturaItem(faturaItem);
                }
            }
        }

        public async void CancelarFatura(ReqCancelarFaturaModel request)
        {
            var idsIugu = _repository.ObterIdsIugu(request.FaturaIds);
            foreach (string idIugu in idsIugu)
            {
                await _subscribe.CancelarFatura(idIugu);
            }
            _repository.CancelarFatura(request);
        }

        public ResObterFaturaModel ObterFatura(int faturaId) => _repository.ObterFatura(faturaId);

        public bool AtualizarTaxaAdm(ReqAtualizarTaxaAdm request)
        {
            var dadosEmbarcacao = _repository.ObterTaxaAdmEmbarcacao(request.EmbarcacaoId);

            return request.Tipo switch
            {
                1 => AtualizarTaxaAdmMinima(request, dadosEmbarcacao),
                2 => AtualizarTaxaAdmPadrao(request, dadosEmbarcacao),
                _ => throw new NotImplementedException("Tipo do perfil não encontrado")
            };
        }

        private bool AtualizarTaxaAdmMinima(ReqAtualizarTaxaAdm request, EmbarcacaoFinanceiroEntity dadosEmbarcacao)
        {
            var isUpdate = false;

            isUpdate = _repository.AtualizarTaxaAdmMinima(request);

            if (request.Valor > dadosEmbarcacao.TaxaAdm)
                isUpdate = _repository.AtualizarTaxaAdmPadrao(request);

            return isUpdate;
        }

        private bool AtualizarTaxaAdmPadrao(ReqAtualizarTaxaAdm request, EmbarcacaoFinanceiroEntity dadosEmbarcacao)
        {
            if (dadosEmbarcacao.TaxaAdmMinima > request.Valor)
                return false;
            return _repository.AtualizarTaxaAdmPadrao(request);
        }

        public ResObterTaxaAdmModel ObterTaxaAdm(int embarcacaoId) => _repository.ObterTaxaAdm(embarcacaoId);

        public List<ResObterCotaDaTaxaAdm> ObterCotaDaTaxaDeEmbarcacao(ReqObterTaxaPorCotista request) {

            var cotas = _repository.ObterCotaDaTaxaDeEmbarcacao(request);
            var faturas = cotas.ToList();
            if ((bool)request.AtualizarTaxaAdmFatura)
            {
                faturas.ForEach(i => {
                    _repository.AtualizarTaxaAdmFatura(i);
                });
            }
            
            return cotas;

            
        }
        public void DesativarCustosFuturo(ReqInativarCustosModel req)
        {
            var custos = _repository.ObterCustosFuturo(req);
            var requisicao = new ReqInativarCustosModel();
            if ((bool)req.DesativarParcelasFuturas)
            {
                if (req.idCota.HasValue)
                {
                    custos.ForEach(i =>
                    {
                        requisicao.id = i.id;
                        requisicao.idCota = req.idCota;
                        requisicao.tipoCusto = req.tipoCusto;
                        _repository.InativarCusto(CriarQueryInativarCusto(requisicao));
                    });
                }
                else
                {
                    custos.ForEach(i =>
                    {
                        requisicao.id = i.id;
                        requisicao.idEmbarcacao = req.idEmbarcacao;
                        requisicao.tipoCusto = req.tipoCusto;
                        _repository.InativarCusto(CriarQueryInativarCusto(requisicao));
                    });
                }                
            }              
        }
    }
}

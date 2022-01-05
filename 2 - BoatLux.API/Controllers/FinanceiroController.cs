using Amazon.S3;
using Amazon.S3.Model;
using BoatLux.Application.Interfaces;
using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Interfaces;
using BoatLux.Domain.Models.Fatura;
using BoatLux.Domain.Models.Financeiro;
using BoatLux.Infra.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BoatLux.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    /*[Authorize]*/
    public class FinanceiroController : ControllerBase
    {
        private readonly IFinanceiroUseCase _useCase;
        private readonly IAmazonS3 _amazons3;
        private readonly IOptions<MyAppSettings> _myAppSettings;

        public FinanceiroController(IFinanceiroUseCase useCase, IAmazonS3 amazons3, IOptions<MyAppSettings> myAppSettings)
        {
            _useCase = useCase;
            _amazons3 = amazons3;
            _myAppSettings = myAppSettings;
        }

        #region Custo
        [HttpGet]
        [Route("custo")]
        public List<CustoEntity> GetAllCentroCustos()
        {
            return _useCase.GetAllCustos();
        }

        [HttpPost]
        [Route("custo")]
        public ActionResult<dynamic> Insert([FromBody] CustoEntity custo)
        {
            if (ModelState.IsValid)
            {
                _useCase.Insert(custo);
                return "Ok";
            }
            return StatusCode(500, (new { message = $"Erro ao realizar inserção." }));
        }

        [HttpPut]
        [Route("custo")]
        public ActionResult<dynamic> Update([FromBody] CustoEntity custo)
        {
            if (ModelState.IsValid)
            {
                _useCase.Update(custo);
                return "Ok";
            }
            return StatusCode(500, (new { message = $"Erro ao realizar inserção." }));
        }

        [HttpDelete]
        [Route("custo")]
        public ActionResult<dynamic> Delete([FromBody] CustoEntity custo)
        {
            if (ModelState.IsValid)
            {
                _useCase.Delete(custo);
                return "Ok";
            }
            return StatusCode(500, (new { message = $"Erro ao realizar inserção." }));
        }

        //Boat-59 
        // ToDo: verificar retorno inativação de custo fixo e custo variado. tem que ser passado o id, idCota ou idEmbarcacao e o tipoCusto
        [HttpPut]
        [Route("custo/inativarCusto")]
        public void InativarCusto([FromBody] ReqInativarCustosModel req) => _useCase.InativarCusto(req);


        [HttpPost]
        [Route("custo/ObterParcelasCusto")]
        public List<ParcelasPorCustoModel> ObterParcelasPorCusto([FromBody] ReqObterParcerlasPorCustosModel req)
        {
            return _useCase.BuscarParcelasPorCusto(req);
        }
        #endregion

        #region Cadastros
        [HttpPost]
        [Route("cadastros/buscarCustos")]
        public ListPaginationEntity BuscarCustos([FromBody] ReqBuscarCustosModel reqBuscarCustosModel)
        {
            return _useCase.BuscarCustos(reqBuscarCustosModel);
        }

        [HttpPut]
        [Route("cadastros/alterarStatusCusto/{custoId}/{status}")]
        public bool UpdateStatus(int custoId, int status) => _useCase.UpdateStatus(custoId, status);

        [HttpPost]
        [Route("cadastros/addCusto")]
        public int InsertCusto([FromBody] CustoEntity custo) { return _useCase.InsertCusto(custo); }

        [HttpPost("cadastros/salvarPrestador")]
        public async Task<int> InserirPrestador([FromBody] PrestadorEntity prestador)
        {
            try
            {
                await _useCase.InserirPrestador(prestador);
                return prestador.PrestadorId;
            }
            catch
            {
                return 0;
            }
        }

        [HttpPost("cadastros/buscarPrestadores")]
        public async Task<ListPaginationEntity> BuscarPrestadores([FromBody] ReqPrestadorModel prestador)
            => await _useCase.BuscarPrestadores(prestador);

        [HttpPatch("cadastros/alterarStatusPrestador")]
        public bool AlterarStatusPrestador(int id, int status)
            => _useCase.AlterarStatusPrestador(id, status);

        [HttpPut("cadastros/alterarPrestador")]
        public async Task<PrestadorEntity> AlterarPrestador([FromBody] PrestadorEntity prestador)
            => await _useCase.AlterarPrestador(prestador);

        #endregion

        #region Embarcacao
        [HttpPost]
        [Route("embarcacao/buscarCentroCustos")]
        public ListPaginationEntity BuscarCCustos([FromBody] ReqBuscarCCustosModel reqBuscarCCustosModel)
        {
            return _useCase.BuscarCCustos(reqBuscarCCustosModel);
        }

        [HttpGet]
        [Route("embarcacao/buscarDemonstrativoCustos")]
        public ListItensEntity BuscarDemoCustos(int id, DateTime dataFaturamento)
        {
            return new ListItensEntity(_useCase.BuscarDemoCustos(id, dataFaturamento));
        }

        [HttpGet]
        [Route("embarcacao/buscarCustosFixos")]
        public ListItensEntity BuscarCustosFixos(int id) => _useCase.BuscarCustosFixos(id);

        [HttpPost]
        [Route("embarcacao/inserirCusto")]
        public int InserirCusto([FromBody] ReqInserirCustoEmbarcacaoModel reqCusto)
            => (int)_useCase.InserirCusto(reqCusto).Id;


        [HttpPost]
        [Route("embarcacao/inserirCustoComprovante")]
        public async Task<IActionResult> InserirCustoComprovante(int id, [FromForm] IFormCollection files)
        {
            try
            {
                await _useCase.InserirCustoComprovante(id, files);
                return StatusCode(201, new { status = true, message = $"Dados inseridos com sucesso." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = $"{ex}." });
            }
        }


        [HttpGet]
        [Route("embarcacao/buscarCustosFixosEmbarcacao")]
        public IActionResult BuscarCustosFixosEmbarcacao(int id, DateTime? mesFaturas)
        {
            var custos = _useCase.BuscarCustosFixosEmbarcacao(id, mesFaturas);
            return StatusCode(200, new { listaItens = custos });
        }

        [HttpGet]
        [Route("embarcacao/buscarCustosVariaveisEmbarcacao")]
        public IActionResult BuscarCustosVariaveisEmbarcacao(int id, DateTime? mesFaturas)
        {
            var custos = _useCase.BuscarCustosVariaveisEmbarcacao(id, mesFaturas);
            return StatusCode(200, new
            {
                listaItens = custos
            });
        }

        [HttpGet]
        [Route("embarcacao/buscarCustosFixosCota")]
        public IActionResult BuscarCustosFixosCota(int id, DateTime? mesFaturas)
        {
            var custos = _useCase.BuscarCustosFixosCota(id, mesFaturas);
            return StatusCode(200, new { listaItens = custos });
        }

        [HttpGet]
        [Route("embarcacao/buscarCustosVariaveisCota")]
        public IActionResult BuscarCustosVariaveisCota(int id, DateTime? mesFaturas)
        {
            var custos = _useCase.BuscarCustosVariaveisCota(id, mesFaturas);
            return StatusCode(200, new { listaItens = custos });
        }

        [HttpGet]
        [Route("embarcacao/buscarFaturasAvulsas")]
        public IActionResult BuscarFaturasAvulsas(int id, DateTime? mesFaturas)
        {
            var custos = _useCase.BuscarFaturasAvulsas(id, mesFaturas);
            return StatusCode(200, new { listaItens = custos });
        }

        [HttpPost]
        [Route("embarcacao/buscarFaturas")]
        public ListPaginationEntity BuscarFaturas([FromBody] ReqBuscarFaturasModel request)
        {
            try
            {
                return _useCase.BuscarFaturas(request);
            }
            catch (Exception ex)
            {
                return new ListPaginationEntity($"Erro ao consultar faturas: {ex.Message}", request.Paginacao);
            }
        }
        [HttpPost]
        [Route("embarcacao/atualizarTaxaAdministracao")]
        public bool AtualizarTaxaAdm([FromBody] ReqAtualizarTaxaAdm request) => _useCase.AtualizarTaxaAdm(request);

        [HttpGet]
        [Route("embarcacao/obterTaxaAdm")]
        public ResObterTaxaAdmModel ObterTaxaAdm(int embarcacaoId) => _useCase.ObterTaxaAdm(embarcacaoId);

        #endregion

        #region Fatura
        [HttpPost]
        [Route("fatura/gravarFatura")]
        public IActionResult GravarFatura(int embarcacaoId, DateTime mesReferencia)
        {
            return (IActionResult)_useCase.InserirFatura(embarcacaoId, mesReferencia);
        }


        [HttpPost]
        [Route("fatura/gravarFaturaAvulsa")]
        public ReqFaturaAvulsaModel GravarFaturaAvulsa([FromBody] ReqFaturaAvulsaModel fatura)
        {
            return _useCase.GravarFaturaAvulsa(fatura);
        }

        [HttpPost]
        [Route("fatura/exportarDadosFaturas")]
        public List<FaturasModel> ExportarDadosFaturas(ReqExportarDadosFaturaModel request) => _useCase.ExportarDadosFaturas(request);

        [HttpPost]
        [Route("fatura/gerarSegundaVia")]
        public void GerarSegundaVia([FromBody] ReqGerarSegundaViaFaturaModel request) => _useCase.GerarSegundaVia(request);

        [HttpPost]
        [Route("fatura/cancelarFatura")]
        public void CancelarFatura([FromBody] ReqCancelarFaturaModel request) => _useCase.CancelarFatura(request);
        

        [HttpGet]
        [Route("fatura/obterDadosFatura")]
        public ResObterFaturaModel ObterFatura(int id) => _useCase.ObterFatura(id);
        
        [HttpPost]
        [Route("fatura/AtualizarTaxaAdmDaFatura")]
        public List<ResObterCotaDaTaxaAdm> AtualizarTaxaAdmDaFatura([FromBody] ReqObterTaxaPorCotista request) => _useCase.ObterCotaDaTaxaDeEmbarcacao(request);
        #endregion


    }
}

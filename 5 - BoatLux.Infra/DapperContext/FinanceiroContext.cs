using Boatlux.Domain.Models.Login;
using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Entities.Login;
using BoatLux.Domain.Models.Fatura;
using BoatLux.Domain.Models.Financeiro;
using BoatLux.Domain.Utils;
using BoatLux.Infra.Options;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BoatLux.Infra.DapperContext
{
    public class FinanceiroContext
    {
        private readonly IOptions<MyAppSettings> _myAppSettings;

        public FinanceiroContext(IOptions<MyAppSettings> myAppSettings)
        {
            _myAppSettings = myAppSettings;
            System.Threading.Thread.CurrentThread.CurrentCulture = new CultureInfo("en-US");

        }
        public List<CustosModel> SelectCustos(ReqBuscarCustosModel request)
        {
            var where = new StringBuilder();

            if (request.CustoId > 0)
                where.AppendLine($" and fc.id = '{request.CustoId}' ");

            if (request.TipoCusto > 0)
                where.AppendLine($" and fct.id = '{request.TipoCusto}' ");

            if (!string.IsNullOrEmpty(request.Descricao))
                where.AppendLine($" and fc.nome like '%{request.Descricao}%' ");

            if (request.Ativos)
                where.AppendLine($" and fc.status = 1");

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custos = connection.Query<CustosModel>(
                    string.Format(
                         @"
                            select 
                                fc.id as CustoId,fc.nome as Descricao,IFNULL(fct.id,0) as Tipo
                                ,fct.nome as DescricaoTipo ,fc.status as Status
                            from 
                                _financeiro_custos fc
                                left join _financeiro_custos_tipos fct 
                                    on fct.id = fc.id_tipo_custo
                            WHERE 0=0 
                            {0}
                            order by 
                                fc.id desc
                          "
                         , where.ToString()
                         )
                ).ToList();

                return custos;
            }
        }
        public void InativarCusto(string query)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var inativar = connection.Query(query);
            }
        }

        public bool UpdateStatus(int custoId, int status)
        {
            try
            {
                using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
                {
                    var retorno = connection.Execute(
                         string.Format(
                              @"
                            update
                            _financeiro_custos
                                set status={0}
                            WHERE 0=0 
                                and id = {1}
                                and status = {2}
                            
                          "
                              , status, custoId
                         )
                     );

                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Não foi possível atualizar o status. {ex.Message}");
            }
        }
        public List<ResultadoInativarCustosVariavelModel> SelectCustosVariaveisInativado(ReqInativarCustoVariavelModel request)
        {
            
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
               
                var custoVariavel = connection.Query<ResultadoInativarCustosVariavelModel>(
               
                string.Format(
                         @$"
                            select
	                            fc.id CustoId
	                            fcv.referencia_fatura FaturaReferencia,
                                fcv.valor Valor,
                                fcv.parcelas_info ParcelaInfo,
                                fcv.observacao Observacao,
                                fcv.status StatusCotaCusto,
                                fc.status StatusFinanceiroCustos
                            from
	                            _financeiro_custos_tipos fct
	                            inner join _financeiro_custos fc on fct.id=fc.id_tipo_custo
                                inner join _financeiro_cota_custos_variaveis fcv on fcv.id_custo = fc.id
                            where 0=0
	                            and fcv.id_custo={request.CustoId}
                          "
                         )
                ).ToList();

                return custoVariavel;
            }
        }

        /// ToDo: criação do metodo para cancelar fatura Preciso verificar se é necessário cancelar as cotas_custos variaveis 
        /// para depois cancelar as parcelas faltantes das faturas 
        /// e as faturas em aberto tenho que mandar cancelar na IUGU ou atualizar o valor total sem os custos cancelados
        /// utilizando a DateTime para verificar as faturas em aberto.

        
        public void CancelarParcelasFuturas(ReqInativarCustoVariavelModel req) {

            try
            {
                var where = new StringBuilder();
                where.AppendLine($" and referencia_fatura >= '{DateTime.Now.Year}{DateTime.Now.Month.ToString().PadLeft(2, '0')}' ");
                
                    
                using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
                {
                    var retorno = connection.Execute(
                         string.Format(
                              @$"
                            update
                            _financeiro_cota_custos_variaveis
                                set status=0
                            WHERE 0=0 
                                and id_custo = {req.CustoId}
                                {where}")
                         );
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Não foi possível atualizar o status. {ex.Message}");
            }
        }


        public List<ParcelasPorCustoModel> SelectParcelasPorCusto(ReqObterParcerlasPorCustosModel req)
        {
            var whereVariavel = new StringBuilder();
            var tabela = new StringBuilder();
            if (req.idEmbarcacao.HasValue)
            {
                whereVariavel.AppendLine($" and d.id_embarcacao = '{req.idEmbarcacao}' ");
                tabela.AppendLine($"from _financeiro_embarcacao_custos_variaveis d");
                tabela.AppendLine("inner join _financeiro_embarcacao_custos_variaveis f on f.id_embarcacao = d.id_embarcacao and f.id_custo = d.id_custo and f.valor = d.valor  and f.observacao = d.observacao and f.id <>d.id");
            }
            if (req.idCota.HasValue)
            {
                whereVariavel.AppendLine($" and d.id_cota = '{req.idCota}' ");
                tabela.AppendLine("from _financeiro_cota_custos_variaveis d");
                tabela.AppendLine("inner join _financeiro_cota_custos_variaveis f on f.id_cota = d.id_cota and f.id_custo = d.id_custo and f.valor = d.valor  and f.observacao = d.observacao");
            }   
            string query = $@"
                            select 
                            concat(DATE_FORMAT((SELECT NOW()  ), '%d'),'/', right(d.referencia_fatura,2),'/',left(d.referencia_fatura,4)) AS DataVencimento,                             
                            d.parcelas_info AS NumeroParcela,
                            d.valor AS ValorParcela 
                             {tabela}
                            where f.id = {req.idCusto}
                            and d.referencia_fatura >= (SELECT EXTRACT( YEAR_MONTH FROM NOW()))
                            {whereVariavel}
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var fatura = connection.Query<ParcelasPorCustoModel>(query).ToList();
                var lista = new List<ParcelasPorCustoModel>();
                fatura.ForEach(i => lista.Add(i));
                return fatura;
            }
        }

        public List<CCustosModel> SelectCCustos(ReqBuscarCCustosModel request)
        {
            var whereCota = request.Custo > 0 ? $" and id = {request.Cota} " : string.Empty;

            var whereFixo = new StringBuilder();
            if (!string.IsNullOrEmpty(request.Embarcacao))
                whereFixo.AppendLine($" and e.nome like '{request.Embarcacao}' ");
            if (request.Custo > 0)
                whereFixo.AppendLine($" and ce.valor = {request.Custo} ");
            if (!string.IsNullOrEmpty(request.DataFaturamento.ToString()))
                whereFixo.AppendLine($" and f.referencia = '{request.DataFaturamento.Year}{request.DataFaturamento.Month.ToString().PadLeft(2, '0')}' ");
            // ToDo : Incluir filtro por franquia na busca de custos fixos
            if (!string.IsNullOrEmpty(request.Franquia))
                whereFixo.AppendLine($"");

            whereFixo.AppendLine(" and ce.status = 1 ");



            var whereVariavel = new StringBuilder();
            if (!string.IsNullOrEmpty(request.Embarcacao))
                whereVariavel.AppendLine($" and emb.nome like '{request.Embarcacao}' ");
            if (request.Custo > 0)
                whereVariavel.AppendLine($" and fecv.valor = {request.Custo} ");
            if (!string.IsNullOrEmpty(request.DataFaturamento.ToString()))
                whereVariavel.AppendLine($" and fecv.referencia_fatura = '{request.DataFaturamento.Year}{request.DataFaturamento.Month.ToString().PadLeft(2, '0')}' ");
            // ToDo : Incluir filtro por franquia na busca de custos variáveis
            if (!string.IsNullOrEmpty(request.Embarcacao))
                whereVariavel.AppendLine($" and e.nome like '{request.Embarcacao}' ");

            whereVariavel.AppendLine(" and fecv.status = 1 ");

            string queryFixo = @$"
                SELECT
                    e.id EmbarcacaoId,
                    e.nome Embarcacao,
                    e.id_franqueado FranquiaId,
                    '' franqueado,
                    (SELECT COUNT(id) FROM _cotas c WHERE c.id_embarcacao = e.id AND c.id_usuario IS NOT NULL {whereCota}) as CotasUsadas,
                    (SELECT COUNT(id) FROM _cotas c WHERE c.id_embarcacao = e.id AND c.cota_extra = 0 {whereCota}) as TotalCotas,
                    SUM(IFNULL(ce.valor,0)) as Custo            
                FROM _embarcacoes e
                    LEFT JOIN _embarcacoes_tipos t ON t.id = e.id_tipo
                    LEFT JOIN _financeiro_embarcacao_custos_fixos ce ON ce.id_embarcacao = e.id
                    LEFT JOIN _faturas_itens fi ON fi.id_custo = ce.id /*AND fi.tipo_custo = 'CFE'*/
                    LEFT JOIN _faturas f ON f.id = fi.id_fatura
                WHERE 0=0                    
                    {whereFixo}
                GROUP BY
                    e.id,
                    e.nome;
            ";

            string queryVariavel = @$"
                select
                    fecv.id_embarcacao EmbarcacaoId, emb.nome Embarcacao
                    , emb.id_franqueado FranquiaId, '' Franqueado
	                , (SELECT COUNT(id) FROM _cotas c WHERE c.id_embarcacao = emb.id AND c.id_usuario IS NOT NULL {whereCota}) as CotasUsadas
	                , (SELECT COUNT(id) FROM _cotas c WHERE c.id_embarcacao = emb.id AND c.cota_extra = 0 {whereCota}) as TotalCotas
	                , SUM(IFNULL(fecv.valor, 0)) as Custo
                from
                    _financeiro_embarcacao_custos_variaveis fecv
                    inner join _embarcacoes emb on emb.id = fecv.id_embarcacao
                where 0 = 0                    
                    {whereVariavel}
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custosFixos = connection.Query<CCustosModel>(queryFixo).ToList();
                var custosVariaveis = connection.Query<CCustosModel>(queryVariavel).ToList();

                var custos = new List<CCustosModel>();
                custosFixos.ForEach(x => custos.Add(x));
                custosVariaveis.ForEach(x => custos.Add(x));
                return custos;
            }
        }

        public async Task<List<PrestadorEntity>> BuscarPrestadores(ReqPrestadorModel request)
        {
            var where = new StringBuilder();

            if (request.PrestadorId > 0)
                where.AppendLine($" and id = '{request.PrestadorId}' ");

            if (request.Ativos)
                where.AppendLine(" and status = '1' ");

            if (!string.IsNullOrEmpty(request.CnpjCpf))
                where.AppendLine($" and nr_doc = '{StringUtil.DealSql(request.CnpjCpf)}' ");

            if (!string.IsNullOrEmpty(request.RazaoFantasia))
                where.AppendLine($" and (razao like '%{StringUtil.DealSql(request.RazaoFantasia)}%' or fantasia like '%{StringUtil.DealSql(request.RazaoFantasia)}%') ");


            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var prestadores = await connection.QueryAsync<PrestadorEntity>(
                    string.Format(
                         @"
                            select
                              id PrestadorId, razao Razao, fantasia Fantasia
                              , tipo TipoDocumento, nr_doc CpfCnpj, ie Ie
                              ,logradouro Logradouro,cep Cep, numero Numero, bairro Bairro
                              , cidade Cidade, uf Uf, complemento Complemento,contato Contato
                              ,telefone Telefone, celular Celular, email Email, banco Banco
                              ,agencia Agencia,conta Conta, pix Pix,pix_tipo TipoPix,status Status
                            from
                              prestadores
                            where 0=0
	                            {0}
                            order by id desc
                          "
                         , where.ToString()
                         )
                );

                return (List<PrestadorEntity>)prestadores;
            }
        }

        public List<ReqBuscarCustosFixosModel> BuscarCustosFixos(int id)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custosFixos = connection.Query<ReqBuscarCustosFixosModel>(
                    string.Format(
                         @$"
                            select
	                            fcf.id CustoId
	                            ,fc.nome DescricaoCusto
	                            ,fcf.valor ValorCusto
	                            ,1 MesCobranca
	                            ,'NaoImplementado' Observacao
                            from
	                            _financeiro_cota_custos_fixos fcf
	                            inner join _financeiro_custos fc on fc.id = fcf.id_custo
                            where 0=0
	                            and fcf.id_cota={id}
                                and fc.status=1
                          "
                         )
                ).ToList();

                return custosFixos;
            }
        }

        public bool AlterarStatusPrestador(int id, int status)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var response = connection.Execute(
                    string.Format(
                         @"
                                update prestadores
                                set status = {0}
                                where id={1}
                             "
                         , status, id
                         )
                );
                return response > 0;
            }
        }

        public bool InsertComprovanteCusto(int idCapa, string guidName)
        {
            try
            {
                using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
                {
                    var retorno = connection.Execute(
                         string.Format(
                              @$"
                                insert into financeiro_custos_comprovantes
                                    (id_capa, file_name)
                                values
                                    ({idCapa},'{guidName}')
                                "
                         )
                     );

                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Não foi possível atualizar o status. {ex.Message}");
            }

        }

        #region Demonstrativo de Custos
        public List<DemonstrativoCustosModel> BuscarDemoCustos(int id, DateTime dataFaturamento)
        {
            var where = new StringBuilder();
            where.AppendLine($" and c.id_embarcacao={id} ");

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var demoCustos = connection.Query<DemonstrativoCustosModel>(
                            string.Format(@$"
                            SELECT 
	                            c.id CotaId, c.id_embarcacao EmbarcacaoId, c.id_usuario, c.nome NomeCota, c.cota_extra,
	                            u.nome,
	                            (SELECT EXTRACT( YEAR_MONTH FROM NOW() + INTERVAL 1 MONTH ))
                            FROM _cotas c
	                            LEFT JOIN usuarios_dados u ON (u.id_usuario = c.id_usuario)
                            WHERE 0=0
	                           {where}
                            ORDER BY c.id;
                          ")).ToList();

                for (int i = 0; i < demoCustos.Count; i++)
                {
                    demoCustos[i].Custos ??= new List<DemonstrativoCustosModel.DemonstrativoCusto>();

                    var cotaFixa = BuscarCotaFixa(demoCustos[i].CotaId);
                    foreach (var cota in cotaFixa)
                        demoCustos[i].Custos.Add(cota);

                    var cotaVariavel = BuscarCotaVariavel(demoCustos[i].CotaId);
                    foreach (var cota in cotaVariavel)
                        demoCustos[i].Custos.Add(cota);


                    var embarcacaoFixa = BuscarEmbarcacaoFixa(demoCustos[i].EmbarcacaoId);
                    foreach (var cota in cotaFixa)
                        demoCustos[i].Custos.Add(cota);

                    var embarcacaoVariavel = BuscarEmbarcacaoVariavel(demoCustos[i].EmbarcacaoId);
                    foreach (var cota in cotaVariavel)
                        demoCustos[i].Custos.Add(cota);
                }

                foreach (var demoCusto in demoCustos)
                {
                    demoCusto.TotalCusto ??= 0;
                    foreach (var custo in demoCusto.Custos)
                        demoCusto.TotalCusto += custo.Custo;
                }

                return demoCustos;
            }
        }
        private List<DemonstrativoCustosModel.DemonstrativoCusto> BuscarCotaFixa(int idCota)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custosEmbarcacao = connection.Query<DemonstrativoCustosModel.DemonstrativoCusto>(
                                  string.Format(
                                       @"
                                SELECT
                                    c.id CustoId,
	                                CONCAT(c.id_tipo_custo, c.codigo, ' - ', c.nome) as DescricaoCusto,
	                                cf.valor Custo
                                FROM _financeiro_cota_custos_fixos cf
	                                LEFT JOIN _financeiro_custos c ON (c.id = cf.id_custo)
                                WHERE cf.id_cota = {0}
	                                AND cf.status = 1;
                                "
                                       , idCota
                                       )
                              ).ToList();

                return custosEmbarcacao;
            }
        }

        private List<DemonstrativoCustosModel.DemonstrativoCusto> BuscarCotaVariavel(int idCota)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custosEmbarcacao = connection.Query<DemonstrativoCustosModel.DemonstrativoCusto>(
                                  string.Format(
                                       @"
                                SELECT 
	                                c.id CustoId,
	                                CONCAT(c.id_tipo_custo, c.codigo, ' - ', c.nome,
		                                IF(cv.observacao IS NULL, '', CONCAT(' (', cv.observacao, ') ') ),
		                                ', parcela ', cv.parcelas_info   
	                                ) as DescricaoCusto,
	                                cv.referencia_fatura,
	                                ROUND(IF(c.id_tipo_custo != 5, cv.valor, cv.valor * (-1)), 2) AS Custo
                                FROM _financeiro_cota_custos_variaveis cv
	                                LEFT JOIN _financeiro_custos c ON (c.id = cv.id_custo)
                                WHERE cv.id_cota = {0}
	                                # --> retorna [ano][mes] = 202106
	                                #AND cv.referencia_fatura = (SELECT EXTRACT( YEAR_MONTH FROM NOW() + INTERVAL 1 MONTH ))
	                                AND cv.status = 1;
                                        "
                                       , idCota
                                       )
                              ).ToList();

                return custosEmbarcacao;
            }
        }

        private List<DemonstrativoCustosModel.DemonstrativoCusto> BuscarEmbarcacaoFixa(int idEmbarcacao)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custosEmbarcacao = connection.Query<DemonstrativoCustosModel.DemonstrativoCusto>(
                                  string.Format(
                                       @"
                                        SELECT 
	                                        c.id CustoId,
	                                        CONCAT(c.id_tipo_custo, c.codigo, ' - ', c.nome) as DescricaoCusto,
	                                        ROUND(cf.valor * (IFNULL(r.percentual_rateio, 10) / 100), 2) as Custo
                                        FROM _financeiro_embarcacao_custos_fixos cf
	                                        LEFT JOIN _financeiro_custos c ON (c.id = cf.id_custo)
	                                        LEFT JOIN _embarcacoes_financeiro r ON (r.id_embarcacao = cf.id_embarcacao)
                                        WHERE cf.id_embarcacao = {0}
	                                        AND cf.status = 1;
                                "
                                       , idEmbarcacao
                                       )
                              ).ToList();

                return custosEmbarcacao;
            }
        }

        private List<DemonstrativoCustosModel.DemonstrativoCusto> BuscarEmbarcacaoVariavel(int idEmbarcacao)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custosEmbarcacao = connection.Query<DemonstrativoCustosModel.DemonstrativoCusto>(
                                  string.Format(
                                       @"
                                        SELECT 
	                                        c.id CustoId,
	                                        CONCAT(
		                                        c.id_tipo_custo, c.codigo, ' - ', c.nome, 
		                                        IF(cv.observacao IS NULL, '', CONCAT(' (', cv.observacao, ') ') ), 
                                                ', parcela ', cv.parcelas_info    
	                                        ) as DescricaoCusto,
	                                        cv.referencia_fatura,
	                                        ROUND(
		                                        IF(c.id_tipo_custo != 5, cv.valor, cv.valor * (-1)) * (IFNULL(r.percentual_rateio, 10) / 100), 2
	                                        ) AS Custo
                                        FROM _financeiro_embarcacao_custos_variaveis cv
	                                        LEFT JOIN _financeiro_custos c ON (c.id = cv.id_custo)
	                                        LEFT JOIN _embarcacoes_financeiro r ON (r.id_embarcacao = cv.id_embarcacao)
                                        WHERE cv.id_embarcacao = {0}
	                                        #AND cv.referencia_fatura = (SELECT EXTRACT( YEAR_MONTH FROM NOW() + INTERVAL 1 MONTH ))
	                                        AND cv.status = 1;
                                        "
                                       , idEmbarcacao
                                       )
                              ).ToList();

                return custosEmbarcacao;
            }
        }
        #endregion

        public List<CustoFixoEmbarcacaoModel> BuscarCustosFixosEmbarcacao(int id, DateTime? mesFaturas)
        {
            string mesFatura = string.Empty;

            var where = new StringBuilder();
            if (id > 0)
                where.AppendLine($" AND e.id = '{id}'");
            if (mesFaturas != null)
            {
                mesFatura = $"{mesFaturas.Value.Year}{mesFaturas.Value.Month.ToString().PadLeft(2, '0')}";
                where.AppendLine($" AND f.referencia = '{mesFatura}'");
            }

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custos = connection.Query<CustoFixoEmbarcacaoModel>(
                    @$"
                    SELECT
                        fecf.id Id, 
                        fecf.id_custo CustoId, 
                        fc.nome DescricaoCusto
                        ,   fecf.valor Valor, fecf.observacao Observacao
                    FROM
                        _embarcacoes e
                        INNER JOIN _financeiro_embarcacao_custos_fixos fecf ON fecf.id_embarcacao=e.id
                        INNER JOIN _faturas_itens fi ON fi.id_custo = fecf.id
                        INNER JOIN _faturas f ON f.id = fi.id_fatura
                        INNER JOIN _financeiro_custos fc on fc.id=fecf.id_custo
                    WHERE 0=0
                        AND fi.tipo_custo='CFE'
                        AND fecf.status = 1
                        {where}
                    GROUP BY 
                        fecf.id, fecf.id_custo, fc.nome 
                        ,fecf.valor, fecf.observacao
                    ").ToList();

                return custos;
            }
        }
        public List<CustoVariavelEmbarcacaoModel> BuscarCustosVariaveisEmbarcacao(int id, DateTime? mesFaturas)
        {
            string mesFatura = string.Empty;

            var where = new StringBuilder();
            if (id > 0)
                where.AppendLine($" AND e.id = '{id}'");
            if (mesFaturas != null)
            {
                mesFatura = $"{mesFaturas.Value.Year}{mesFaturas.Value.Month.ToString().PadLeft(2, '0')}";
                where.AppendLine($" AND fecv.referencia_fatura = '{mesFatura}'");
            }
            where.AppendLine(" AND fecv.status = 1 ");

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custos = connection.Query<CustoVariavelEmbarcacaoModel>(
               @$"
                SELECT
                    fecv.id Id, fecv.id_custo CustoId, fc.nome DescricaoCusto
                    , fecv.referencia_fatura ReferenciaFatura, fecv.parcelas_info Parcelas
                    , fecv.valor Valor, fecv.observacao Observacao
                FROM
                    _embarcacoes e
                    INNER JOIN _financeiro_embarcacao_custos_variaveis fecv ON fecv.id_embarcacao=e.id
                    INNER JOIN _financeiro_custos fc on fc.id=fecv.id_custo
                WHERE 0=0
                    {where}
                    ").ToList();

                return custos;
            }
        }
        public List<CustoFixoCotaModel> BuscarCustosFixosCota(int id, DateTime? mesFaturas)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var cotas = connection.Query<CustoFixoCotaModel>(
                    @$"
                    SELECT
                        c.id CotaId, 
                        c.nome NomeCota
                    FROM
                        _cotas c
                    WHERE 0=0
                        and c.id_embarcacao={id}"
                    ).ToList();

                foreach (CustoFixoCotaModel cota in cotas)
                {
                    string mesFatura = string.Empty;
                    var where = new StringBuilder();
                    if (id > 0)
                        where.AppendLine($" AND fccf.id_cota = '{cota.CotaId}'");

                    if (mesFaturas != null)
                    {
                        mesFatura = $"{mesFaturas.Value.Year}{mesFaturas.Value.Month.ToString().PadLeft(2, '0')}";
                        where.AppendLine($" AND f.referencia = '{mesFatura}'");
                    }

                    var custos = connection.Query<CustoFixoCotaModel.Custo>(
                    @$"
                        SELECT
                            fccf.id Id, 
                            fccf.id_custo CustoId,
                            fc.nome DescricaoCusto,
                            fccf.valor Valor
                        FROM
                            _cotas c
                            inner join _financeiro_cota_custos_fixos fccf on c.id = fccf.id
                            inner join _financeiro_custos fc on fc.id = fccf.id_custo
                            inner join _faturas_itens fi on fi.id_custo=fccf.id
                            inner join _faturas f on f.id = fi.id_fatura
                        WHERE 0=0
                        {where}
                    ").ToList();

                    double total = 0;
                    custos.ForEach(x => total += x.Valor);

                    cota.Total = total;
                    cota.Custos = custos;
                }
                return cotas;
            }
        }
        public List<CustoVariavelCotaModel> BuscarCustosVariaveisCota(int id, DateTime? mesFaturas)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var cotas = connection.Query<CustoVariavelCotaModel>(
                    @$"
                    SELECT
                        c.id CotaId, 
                        c.nome NomeCota
                    FROM
                        _cotas c
                    WHERE 0=0
                        and c.id_embarcacao={id}"
                    ).ToList();

                foreach (CustoVariavelCotaModel cota in cotas)
                {
                    string mesFatura = string.Empty;
                    var where = new StringBuilder();
                    if (id > 0)
                        where.AppendLine($" AND fccv.id_cota = '{cota.CotaId}'");

                    if (mesFaturas != null)
                    {
                        mesFatura = $"{mesFaturas.Value.Year}{mesFaturas.Value.Month.ToString().PadLeft(2, '0')}";
                        where.AppendLine($" AND fccv.referencia_fatura = '{mesFatura}'");
                    }

                    var custos = connection.Query<CustoVariavelCotaModel.Custo>(
                    @$"
                    SELECT
                        fccv.id Id, 
                        fccv.id_custo CustoId,
                        fc.nome DescricaoCusto,
                        fccv.referencia_fatura ReferenciaFatura,
                        fccv.parcelas_info Parcelas,
                        fccv.valor Valor
                    FROM
                        _cotas c
                        inner join _financeiro_cota_custos_variaveis fccv on fccv.id_cota=c.id
                        inner join _financeiro_custos fc on fc.id = fccv.id_custo
                    WHERE 0=0
                        {where}
                    ").ToList();

                    double total = 0;
                    custos.ForEach(x => total += x.Valor);

                    cota.Total = total;
                    cota.Custos = custos;
                }
                return cotas;
            }
        }

        public List<FaturaAvulsaModel> BuscarFaturasAvulsas(int id, DateTime? mesFaturas)
        {
            var where = new StringBuilder();

            if (mesFaturas != null)
            {
                string mesFatura = $"{mesFaturas.Value.Year}{mesFaturas.Value.Month.ToString().PadLeft(2, '0')}";
                where.AppendLine($" AND f.referencia = '{mesFatura}'");
            }
            if (id > 0)
                where.AppendLine($" AND c.id_embarcacao = '{id}'");

            string query = @$"
                select 
                    f.id FaturaId, c.id CotaId, c.nome NomeCota
                    , (select sum(valor) from _faturas_itens where id_fatura=f.id) ValorFatura
                from 
                    _faturas f
                    inner join _faturas_itens fi on fi.id_fatura=f.id and fi.tipo_custo='CVC'
                    inner join _financeiro_cota_custos_variaveis fccv on fi.id_custo=fccv.id
                    inner join _cotas c on c.id=fccv.id_cota
                where 0=0
                    {where}
                order by f.id desc
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var faturas = connection.Query<FaturaAvulsaModel>(query).ToList();
                return faturas;
            }
        }

        public List<FaturasModel> BuscarFaturas(ReqBuscarFaturasModel request)
        {
            var where = new StringBuilder();

            request.Referencia ??= new DateTime(2021, 07, 01);

            if (request.Referencia != null)
            {
                string mesFatura = $"{request.Referencia.Value.Year}{request.Referencia.Value.Month.ToString().PadLeft(2, '0')}";
                where.AppendLine($"  AND f.referencia='{mesFatura}'");
            }

            string query = @$"
                select 
                    e.id EmbarcacoaId,
                    /*ud.nome Franquia,*/
                    e.nome NomeEmbarcacao,
                    f.id FaturaId,
                    f.id_cota CotaId,
                    c.nome NomeCota,
                    f.referencia MesReferencia,
                    f.vencimento DataVencimento,
                    sum(fi.valor) ValorFatura,
                    fst.nome Status
                from _faturas f
                    inner join _faturas_itens fi on fi.id_fatura = f.id
                    inner join _faturas_status fs on fs.id_fatura = f.id
                    inner join _faturas_status_tipo fst on fst.id = fs.id_status
                    inner join _cotas c on c.id = f.id_cota
                    inner join _embarcacoes e on e.id = c.id_embarcacao
                    /*inner join usuarios u on e.id_franqueado=u.id_franqueado
                    inner join usuarios_dados ud on u.id=ud.id_usuario*/
                where 0 = 0
                    {where}
                GROUP BY 
                    f.id,
                    e.id,
                    /*ud.nome,*/
                    e.nome,
                    f.id_cota,
                    c.nome,
                    f.referencia,
                    f.vencimento,
                    fst.nome
                ORDER BY f.id desc
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var faturas = connection.Query<FaturasModel>(query).ToList();
                return faturas;
            }
        }

        public List<FaturasModel> ExportarDadosFaturas(ReqExportarDadosFaturaModel request)
        {
            var where = new StringBuilder();

            //TODO: Implementar filtros
            /*
                public int? TipoPeriodo
                public dynamic Periodo 
                public string MesCompetencia
                public int? FranquiaId 
            */

            request.Periodo ??= new DateTime(2021, 02, 01);

            if (request.Periodo != null)
            {
                string mesFatura = $"{request.Periodo.Value.Year}{request.Periodo.Value.Month.ToString().PadLeft(2, '0')}";
                where.AppendLine($"  AND f.referencia='{mesFatura}'");
            }

            if (request.EmbarcacaoId > 0)
                where.AppendLine($" and e.id={request.EmbarcacaoId}");
            if (request.CotaId != null)
                where.AppendLine($" and f.id_cota={request.CotaId}");
            if (request.StatusFatura != null)
                where.AppendLine($" and fs.status={request.StatusFatura}");

            string query = @$"
                select 
                    e.id EmbarcacoaId,
                    /*ud.nome Franquia,*/
                    e.nome NomeEmbarcacao,
                    f.id FaturaId,
                    f.id_cota CotaId,
                    c.nome NomeCota,
                    f.referencia MesReferencia,
                    f.vencimento DataVencimento,
                    sum(fi.valor) ValorFatura,
                    fst.nome Status
                from _faturas f
                    inner join _faturas_itens fi on fi.id_fatura = f.id
                    inner join _faturas_status fs on fs.id_fatura = f.id
                    inner join _faturas_status_tipo fst on fst.id = fs.id_status
                    inner join _cotas c on c.id = f.id_cota
                    inner join _embarcacoes e on e.id = c.id_embarcacao
                    /*inner join usuarios u on e.id_franqueado=u.id_franqueado
                    inner join usuarios_dados ud on u.id=ud.id_usuario*/
                where 0 = 0
                    {where}
                GROUP BY 
                    f.id,
                    e.id,
                    /*ud.nome,*/
                    e.nome,
                    f.id_cota,
                    c.nome,
                    f.referencia,
                    f.vencimento,
                    fst.nome 
                LIMIT 100
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var faturas = connection.Query<FaturasModel>(query).ToList();
                return faturas;
            }
        }

        public void CancelarFatura(ReqCancelarFaturaModel request)
        {
            try
            {
                var ids = string.Join(",", request.FaturaIds);
                string query = @$" update _faturas_status set id_status=2, observacao='{request.Observacao}' where id_fatura in ({ids}); ";

                using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
                {
                    connection.Query(query);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
        }

        public List<string> ObterIdsIugu(int[] faturaIds)
        {
            var ids = string.Join(",", faturaIds);
            string query = @$"select id_iugu from _faturas_status where id_fatura in ({ids})";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var idsIugu = connection.Query<string>(query).ToList();
                return idsIugu;
            }

        }

        public ResObterFaturaModel ObterFaturaPeloId(int faturaId)
        {
            string query = $@"
                SET @idCota := (SELECT c.id from _cotas c inner join _faturas f on f.id_cota=c.id and f.id={faturaId} where 0=0 limit 1);

                SELECT
	                ud.nome Cotista,
                    ue.email EmailCotista,
                    c.id Cota,
                    CONCAT(e.id,e.nome) Embarcacao,
                    SUM(fi.valor) Valor,
                    f.referencia Referencia,
                    fst.nome Status
                FROM
	                _faturas f
	                inner join _cotas c on c.id=@idCota
                    inner join usuarios us on us.id=c.id_usuario
                    inner join usuarios_dados ud on us.id=ud.id_usuario
                    inner join usuarios_emails ue on ue.id_usuario=us.id
                    inner join _embarcacoes e on e.id=c.id_embarcacao
                    inner join _faturas_itens fi on fi.id_fatura=f.id
                    inner join _faturas_status fs on fs.id_fatura = f.id
                    inner join _faturas_status_tipo fst on fst.id = fs.id_status
                where f.id={faturaId}
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var fatura = connection.Query<ResObterFaturaModel>(query).First();

                return fatura;
            }
        }

        public List<ResObterFaturaModel.ItensFaturaModel> ObterFaturaItensPeloId(int faturaId)
        {
            string query = $@"
                SELECT
                    id ItemId,
                    tipo_custo Descricao,
                    valor ValorItem,
                    id_custo CustoId,
                    tipo_custo TipoCusto
                FROM
                    _faturas_itens 
                where id_fatura={faturaId}
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var faturaItens = connection.Query<ResObterFaturaModel.ItensFaturaModel>(query).ToList();

                return faturaItens;
            }
        }

        public FaturaEntity GetFaturaById(int faturaId)
        {
            string query = $@"
                select
                    id Id, 
                    referencia Referencia,
                    vencimento Vencimento,
                    id_cota CotaId,
                    id_usuario UsuarioId, 
                    avulsa Avulsa, 
                    avulsa_gerada AvulsaGerada, 
                    multa2via MultaSegundaVia, 
                    juros2via JurosSegundaVia, 
                    diasatraso DiasAtraso, 
                    btlx Btlx
                from _faturas 
                where id={faturaId}
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var fatura = connection.Query<FaturaEntity>(query).First();

                return fatura;
            }
        }

        public EmbarcacaoFinanceiroEntity ObterTaxaAdm(int embarcacaoId)
        {
            string query = $@"
                select
                    id Id, 
                    id_embarcacao EmbarcacaoId,
                    percentual_rateio PercentualRateio,
                    vencimento Vencimento,
                    max_reservas MaxReservas,
                    max_suplencias MaxSuplencias,
                    max_contigencias MaxContingencias,
                    max_premium MaxPremium,
                    padrao_rateio PadraoRateio,
                    taxa_adm_minima TaxaAdmMinima,
                    taxa_adm TaxaAdm
                from _embarcacoes_financeiro
                where id_embarcacao={embarcacaoId}
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var embarcacao = connection.Query<EmbarcacaoFinanceiroEntity>(query).First();
                return embarcacao;
            }
        }

        public bool AtualizarTaxaAdmPadrao(ReqAtualizarTaxaAdm request)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var query = $"update _embarcacoes_financeiro set taxa_adm ={request.Valor} where id_embarcacao={request.EmbarcacaoId}";
                try
                {
                    connection.Execute(query);
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public bool AtualizarTaxaAdmMinima(ReqAtualizarTaxaAdm request)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                try
                {
                    connection.Execute($"update _embarcacoes_financeiro set taxa_adm_minima ='{request.Valor}' where id_embarcacao={request.EmbarcacaoId}");
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public List<ResObterCotaDaTaxaAdm> ObterCotaDaTaxaDeEmbarcacao(ReqObterTaxaPorCotista request)
        {
            var whereCota = request.Custo > 0 ? $" and id = {request.Cota} " : string.Empty;

            var whereFixo = new StringBuilder();
            if (!string.IsNullOrEmpty(request.Embarcacao))
                whereFixo.AppendLine($" and e.nome like '{request.Embarcacao}' ");
            if (!string.IsNullOrEmpty(request.DataFaturamento.ToString()))
                whereFixo.AppendLine($" and f.referencia = '{request.DataFaturamento.Year}{request.DataFaturamento.Month.ToString().PadLeft(2, '0')}' ");
            // ToDo : Incluir filtro por franquia na busca de custos fixos
            if (!string.IsNullOrEmpty(request.Franquia))
                whereFixo.AppendLine($"");

            string query = @$"
                SELECT
                    f.id FaturaId,
                    e.id EmbarcacaoId,
                    e.nome Embarcacao,
                     e.id_franqueado FranquiaId,
                    ef.taxa_adm ValorTaxa,
                    (SELECT COUNT(id) FROM _cotas c WHERE c.id_embarcacao = e.id AND c.id_usuario IS NOT NULL {whereCota}) as CotasUsadas,
                    (SELECT COUNT(id) FROM _cotas c WHERE c.id_embarcacao = e.id AND c.cota_extra = 0 {whereCota}) as TotalCotas
                FROM _embarcacoes e
                    INNER JOIN _embarcacoes_financeiro ef on ef.id_embarcacao=e.id
                    LEFT JOIN _embarcacoes_tipos t ON t.id = e.id_tipo
                    LEFT JOIN _financeiro_embarcacao_custos_fixos ce ON ce.id_embarcacao = e.id
                    LEFT JOIN _faturas_itens fi ON fi.id_custo = ce.id /*AND fi.tipo_custo = 'CFE'*/
                    LEFT JOIN _faturas f ON f.id = fi.id_fatura
                WHERE 0=0
                    {whereFixo}
                GROUP BY
                    e.id,
                    e.nome;
            ";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                
                var Cotas = connection.Query<ResObterCotaDaTaxaAdm>(query).ToList();
                
                var cotasPorFatura = new List<ResObterCotaDaTaxaAdm>();
                Cotas.ForEach(x => cotasPorFatura.Add(x));
                
                return cotasPorFatura;                
            }
        }

        public List<CustoParceladoModel> ObterCustosFuturo(ReqInativarCustosModel req)
        {
            var tabela = new StringBuilder();
            if (req.idCota.HasValue)
            {
                tabela.AppendLine("from _financeiro_cota_custos_variaveis d");
                tabela.AppendLine("inner join _financeiro_cota_custos_variaveis f on f.id_cota = d.id_cota and f.id_custo = d.id_custo and f.valor = d.valor  and f.observacao = d.observacao");
            }
            if (req.idEmbarcacao.HasValue)
            {
                tabela.AppendLine("from _financeiro_embarcacao_custos_variaveis d ");
                tabela.AppendLine("inner join _financeiro_embarcacao_custos_variaveis f on f.id_embarcacao = d.id_embarcacao and f.id_custo = d.id_custo and f.valor = d.valor  and f.observacao = d.observacao and f.id <>d.id");
            }
            string query = @$"                   
                            select 
                            d.id
                            ,d.id_custo idCusto
                            ,d.dif
                            ,d.referencia_fatura referenciaFatura
                            ,d.valor
                            ,d.parcelas_info parcelaInfo
                            ,left(d.parcelas_info, LOCATE('/',d.parcelas_info)-1) parcela
                            ,right(d.parcelas_info, length(d.parcelas_info)-LOCATE('/',d.parcelas_info)) QuantidadeParcela
                            ,d.status
                            {tabela}
                            where d.referencia_fatura >= (SELECT EXTRACT( YEAR_MONTH FROM NOW()))  
                            and f.id = {req.id}
                            ";
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {

                var custos = connection.Query<CustoParceladoModel>(query).ToList();

                var custosPorFatura = new List<CustoParceladoModel>();
                custos.ForEach(x => custosPorFatura.Add(x));

                return custosPorFatura;
            }
        }

        public bool AtualizarTaxaAdmFatura(ResObterCotaDaTaxaAdm res)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                try
                {
                    connection.Execute($"update _faturas set taxa_adm ='{res.TaxaPorCotista}' where id={res.FaturaId}");
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }
    }
}

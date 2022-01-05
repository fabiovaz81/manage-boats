using Boatlux.Domain.Models.Login;
using BoatLux.Domain.Entities.Login;
using BoatLux.Domain.Models.BuscaRapida;
using BoatLux.Domain.Models.Financeiro;
using BoatLux.Domain.Utils;
using BoatLux.Infra.Options;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BoatLux.Infra.DapperContext
{
    public class BuscaRapidaContext
    {
        private readonly IOptions<MyAppSettings> _myAppSettings;

        public BuscaRapidaContext(IOptions<MyAppSettings> myAppSettings)
        {
            _myAppSettings = myAppSettings;
        }
        public BuscaRapidaItemModel SelectCustos(BuscaRapidaModel buscaRapidaModel)
        {
            string where = string.IsNullOrEmpty(buscaRapidaModel.Valor) ? string.Empty : $" and nome like '%{buscaRapidaModel.Valor}%'";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custos = connection.Query<BuscaRapidaItemModel.Itens>(
                    string.Format(
                         @"
                            select 
                                id as Id, nome as Titulo
                            from 
                                _financeiro_custos                              
                            WHERE 0=0 
                            {0}
                            order by 
                                id desc
                          "
                         , where
                         )
                ).ToList();

                var listaCustos = new BuscaRapidaItemModel();
                listaCustos.itens = custos;

                return listaCustos;
            }
        }

        public BuscaRapidaItemModel SelectCotas(BuscaRapidaModel buscaRapidaModel)
        {
            string where = string.IsNullOrEmpty(buscaRapidaModel.Valor) ? string.Empty : $" and id_embarcacao = '{buscaRapidaModel.Valor}'";

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var custos = connection.Query<BuscaRapidaItemModel.Itens>(
                    string.Format(
                         @"
                            select 
                                id Id, nome Titulo
                            from 
	                            _cotas
                            where 0=0
	                            {0}
                            order by id
                          "
                         , where.ToString()
                         )
                ).ToList();
                //custos.Insert(0, new BuscaRapidaItemModel.Itens { Id = "0", Titulo = "Todos" });
                var listaCotas = new BuscaRapidaItemModel();
                listaCotas.itens = custos;

                return listaCotas;
            }
        }

        public BuscaRapidaItemModel SelectPrestadores(BuscaRapidaModel buscaRapidaModel)
        {
            var where = new StringBuilder();

            if (!string.IsNullOrEmpty(buscaRapidaModel.Valor))
            {
                _ = buscaRapidaModel.BuscaExata
                    ? where.AppendLine($" and id='{StringUtil.DealSql(buscaRapidaModel.Valor)}'")
                    : where.AppendLine($" and (razao like '%{StringUtil.DealSql(buscaRapidaModel.Valor)}%' or fantasia like '%{StringUtil.DealSql(buscaRapidaModel.Valor)}%' or nr_doc = '{StringUtil.DealSql(buscaRapidaModel.Valor)}')");
            }

            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var prestadores = connection.Query<BuscaRapidaItemModel.Itens>(
                    string.Format(
                         @"
                            select 
                                id Id, razao Titulo
                            from 
	                            prestadores
                            where 0=0
	                            {0}
                                and status = '1'
                            order by id
                          "
                         , where.ToString()
                         )
                ).ToList();

                var listaCotas = new BuscaRapidaItemModel();
                listaCotas.itens = prestadores;

                return listaCotas;
            }
        }

        public BuscaRapidaItemModel SelectCombustiveis(BuscaRapidaModel buscaRapidaModel)
        {
            using (var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var combustiveis = connection.Query<BuscaRapidaItemModel.Itens>(
                    string.Format(
                         @"
                            select id as Id, descricao as Titulo
                            from combustivel                              
                            WHERE 0=0
                            order by id
                          "
                         )
                ).ToList();

                var listaCombustiveis = new BuscaRapidaItemModel();
                listaCombustiveis.itens = combustiveis;

                return listaCombustiveis;
            }
        }
    }
}

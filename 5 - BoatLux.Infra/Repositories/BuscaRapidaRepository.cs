using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Extensions;
using BoatLux.Domain.Interfaces;
using BoatLux.Domain.Models.BuscaRapida;
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

namespace BoatLux.Infra.Repositories
{
    public class BuscaRapidaRepository : IBuscaRapidaRepository
    {
        private readonly DBContext _context;
        private readonly IOptions<MyAppSettings> _myAppSettings;
        public BuscaRapidaRepository(DBContext context, IOptions<MyAppSettings> myAppSettings)
        {
            _myAppSettings = myAppSettings;
            _context = context;
        }
        public BuscaRapidaItemModel BuscarCustos(BuscaRapidaModel buscaRapidaModel)
        {
            var buscaRapidaContext = new BuscaRapidaContext(_myAppSettings);
            var custos = buscaRapidaContext.SelectCustos(buscaRapidaModel);
            return custos;
        }

        public BuscaRapidaItemModel BuscarCotas(BuscaRapidaModel buscaRapidaModel)
        {
            var buscaRapidaContext = new BuscaRapidaContext(_myAppSettings);
            var cotas = buscaRapidaContext.SelectCotas(buscaRapidaModel);
            return cotas;
        }

        public BuscaRapidaItemModel BuscarPrestadores(BuscaRapidaModel buscaRapidaModel)
        {
            var buscaRapidaContext = new BuscaRapidaContext(_myAppSettings);
            var prestadores = buscaRapidaContext.SelectPrestadores(buscaRapidaModel);
            return prestadores;
        }
        public BuscaRapidaItemModel BuscarCombustiveis(BuscaRapidaModel buscaRapidaModel)
        {
            var buscaRapidaContext = new BuscaRapidaContext(_myAppSettings);
            var combustiveis = buscaRapidaContext.SelectCombustiveis(buscaRapidaModel);
            return combustiveis;
        }
    }
}



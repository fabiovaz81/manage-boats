using BoatLux.Domain.Entities;
using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Models.BuscaRapida;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Interfaces
{
    public interface IBuscaRapidaRepository
    {
        BuscaRapidaItemModel BuscarCustos(BuscaRapidaModel buscaRapidaModel);
        BuscaRapidaItemModel BuscarCotas(BuscaRapidaModel buscaRapidaModel);
        BuscaRapidaItemModel BuscarPrestadores(BuscaRapidaModel buscaRapidaModel);
        BuscaRapidaItemModel BuscarCombustiveis(BuscaRapidaModel buscaRapidaModel);       

    }
}

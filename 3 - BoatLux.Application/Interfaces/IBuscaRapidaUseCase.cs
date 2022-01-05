using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Models.BuscaRapida;
using BoatLux.Domain.Models.Financeiro;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Application.Interfaces
{
    public interface IBuscaRapidaUseCase
    {
        BuscaRapidaItemModel Buscar(BuscaRapidaModel buscaRapidaModel);
    }
}

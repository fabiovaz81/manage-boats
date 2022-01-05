using Boatlux.Domain.Models.Login;
using BoatLux.Application.Interfaces;
using BoatLux.Application.Services;
using BoatLux.Domain.Entities.Login;
using BoatLux.Domain.Interfaces;
using BoatLux.Domain.Models.BuscaRapida;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Application.UseCases
{
    public class BuscaRapidaUseCase : IBuscaRapidaUseCase
    {
        private readonly IBuscaRapidaRepository _repository;
        private readonly ITokenService _tokenService;

        public BuscaRapidaUseCase(IBuscaRapidaRepository repository, ITokenService tokenService)
        {
            _repository = repository;
            _tokenService = tokenService;
        }

        public BuscaRapidaItemModel Buscar(BuscaRapidaModel buscaRapidaModel)
            => buscaRapidaModel.Tipo.ToUpper() switch
            {
                "CUSTOS" => _repository.BuscarCustos(buscaRapidaModel),
                "COTAS" => _repository.BuscarCotas(buscaRapidaModel),
                "PRESTADORES" => _repository.BuscarPrestadores(buscaRapidaModel),
                "COMBUSTIVEIS" => _repository.BuscarCombustiveis(buscaRapidaModel),
                _ => new BuscaRapidaItemModel(),
            };
    }
}

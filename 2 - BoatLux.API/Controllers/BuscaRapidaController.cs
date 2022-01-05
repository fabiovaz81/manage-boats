using BoatLux.Application.Interfaces;
using BoatLux.Domain.Models.BuscaRapida;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BoatLux.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    /*[Authorize]*/
    public class BuscaRapidaController : ControllerBase
    {
        private readonly IBuscaRapidaUseCase _useCase;

        public BuscaRapidaController(IBuscaRapidaUseCase useCase)
        {
            _useCase = useCase;
        }

        [HttpPost]
        public BuscaRapidaItemModel Buscar([FromBody] BuscaRapidaModel buscaRapidaModel)
            => _useCase.Buscar(buscaRapidaModel);
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqComprovanteCusto
    {
        public int IdEmbarcacao { get; set; }
        public int IdCusto { get; set; }
        public int IdTipoCusto { get; set; }
    }
}

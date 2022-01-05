using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqCancelarFaturaModel
    {
        public int[] FaturaIds { get; set; }
        public string Observacao { get; set; }

    }
}

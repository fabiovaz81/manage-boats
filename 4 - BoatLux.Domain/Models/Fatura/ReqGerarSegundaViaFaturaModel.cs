using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Fatura
{
    public class ReqGerarSegundaViaFaturaModel
    {
        public int[] FaturaIds { get; set; }
        public DateTime DataSegundaVia { get; set; }
        public bool? CobrarMulta { get; set; }
        public bool? CobrarJuros { get; set; }
    }
}

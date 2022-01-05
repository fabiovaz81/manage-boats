using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqInativarCustoVariavelModel
    {
        public int CustoId { get; set; }
        public bool? DesativarParcelasFuturas { get; set; }

    }
}

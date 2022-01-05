using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqInativarCustosModel
    {
        public int id { get; set; }
        public int? idCota { get; set; }
        public int? idEmbarcacao { get; set; }
        public int tipoCusto { get; set; }
        public bool? DesativarParcelasFuturas { get; set; }
    }
}

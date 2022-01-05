using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class FaturaAvulsaModel
    {
        public int FaturaId { get; set; }
        public int CotaId { get; set; }
        public string NomeCota { get; set; }
        public double ValorFatura { get; set; }
    }
}

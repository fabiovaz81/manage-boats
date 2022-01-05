using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Fatura
{
    public class ResObterCotaDaTaxaAdm
    {
        public int FaturaId { get; set; }
        public int EmbarcacaoId { get; set; }
        public string Embarcaco { get; set; }
        public int FranquiaId { get; set; }
        public decimal ValorTaxa { get; set; }
        public int? CotasUsadas { get; set; }
        public int? TotalCotas { get; set; }
        public decimal TaxaPorCotista {
            get =>  Math.Round((ValorTaxa / (CotasUsadas.HasValue ? (decimal)CotasUsadas : 1)), 2);
        }
    }
}

using BoatLux.Domain.Models.Paginacao;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqObterTaxaPorCotista 
    {
        public int? Cota { get; set; }
        public double? Custo { get; set; }
        public string Embarcacao { get; set; }
        public DateTime DataFaturamento { get; set; }
        public string Franquia { get; set; }
        public bool? AtualizarTaxaAdmFatura { get; set; }
    }
}

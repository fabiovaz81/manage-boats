using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class EmbarcacaoFinanceiroEntity
    {
        public int Id { get; set; }
        public int EmbarcacaoId { get; set; }
        public decimal? PercentualRateio { get; set; }
        public int? Vencimento { get; set; }
        public int? MaxReservas { get; set; }
        public int? MaxSuplencias { get; set; }
        public int? MaxContigencias { get; set; }
        public int? MaxPremium { get; set; }
        public string PadraoRateio { get; set; }
        public decimal? TaxaAdmMinima { get; set; }
        public decimal? TaxaAdm { get; set; }
    }
}

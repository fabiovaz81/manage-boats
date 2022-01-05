using BoatLux.Domain.Entities.Financeiro;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ResObterTaxaAdmModel
    {
        public int EmbarcacaoId { get; set; }
        public decimal TaxaAdm { get; set; }
        public decimal TaxaAdmMinima { get; set; }

        public ResObterTaxaAdmModel(EmbarcacaoFinanceiroEntity embacacao)
        {
            EmbarcacaoId = embacacao.EmbarcacaoId;
            TaxaAdm = embacacao.TaxaAdm.HasValue ? (decimal)embacacao.TaxaAdm : 0;
            TaxaAdmMinima = embacacao.TaxaAdmMinima.HasValue ? (decimal)embacacao.TaxaAdmMinima : 0;
        }
    }
}

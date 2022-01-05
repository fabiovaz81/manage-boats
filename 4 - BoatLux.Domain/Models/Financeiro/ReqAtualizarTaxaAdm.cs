using DevExpress.Xpo;
using System;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqAtualizarTaxaAdm
    {
        public int EmbarcacaoId { get; set; }
        public int Tipo { get; set; }
        public decimal Valor { get; set; }
    }

}
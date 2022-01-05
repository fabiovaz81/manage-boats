using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{    public class FaturasModel
    {
        public int FaturaId { get; set; }
        public string Franquia { get; set; }
        public int EmbarcacaoId { get; set; }
        public string NomeEmbarcacao { get; set; }
        public int? CotaId { get; set; }
        public string NomeCota { get; set; }
        public string MesReferencia { get; set; }
        public DateTime DataVencimento { get; set; }
        public string DataVencimentoFormatada { get; set; }
        public double ValorFatura { get; set; }
        public string Status { get; set; } 
    }
}

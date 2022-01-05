using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class CCustosModel
    {
        public int EmbarcacaoId { get; set; }
        public string Embarcacao { get; set; }
        public int? FranquiaId { get; set; }
        public string Franquia { get; set; }

        public int? CotasUsadas { get; set; }
        public int? TotalCotas { get; set; }
        public double Custo { get; set; }
    }
}

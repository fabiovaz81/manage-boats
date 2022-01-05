using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqExportarDadosFaturaModel
    {
        public int? TipoPeriodo { get; set; }
        public DateTime? Periodo { get; set; }
        public string MesCompetencia { get; set; }
        public int? FranquiaId { get; set; }
        public int EmbarcacaoId { get; set; }
        public int? CotaId { get; set; }
        public int? StatusFatura { get; set; }
    }
}

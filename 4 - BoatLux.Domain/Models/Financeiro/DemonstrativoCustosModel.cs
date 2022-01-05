using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class DemonstrativoCustosModel
    {
        public int CotaId { get; set; }
        public string NomeCota { get; set; }
        public double? TotalCusto { get; set; }
        public int EmbarcacaoId { get; set; }

        public List<DemonstrativoCusto> Custos { get; set; }
       
        public class DemonstrativoCusto
        {
            public int CustoId { get; set; }
            public string DescricaoCusto { get; set; }
            public double? Custo { get; set; }
        }
    }   
}

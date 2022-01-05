using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class CustoFixoCotaModel
    {
        public int CotaId { get; set; }
        public string NomeCota { get; set; }
        public double Total { get; set; }
        public List<Custo> Custos { get; set; }

        public class Custo
        {
            public int Id { get; set; }
            public int CustoId { get; set; }
            public string DescricaoCusto { get; set; }
            public double Valor { get; set; }
        }
    }    
}

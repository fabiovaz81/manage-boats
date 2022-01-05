using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class CustoVariavelCotaModel
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
            public string ReferenciaFatura { get; set; }
            public string Parcelas { get; set; }
            public double Valor { get; set; }
        }
    }
}

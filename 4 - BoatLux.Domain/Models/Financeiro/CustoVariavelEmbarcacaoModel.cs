using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class CustoVariavelEmbarcacaoModel
    {
        public int Id { get; set; }
        public int CustoId { get; set; }
        public string DescricaoCusto { get; set; }
        public string ReferenciaFatura { get; set; }
        public string Parcelas { get; set; }
        public double Valor { get; set; }
        public string Observacao { get; set; }
    }
}

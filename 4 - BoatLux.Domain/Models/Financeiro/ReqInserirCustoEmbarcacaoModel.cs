using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqInserirCustoEmbarcacaoModel
    {
        public int? Id { get; set; }
        public int EmbarcacaoId { get; set; }
        public int TipoCusto { get; set; }
        public string Descricao { get; set; }
        public double Valor { get; set; }
        public int CustoId { get; set; }
        public int? PrestadorId { get; set; }
        public string TipoValorparcela { get; set; }
        public int QuantidadeParcelas { get; set; }
        public string MesInicialFaturamento { get; set; }
        public string TipoLancamento { get; set; }
        public int[] CotaIds { get; set; }
        public string Observacao { get; set; }

        public void UpdateCustoId(int id) => Id = id;
    }
}

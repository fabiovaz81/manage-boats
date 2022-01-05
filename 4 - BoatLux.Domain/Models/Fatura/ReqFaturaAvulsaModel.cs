using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Fatura
{
    public class ReqFaturaAvulsaModel
    {

        public int? EmbarcacaoId { get; set; }
        public DateTime DataVencimento { get; set; }
        public int? QuantidadeParcelas { get; set; }
        public int TipoFaturaAvulsa { get; set; }
        public List<FaturaAvulsaCustos> CustosFatura { get; set; }

        public class FaturaAvulsaCustos
        {
            public int? Id { get; set; }
            public int? CustoId { get; set; }
            public double Valor { get; set; }
            public double? Litros { get; set; }
            public int? CombustivelId { get; set; }
            public double? TaxaAbastecimento { get; set; }
            public DateTime? DataUso { get; set; }
            public DateTime? DataAbastecimento { get; set; }
            public int? PrestadorId { get; set; }
            public string MesReferencia{ get; set; }
            public string Observacao { get; set; }
            public int? CotaId { get; set; }
            public string Guid { get; set; }
        }

        public void UpdateCustoByGuid(int id, string guid)
        {
            var custoFatura = CustosFatura.Find(x => x.Guid == guid);
            custoFatura.Id = id;
        }
    }
}

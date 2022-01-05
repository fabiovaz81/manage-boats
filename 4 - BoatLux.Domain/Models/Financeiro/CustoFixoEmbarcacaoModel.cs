using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
 public class ResBuscarCustosFixosEmbarcacaoModel
    {
        public List<CustoFixoEmbarcacaoModel> CustoFixoEmbarcacaoModels { get; set; }
    }
    public class CustoFixoEmbarcacaoModel
    {
        public int Id { get; set; }
        public int CustoId { get; set; }
        public string DescricaoCusto{ get; set; }
        public double Valor { get; set; }
        public string Observacao { get; set; }
    }
}

using BoatLux.Domain.Models.Paginacao;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqBuscarCustosModel : BaseReqBuscaPaginadaModel
    {
        public int CustoId { get; set; }
        public string Descricao { get; set; }
        public int TipoCusto { get; set; }
        public bool Ativos { get; set; }
    }
}

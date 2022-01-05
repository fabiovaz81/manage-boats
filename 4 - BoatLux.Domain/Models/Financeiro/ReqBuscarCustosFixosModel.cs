using BoatLux.Domain.Models.Paginacao;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqBuscarCustosFixosModel : BaseReqBuscaPaginadaModel
    {       
            public int CustoId { get; set; }
            public string DescricaoCusto { get; set; }
            public double ValorCusto { get; set; }
            public string MesCobranca { get; set; }
            public string Observacao { get; set; }
    }
}

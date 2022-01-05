using BoatLux.Domain.Models.Paginacao;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqBuscarFaturasModel : BaseReqBuscaPaginadaModel
    {
        public DateTime? Referencia { get; set; }
    }
}

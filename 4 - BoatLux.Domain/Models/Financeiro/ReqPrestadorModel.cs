using BoatLux.Domain.Models.Paginacao;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqPrestadorModel : BaseReqBuscaPaginadaModel
    {
        public bool Ativos { get; set; }
        public string CnpjCpf { get; set; }
        public int PrestadorId { get; set; }
        public string RazaoFantasia { get; set; }
    }
}

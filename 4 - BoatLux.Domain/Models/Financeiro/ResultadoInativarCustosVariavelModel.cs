using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class ResultadoInativarCustosVariavelModel
    {
        public int CustoId { get; set; }
        public DateTime FaturaReferencia { get; set; }
        public decimal Valor { get; set; }
        public string ParcelaInfo { get; set; }
        public string Observacao { get; set; }
        public int StatusCotaCusto { get; set; }
        public int StatusFinanceiroCustos { get; set; }
    }
}

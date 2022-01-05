using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class CustoParceladoModel
    {
        public int id { get; set; }
        public int idCusto { get; set; }
        public int dif { get; set; }
        public string referenciaFatura { get; set; }
        public decimal Valor { get; set; }
        public string ParcelaInfo { get; set; }
        public int Parcela { get; set; }
        public int QuantidadeParcela { get; set; }
        public int Status { get; set; }
    }
}

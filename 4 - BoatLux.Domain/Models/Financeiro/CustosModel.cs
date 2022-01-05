using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class CustosModel
    {
        public int CustoId { get; set; }
        public string Descricao { get; set; }
        public int Tipo { get; set; }
        public string DescricaoTipo { get; set; }
        public int Status { get; set; } 
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class CustoVariavelEntity: BaseEntity
    {
        public int EmbarcacaoId { get; set; }
        public int CustoId { get; set; }
        public double Valor { get; set; }
        public int Status { get; set; }
    }
}

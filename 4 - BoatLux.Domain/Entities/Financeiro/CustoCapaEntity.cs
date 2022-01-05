using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class CustoCapaEntity: BaseEntity
    {
        public override int Id { get; set; }
        public int IdCustoTipo { get; set; }
        public DateTime DataLancto { get; set; }

        public CustoCapaEntity(int idCustoTipo)
        {
            IdCustoTipo = idCustoTipo;
            DataLancto = DateTime.Now;
        }
    }
}

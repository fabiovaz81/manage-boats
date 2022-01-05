using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class FaturaItemEntity
    {
        public int? Id { get; set; }
        public int FaturaId { get; set; }
        public int CustoId { get; set; }
        public double Valor { get; set; }
        public string TipoCusto { get; set; }
        public int? ReferenciaFinanceiroId { get; set; }        
        [NotMapped]
        public int? CotaId { get; set; }

        public FaturaItemEntity() { }

        public FaturaItemEntity(int faturaId, int custoId, double valor, string tipoCusto, int referenciaFinanceiroId, int cotaId)
        {
            FaturaId = faturaId;
            CustoId = custoId;
            Valor = valor;
            TipoCusto = tipoCusto;
            ReferenciaFinanceiroId = referenciaFinanceiroId;
            CotaId = cotaId;
        }
    }
}


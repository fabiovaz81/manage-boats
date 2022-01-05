using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class CustoFixoEmbarcacaoEntity : BaseEntity
    {
        public int EmbarcacaoId { get; set; }
        public int CustoId { get; set; }
        public double Valor { get; set; }
        public int Status { get; set; }
        public int IdCapa { get; set; }
        public string Observacao { get; set; }

        public CustoFixoEmbarcacaoEntity(int embarcacaoId, int custoId, double valor, int status, int idCapa, string observacao)
        {
            EmbarcacaoId = embarcacaoId;
            CustoId = custoId;
            Valor = valor;
            Status = status;
            IdCapa = idCapa;
            Observacao = observacao;
        }
    }
}

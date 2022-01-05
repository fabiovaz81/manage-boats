using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class CustoVariavelEmbarcacaoEntity : BaseEntity
    {
        public int EmbarcacaoId { get; set; }
        public int CustoId { get; set; }
        public string ReferenciaFatura { get; set; }
        public double Valor { get; set; }
        public string ParcelasInfo { get; set; }
        public string Observacao { get; set; }
        public int Status { get; set; }
        public int IdCapa { get; set; }

        public CustoVariavelEmbarcacaoEntity(
            int embarcacaoId, int custoId, string referenciaFatura, double valor,
            string parcelasInfo, string observacao, int status, int idCapa
            )
        {
            EmbarcacaoId = embarcacaoId;
            CustoId = custoId;
            ReferenciaFatura = referenciaFatura;
            Valor = valor;
            ParcelasInfo = parcelasInfo;
            Observacao = observacao;
            Status = status;
            IdCapa = idCapa;
        } 
    }
}
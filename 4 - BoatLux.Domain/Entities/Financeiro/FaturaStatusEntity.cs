using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class FaturaStatusEntity
    {
        [NotMapped]
        public int? Id { get; set; }
        public int FaturaId { get; set; }
        public int StatusId { get; set; }
        public DateTime DataStatus { get; set; }
        public string Observacao { get; set; }

        public FaturaStatusEntity() { }

        public FaturaStatusEntity(int faturaId, int statusId, DateTime dataStatus, string observacao)
        {
            FaturaId = faturaId;
            StatusId = statusId;
            DataStatus = dataStatus;
            Observacao = observacao;
        }

    }
}

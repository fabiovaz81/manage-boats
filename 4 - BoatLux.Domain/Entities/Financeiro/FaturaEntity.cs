using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class FaturaEntity
    {
        public int? Id { get; set; }
        public string Referencia { get; set; }
        public DateTime Vencimento { get; set; }
        public int CotaId { get; set; }
        public int UsuarioId { get; set; }
        public int Avulsa { get; set; }
        public int AvulsaGerada { get; set; }
        public int MultaSegundaVia { get; set; }
        public int JurosSegundaVia { get; set; }
        public int DiasAtraso { get; set; }
        public int Btlx { get; set; }

        [NotMapped]
        public List<FaturaItemEntity> FaturaItens { get; set; }

        public FaturaEntity() { }
        public FaturaEntity(string referencia, DateTime vencimento, int cotaId, int usuarioId, int avulsa,
            int avulsaGerada, int multaSegundaVia, int jurosSegundaVia, int diasAtraso, int btlx)
        {
            Referencia = referencia;
            Vencimento = vencimento;
            CotaId = cotaId;
            UsuarioId = usuarioId;
            Avulsa = avulsa;
            AvulsaGerada = avulsaGerada;
            MultaSegundaVia = multaSegundaVia;
            JurosSegundaVia = jurosSegundaVia;
            DiasAtraso = diasAtraso;
            Btlx = btlx;
        }
    }
}

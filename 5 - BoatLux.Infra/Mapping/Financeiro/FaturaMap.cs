using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    public class FaturaMap : IEntityTypeConfiguration<FaturaEntity>
    {
        public void Configure(EntityTypeBuilder<FaturaEntity> builder)
        {
            builder.ToTable("_faturas");
            builder.HasKey(x => x.Id).HasName("id");
            builder.Property(x => x.Referencia).HasColumnName("referencia").HasColumnType("varchar(45)");
            builder.Property(x => x.Vencimento).HasColumnName("vencimento").HasColumnType("date");
            builder.Property(x => x.CotaId).HasColumnName("id_cota").HasColumnType("int(11)");
            builder.Property(x => x.UsuarioId).HasColumnName("id_usuario").HasColumnType("int(11)");
            builder.Property(x => x.Avulsa).HasColumnName("avulsa").HasColumnType("tinyint(2)");
            builder.Property(x => x.AvulsaGerada).HasColumnName("avulsa_gerada").HasColumnType("tinyint(2)");
            builder.Property(x => x.MultaSegundaVia).HasColumnName("multa2via").HasColumnType("tinyint(2)");
            builder.Property(x => x.JurosSegundaVia).HasColumnName("juros2via").HasColumnType("tinyint(2)");
            builder.Property(x => x.DiasAtraso).HasColumnName("diasatraso").HasColumnType("int(8)");
            builder.Property(x => x.Btlx).HasColumnName("btlx").HasColumnType("tinyint(2)");
        }
    }
}
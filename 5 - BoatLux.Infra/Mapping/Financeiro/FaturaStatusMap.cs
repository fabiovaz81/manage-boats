using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    public class FaturaStatusMap : IEntityTypeConfiguration<FaturaStatusEntity>
    {
        public void Configure(EntityTypeBuilder<FaturaStatusEntity> builder)
        {
            builder.ToTable("_faturas_status");
            builder.HasKey(x => x.Id).HasName("id");
            builder.Property(x => x.FaturaId).HasColumnName("id_fatura").HasColumnType("int(11)");
            builder.Property(x => x.StatusId).HasColumnName("id_status").HasColumnType("int(11)");
            builder.Property(x => x.DataStatus).HasColumnName("data_status").HasColumnType("datetime");
            builder.Property(x => x.Observacao).HasColumnName("observacao").HasColumnType("text");
        }
    }
}
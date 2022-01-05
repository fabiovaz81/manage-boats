﻿using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    public class CustoFixoCotaMap : IEntityTypeConfiguration<CustoFixoCotaEntity>
    {
        public void Configure(EntityTypeBuilder<CustoFixoCotaEntity> builder)
        {
            builder.ToTable("_financeiro_cota_custos_fixos");
            builder.HasKey(x => x.Id).HasName("id");
            builder.Property(x => x.CotaId).HasColumnName("id_cota").HasColumnType("int(11)");
            builder.Property(x => x.CustoId).HasColumnName("id_custo").HasColumnType("int(11)");
            builder.Property(x => x.Valor).HasColumnName("valor").HasColumnType("float(10,2)");
            builder.Property(x => x.Status).HasColumnName("status").HasColumnType("tinyint(2)");
            builder.Property(x => x.IdCapa).HasColumnName("id_capa").HasColumnType("int(11)");
            builder.Property(x => x.Observacao).HasColumnName("observacao").HasColumnType("varchar(250)");
        }
    }
}

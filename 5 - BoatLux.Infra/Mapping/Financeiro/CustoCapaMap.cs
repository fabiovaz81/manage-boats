using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    public class CustoCapaMap : IEntityTypeConfiguration<CustoCapaEntity>
    {
        public void Configure(EntityTypeBuilder<CustoCapaEntity> builder)
        {
            builder.ToTable("financeiro_capa_custos");
            builder.HasKey(x => x.Id).HasName("id");
            builder.Property(x => x.IdCustoTipo).HasColumnName("id_custo_tipo").HasColumnType("int(11)");
            builder.Property(x => x.DataLancto).HasColumnName("data_lancto").HasColumnType("datetime");
        }
    }
}

using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    public class FaturaItemMap : IEntityTypeConfiguration<FaturaItemEntity>
    {
        public void Configure(EntityTypeBuilder<FaturaItemEntity> builder)
        {
            builder.ToTable("_faturas_itens");
            builder.HasKey(x => x.Id).HasName("id");
            builder.Property(x => x.FaturaId).HasColumnName("id_fatura").HasColumnType("int(8)");
            builder.Property(x => x.CustoId).HasColumnName("id_custo").HasColumnType("int(8)");
            builder.Property(x => x.Valor).HasColumnName("valor").HasColumnType("float(10,2)");
            builder.Property(x => x.TipoCusto).HasColumnName("tipo_custo").HasColumnType("varchar(45)");
            builder.Property(x => x.ReferenciaFinanceiroId).HasColumnName("id_referencia_financeiro").HasColumnType("int(11)");
        }
    }
}
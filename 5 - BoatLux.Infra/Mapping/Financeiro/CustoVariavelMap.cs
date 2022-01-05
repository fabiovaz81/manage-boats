using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    public class CustoVariavelMap : IEntityTypeConfiguration<CustoVariavelEntity>
    {
        public void Configure(EntityTypeBuilder<CustoVariavelEntity> builder)
        {
            builder.ToTable("_financeiro_embarcacao_custos_variaveis");
            builder.HasKey(x => x.Id).HasName("id");
            builder.Property(x => x.EmbarcacaoId).HasColumnName("id_embarcacao").HasColumnType("int(11)");
            builder.Property(x => x.CustoId).HasColumnName("id_custo").HasColumnType("int(11)");
            builder.Property(x => x.Valor).HasColumnName("valor").HasColumnType("float(10,2)");
            builder.Property(x => x.Status).HasColumnName("status").HasColumnType("tinyint(2)");
        }
    }
}
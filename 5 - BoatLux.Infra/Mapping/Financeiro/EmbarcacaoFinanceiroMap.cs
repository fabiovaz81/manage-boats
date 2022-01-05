using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    class EmbarcacaoFinanceiroMap : IEntityTypeConfiguration<EmbarcacaoFinanceiroEntity>
    {
        public void Configure(EntityTypeBuilder<EmbarcacaoFinanceiroEntity> builder)
        {
            builder.ToTable("_embarcacoes_financeiro");
            builder.HasKey(x => x.Id).HasName("id");
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.EmbarcacaoId).HasColumnName("id_embarcacao").HasColumnType("int(11)");
            builder.Property(x => x.PercentualRateio).HasColumnName("percentual_rateio").HasColumnType("float(5,2)");
            builder.Property(x => x.Vencimento).HasColumnName("vencimento").HasColumnType("int(11)");
            builder.Property(x => x.MaxReservas).HasColumnName("max_reservas").HasColumnType("int(4)");
            builder.Property(x => x.MaxSuplencias).HasColumnName("max_suplencias").HasColumnType("int(4)");
            builder.Property(x => x.MaxContigencias).HasColumnName("max_contigencias").HasColumnType("int(4)");
            builder.Property(x => x.MaxPremium).HasColumnName("max_premium").HasColumnType("int(4)");
            builder.Property(x => x.PadraoRateio).HasColumnName("padrao_rateio").HasColumnType("varchar(45)");
            builder.Property(x => x.TaxaAdmMinima).HasColumnName("taxa_adm_minima").HasColumnType("float(10,3)");
            builder.Property(x => x.TaxaAdm).HasColumnName("taxa_adm").HasColumnType("float(10,3)");
        }
    }
}

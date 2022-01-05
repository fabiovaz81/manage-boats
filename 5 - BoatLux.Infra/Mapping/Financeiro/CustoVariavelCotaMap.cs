using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    public class CustoVariavelCotaMap : IEntityTypeConfiguration<CustoVariavelCotaEntity>
    {
        public void Configure(EntityTypeBuilder<CustoVariavelCotaEntity> builder)
        {
            builder.ToTable("_financeiro_cota_custos_variaveis");
            builder.HasKey(x => x.Id).HasName("id");
            builder.Property(x => x.CotaId).HasColumnName("id_cota").HasColumnType("int(11)");
            builder.Property(x => x.CustoId).HasColumnName("id_custo").HasColumnType("int(11)");
            builder.Property(x => x.ReferenciaFatura).HasColumnName("referencia_fatura").HasColumnType("varchar(20)");
            builder.Property(x => x.Valor).HasColumnName("valor").HasColumnType("float(10,2)");
            builder.Property(x => x.ParcelasInfo).HasColumnName("parcelas_info").HasColumnType("varchar(20)");
            builder.Property(x => x.Observacao).HasColumnName("observacao").HasColumnType("varchar(200)");
            builder.Property(x => x.Status).HasColumnName("status").HasColumnType("tinyint(2)");
            builder.Property(x => x.Avulso).HasColumnName("avulso").HasColumnType("tinyint(2)");
            builder.Property(x => x.Gerado).HasColumnName("gerado").HasColumnType("tinyint(2)");
            builder.Property(x => x.IdCapa).HasColumnName("id_capa").HasColumnType("int(11)");
            builder.Property(x => x.IdCombustivel).HasColumnName("id_combustivel").HasColumnType("int(8)");
            builder.Property(x => x.LitrosCombustivel).HasColumnName("litros_combustivel").HasColumnType("float(10,3)");
            builder.Property(x => x.TaxaAbastecimentoCombustivel).HasColumnName("taxa_abastecimento_combustivel").HasColumnType("float(10,3)");
            builder.Property(x => x.DataUsoCombustivel).HasColumnName("data_uso_combustivel").HasColumnType("datetime");
            builder.Property(x => x.DataAbastecimentoCombustivel).HasColumnName("data_abastecimento_combustivel").HasColumnType("datetime");
            builder.Property(x => x.IdPrestadorCombustivel).HasColumnName("id_prestador_combustivel").HasColumnType("int(11)");
        }
    }
}

using BoatLux.Domain.Entities.Financeiro;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Mapping.Financeiro
{
    public class PrestadorMap : IEntityTypeConfiguration<PrestadorEntity>
    {
        public void Configure(EntityTypeBuilder<PrestadorEntity> builder)
        {
            builder.ToTable("prestadores");
            //builder.Property(x => x.PrestadorId).HasColumnName("id").HasColumnType("int(11)");
            builder.Property(x => x.Razao).HasColumnName("razao").HasColumnType("varchar(100)");
            builder.Property(x => x.Fantasia).HasColumnName("fantasia").HasColumnType("varchar(100)");
            builder.Property(x => x.TipoDocumento).HasColumnName("tipo").HasColumnType("char(1)");
            builder.Property(x => x.CpfCnpj).HasColumnName("nr_doc").HasColumnType("varchar(14)");
            builder.Property(x => x.Ie).HasColumnName("ie").HasColumnType("varchar(12)");
            builder.Property(x => x.Logradouro).HasColumnName("logradouro").HasColumnType("varchar(150)");
            builder.Property(x => x.Cep).HasColumnName("cep").HasColumnType("varchar(8)");
            builder.Property(x => x.Numero).HasColumnName("numero").HasColumnType("varchar(10)");
            builder.Property(x => x.Bairro).HasColumnName("bairro").HasColumnType("varchar(50)");
            builder.Property(x => x.Cidade).HasColumnName("cidade").HasColumnType("varchar(50)");
            builder.Property(x => x.Uf).HasColumnName("uf").HasColumnType("char(2)");
            builder.Property(x => x.Complemento).HasColumnName("complemento").HasColumnType("varchar(200)");
            builder.Property(x => x.Contato).HasColumnName("contato").HasColumnType("varchar(30)");
            builder.Property(x => x.Telefone).HasColumnName("telefone").HasColumnType("varchar(11)");
            builder.Property(x => x.Celular).HasColumnName("celular").HasColumnType("varchar(12)");
            builder.Property(x => x.Email).HasColumnName("email").HasColumnType("varchar(100)");
            builder.Property(x => x.Banco).HasColumnName("banco").HasColumnType("varchar(8)");
            builder.Property(x => x.Agencia).HasColumnName("agencia").HasColumnType("varchar(15)");
            builder.Property(x => x.Conta).HasColumnName("conta").HasColumnType("varchar(15)");
            builder.Property(x => x.Pix).HasColumnName("pix").HasColumnType("varchar(30)");
            builder.Property(x => x.TipoPix).HasColumnName("pix_tipo").HasColumnType("varchar(15)");
            builder.Property(x => x.Status).HasColumnName("status").HasColumnType("char(1)");
        }
    }
}

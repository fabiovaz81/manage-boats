using BoatLux.Domain.Entities.Financeiro;
using BoatLux.Domain.Entities.Login;
using BoatLux.Infra.Mapping.Financeiro;
using BoatLux.Infra.Mapping.Login;
using Microsoft.EntityFrameworkCore;

namespace BoatLux.Infra.Context
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options) { }

        public DbSet<CustoEntity> Custo { get; set; }
        public DbSet<CustoCapaEntity> CustoCapa { get; set; }
        public DbSet<CustoFixoEmbarcacaoEntity> CustoFixoEmbarcacao { get; set; }
        public DbSet<CustoFixoCotaEntity> CustoFixoCota { get; set; }
        public DbSet<CustoVariavelCotaEntity> CustoVariavelCota { get; set; }
        public DbSet<CustoVariavelEmbarcacaoEntity> CustoVariavelEmbarcacao { get; set; }
        public DbSet<FaturaEntity> Fatura { get; set; }
        public DbSet<FaturaItemEntity> FaturaItem { get; set; }
        public DbSet<PrestadorEntity> Prestador { get; set; }
        public DbSet<UsuarioEntity> Usuario { get; set; }
        public DbSet<UsuarioEmailEntity> UsuarioEmail { get; set; }
        public DbSet<FaturaStatusEntity> FaturaStatus { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new CustoMap());
            modelBuilder.ApplyConfiguration(new CustoCapaMap());
            modelBuilder.ApplyConfiguration(new CustoFixoEmbarcacaoMap());
            modelBuilder.ApplyConfiguration(new CustoFixoCotaMap());
            modelBuilder.ApplyConfiguration(new CustoVariavelEmbarcacaoMap());
            modelBuilder.ApplyConfiguration(new FaturaMap());
            modelBuilder.ApplyConfiguration(new FaturaItemMap());
            modelBuilder.ApplyConfiguration(new CustoVariavelCotaMap());
            modelBuilder.ApplyConfiguration(new PrestadorMap());
            modelBuilder.ApplyConfiguration(new UsuarioMap());
            modelBuilder.ApplyConfiguration(new UsuarioEmailMap());
            modelBuilder.ApplyConfiguration(new FaturaStatusMap());
        }
    }
}

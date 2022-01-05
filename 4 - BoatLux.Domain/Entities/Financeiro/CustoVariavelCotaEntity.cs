using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class CustoVariavelCotaEntity : BaseEntity
    {
        public int CotaId { get; set; }
        public int CustoId { get; set; }
        public string ReferenciaFatura { get; set; }
        public double Valor { get; set; }
        public string ParcelasInfo { get; set; }
        public string Observacao { get; set; }
        public int Status { get; set; }
        public int Avulso { get; set; }
        public int Gerado { get; set; }
        public int IdCapa { get; set; }
        public int? IdCombustivel { get; set; }
        public double? LitrosCombustivel { get; set; }
        public double? TaxaAbastecimentoCombustivel { get; set; }
        public DateTime? DataUsoCombustivel { get; set; }
        public DateTime? DataAbastecimentoCombustivel { get; set; }
        public int? IdPrestadorCombustivel { get; set; }

        public CustoVariavelCotaEntity(
            int cotaId, int custoId, string referenciaFatura, double valor, string parcelasInfo, 
            string observacao, int status, int avulso, int gerado, int idCapa
            )
        {
            CotaId = cotaId;
            CustoId = custoId;
            ReferenciaFatura = referenciaFatura;
            Valor = valor;
            ParcelasInfo = parcelasInfo;
            Observacao = observacao;
            Status = status;
            Avulso = avulso;
            Gerado = gerado;
            IdCapa = idCapa;
        }

        public CustoVariavelCotaEntity(
          int cotaId, int custoId, string referenciaFatura, double valor,
          string parcelasInfo, string observacao, int status, int avulso, int idCapa,
          int idCombustivel, double litrosCombustivel, double taxaAbastecimentoCombustivel,
          DateTime dataUsoCombustivel, DateTime dataAbastecimentoCombustivel, int idPrestadorCombustivel
          )
        {
            CotaId = cotaId;
            CustoId = custoId;
            ReferenciaFatura = referenciaFatura;
            Valor = valor;
            ParcelasInfo = parcelasInfo;
            Observacao = observacao;
            Status = status;
            Avulso = avulso;
            IdCapa = idCapa;
            IdCombustivel = idCombustivel;
            LitrosCombustivel = litrosCombustivel;
            TaxaAbastecimentoCombustivel = taxaAbastecimentoCombustivel;
            DataUsoCombustivel = dataUsoCombustivel;
            DataAbastecimentoCombustivel = dataAbastecimentoCombustivel;
            IdPrestadorCombustivel = idPrestadorCombustivel;
        }
    }
}

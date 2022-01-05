using BoatLux.Domain.Models.Paginacao;


namespace BoatLux.Domain.Models.Financeiro
{
    public class ReqObterParcerlasPorCustosModel 
    {
        public int idCusto { get; set; }
        public int? idEmbarcacao { get; set; }
        public int? idCota { get; set; }
    }
}

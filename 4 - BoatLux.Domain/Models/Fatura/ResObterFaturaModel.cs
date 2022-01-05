using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Fatura
{
    public class ResObterFaturaModel
    {
        public string Cotista { get; set; }
        public string EmailCotista { get; set; }
        public string Cota { get; set; }
        public string Embarcacao { get; set; }
        public double Valor { get; set; }
        public string Referencia { get; set; }
        public string Status { get; set; }
        public List<ItensFaturaModel> Itens { get; set; }
        public List<HistoricosFaturaModel> Historicos { get; set; }

        public class ItensFaturaModel
        {
            public int ItemId { get; set; }
            public string Descricao { get; set; }
            public double ValorItem { get; set; }
            public int CustoId { get; set; }
            public string TipoCusto { get; set; }
        }

        public class HistoricosFaturaModel
        {
            public int HistoricoId { get; set; }
            public string OrdemPagamento { get; set; }
            public string LinkFatura { get; set; }
            public string Status { get; set; }
            public DateTime DataVencimento { get; set; }
            public List<Detalhe> Detalhes { get; set; }
            public class Detalhe
            {
                public DateTime Data { get; set; }
                public string Descricao { get; set; }
                public string Notas { get; set; }
            }

        }

    }

    

   
}

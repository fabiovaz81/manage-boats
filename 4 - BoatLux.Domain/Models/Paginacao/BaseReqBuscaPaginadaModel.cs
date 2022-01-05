using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Paginacao
{
    public abstract class BaseReqBuscaPaginadaModel
    {
        public RequisicaoBuscaPaginadaModel Paginacao { get; set; }
    }

    public class RequisicaoBuscaPaginadaModel
    {
        public int PaginaAtual { get; set; }
        public int ItensPorPagina { get; set; }
        public string ColunaOrdenacao { get; set; }
        public string DirecaoOrdenacao { get; set; }
        public int TotalItens { get; set; }

        public bool DirecaoOrdenacaoAsc
        {
            get
            {
                return DirecaoOrdenacao.ToLower() == "asc";
            }
        }
    }
}


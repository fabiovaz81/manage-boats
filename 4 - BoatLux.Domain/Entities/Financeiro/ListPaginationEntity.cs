using BoatLux.Domain.Models.Paginacao;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class ListPaginationEntity
    {
        public dynamic ListaItens { get; private set; }

        public RequisicaoBuscaPaginadaModel Paginacao { get; private set; }

        public ListPaginationEntity(dynamic list, RequisicaoBuscaPaginadaModel pagination)
        {
            ListaItens = list;
            Paginacao = pagination;
        }            
    }
}

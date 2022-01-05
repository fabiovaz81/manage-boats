using BoatLux.Domain.Models.Paginacao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BoatLux.Domain.Extensions
{ 
    public static class PaginationExtension
    {
        public static List<T> Paginar<T>(this List<T> list, RequisicaoBuscaPaginadaModel req)
        {
            return list.Skip(req.PaginaAtual * req.ItensPorPagina).Take(req.ItensPorPagina).ToList();
        }
    }
}

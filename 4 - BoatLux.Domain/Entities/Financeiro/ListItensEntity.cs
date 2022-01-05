using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Entities.Financeiro
{
    public class ListItensEntity
    {
        public dynamic ListaItens { get; private set; }
        public ListItensEntity(dynamic listaItens)
        {
            ListaItens = listaItens;
        }
    }
}

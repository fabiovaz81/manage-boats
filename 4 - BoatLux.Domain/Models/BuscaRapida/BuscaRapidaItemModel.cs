using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.BuscaRapida
{
    public class BuscaRapidaItemModel
    {

        public List<Itens> itens { get; set; }

        public class Itens
        {
            public string Id { get; set; }
            public string Titulo { get; set; }
        }
    }
}

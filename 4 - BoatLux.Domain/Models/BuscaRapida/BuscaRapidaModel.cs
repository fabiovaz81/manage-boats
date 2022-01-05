using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.BuscaRapida
{
    public class BuscaRapidaModel
    {
        public string Tipo { get; set; }
        public string Valor { get; set; }
        public bool BuscaExata { get; set; }
        public string Param1 { get; set; }
        public string Param2 { get; set; }
        public string Param3 { get; set; }

        //public List<Params> Params { get; set; }

    }

    //public class Params
    //{
    //    public string Chave;
    //
    //    public string Valor;
    //}
}

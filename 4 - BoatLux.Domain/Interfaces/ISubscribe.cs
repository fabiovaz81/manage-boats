using BoatLux.Domain.Models.Fatura;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BoatLux.Domain.Interfaces
{
    public interface ISubscribe
    {
        Task InserirFatura(FaturaIuguModel fatura);
        Task CancelarFatura(string idIugu);
    }
}

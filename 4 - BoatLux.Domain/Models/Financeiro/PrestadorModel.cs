using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Models.Financeiro
{
    public class PrestadorModel
    {
        public int PrestadorId { get; set; }
        public string Razao { get; set; }
        public string Fantasia { get; set; }
        public int? TipoDocumento { get; set; }
        public string CpfCnpj { get; set; }
        public string Ie { get; set; }
        public string Cep { get; set; }
        public string Logradouro { get; set; }
        public string Numero { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Uf { get; set; }
        public string complemento { get; set; }
        public string Contato { get; set; }
        public string Telefone { get; set; }
        public string Celular { get; set; }
        public string Email { get; set; }
        public string Banco { get; set; }
        public string Agencia { get; set; }
        public string Conta { get; set; }
        public string Pix { get; set; }
        public string TipoPix { get; set; }
        public int Status { get; set; }
    }
}

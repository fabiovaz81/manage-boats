using System;
using System.Collections.Generic;
using System.Text;

namespace Boatlux.Domain.Models.Login
{
    public class ResponseLoginModel
    {
        public int Id { get; private set; }
        public string User { get; private set; }
        public string Name { get; private set; }
        public string Token { get; private set; }
        public int IdStatus { get; set; }
        public string Status { get; set; }

        public ResponseLoginModel(int id, string user, string name, string token)
        {
            Id = id;
            User = user;
            Name = name;
            Token = token;
        }

        public ResponseLoginModel SetToken(string token)
        {
            Token = token;
            return this;
        }

        public ResponseLoginModel SetStatus(int idStatus, string status)
        {
            IdStatus = idStatus;
            Status = status;
            return this;
        }
    }
}

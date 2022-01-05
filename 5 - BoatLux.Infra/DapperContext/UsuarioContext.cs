using Boatlux.Domain.Models.Login;
using BoatLux.Domain.Entities.Login;
using BoatLux.Infra.Options;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BoatLux.Infra.DapperContext
{
    public class UsuarioContext
    {
        private readonly IOptions<MyAppSettings> _myAppSettings;

        public UsuarioContext(IOptions<MyAppSettings> myAppSettings)
        {
            _myAppSettings = myAppSettings;
        }
        public UsuarioEntity Select(RequestLoginModel request)
        {
            using(var connection = new MySqlConnection(_myAppSettings.Value.ConnString))
            {
                var query =
                       @$"SELECT 
                            us.id as Id, ue.email as Email, us.senha as Senha, ust.id as IdStatus, ust.nome as Status 
                          FROM 
                            usuarios us 
                            inner join usuarios_emails ue on ue.id_usuario=us.id 
                            inner join usuarios_status ust on ust.id = us.id_status
                          WHERE 0=0 
                            and ue.email = '{request.User}'
                          ";

                var user = connection.Query<UsuarioEntity>(query).FirstOrDefault();

                return user;
            }
        }
    }
}

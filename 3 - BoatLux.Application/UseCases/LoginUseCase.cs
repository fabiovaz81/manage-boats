using Boatlux.Domain.Models.Login;
using BoatLux.Application.Interfaces;
using BoatLux.Application.Services;
using BoatLux.Domain.Entities.Login;
using BoatLux.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Application.UseCases
{
    public class LoginUseCase : ILoginUseCase
    {
        private readonly ILoginRepository _repository;
        private readonly ITokenService _tokenService;

        public LoginUseCase(ILoginRepository repository, ITokenService tokenService)
        {
            _repository = repository;
            _tokenService = tokenService;
        }
        public ResponseLoginModel Login(RequestLoginModel request)
        {
            var usuario = _repository.Login(request);

            if (usuario == null || string.IsNullOrEmpty(usuario.Senha))
                throw new Exception("Usuário ou senha inválidos.");

            bool isValidPasswrod = _tokenService.ValidPassword(request.Password, usuario.Senha);

            if (!isValidPasswrod)
                throw new Exception("Usuário ou senha inválidos.");

            var response = new ResponseLoginModel(usuario.Id, usuario.Email, usuario.Email, "");

            response
                .SetToken(_tokenService.GenerateToken(response))
                .SetStatus(usuario.IdStatus, usuario.Status);

            return response;
        }

        public UsuarioEntity Insert(UsuarioEntity usuario)
        {
            var senha = _tokenService.CryptPassword(usuario.Senha);
            usuario.SetDataCadastro().SetSenha(senha);
            _repository.Insert(usuario);

            return usuario;
        }

    }
}

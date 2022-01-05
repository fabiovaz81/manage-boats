using BoatLux.Domain.Interfaces;
using BoatLux.Domain.Models.Fatura;
using BoatLux.Infra.Options;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BoatLux.Infra.Subscribers.Iugu
{
    public class FaturaSubscribe : ISubscribe
    {
        private static HttpClient httpClient = new HttpClient();
        private readonly IOptions<MyAppSettings> _myAppSettings;

        public FaturaSubscribe(IOptions<MyAppSettings> myAppSettings)
        {
            _myAppSettings = myAppSettings;
        }

        public async Task InserirFatura(FaturaIuguModel fatura)
        {
            HttpResponseMessage response;
            var _url = $"{_myAppSettings.Value.IuguBaseUrl}{_myAppSettings.Value.IuguEndPoints.CriarFatura}";

            var json = JsonConvert.SerializeObject(fatura);
            var jsonContent = new StringContent(json);

            httpClient.DefaultRequestHeaders.Clear();
            httpClient.DefaultRequestHeaders.Add("AuthorizationKey", _myAppSettings.Value.IuguToken);

            response = await httpClient.PostAsync(_url, jsonContent);
            var content = await response.Content.ReadAsStringAsync();

            /*
            if(response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                await Task.CompletedTask;
            }
            */
            await Task.CompletedTask;

        }

        public async Task CancelarFatura(string idIugu)
        {
           
            HttpResponseMessage response;
            var _url = $"{_myAppSettings.Value.IuguBaseUrl}{_myAppSettings.Value.IuguEndPoints.CriarFatura}/{idIugu}/cancel";

           

            httpClient.DefaultRequestHeaders.Clear();

            var byteArray = Encoding.UTF8.GetBytes($"{_myAppSettings.Value.IuguToken}:");
            var base64String = Convert.ToBase64String(byteArray);

            httpClient.DefaultRequestHeaders.Add($"Authorization", $"Basic {base64String}");
            var body = new StringContent("");
            response = await httpClient.PutAsync(_url, body);
            var content = await response.Content.ReadAsStringAsync();

            await Task.CompletedTask;
        }
    }
}

using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using BoatLux.Domain.Interfaces;
using BoatLux.Infra.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace BoatLux.Infra.Subscribers.S3
{
    public class S3Service : IS3Service
    {
        private readonly IOptions<MyAppSettings> _myAppSettings;
        private readonly IAmazonS3 _amazons3;

        public S3Service(IOptions<MyAppSettings> myAppSettings, IAmazonS3 amazons3)
        {
            _myAppSettings = myAppSettings;
            _amazons3 = amazons3;
        }
        /*
        public async Task UploadFile(Stream file)
        {
            try
            {
                var accessKey = _myAppSettings.Value.S3.AccessKey;
                var secretKey = _myAppSettings.Value.S3.SecretKey;
                var serviceUrl = _myAppSettings.Value.S3.ServiceUrl;
                var bucketName = _myAppSettings.Value.S3.BucketName;

                AmazonS3Config config = new AmazonS3Config { ServiceURL = serviceUrl };
                AmazonS3Client client = new AmazonS3Client(accessKey, secretKey, config);

                var transferUtility = new TransferUtility(client);
                await transferUtility.UploadAsync(file, bucketName, "MyFile");

            }
            catch (Exception ex)
            {
                await Task.CompletedTask;
            }

        }
*/
        public async Task UploadFile(PutObjectRequest putRequest)
        {
            

            await _amazons3.PutObjectAsync(putRequest);
        }
    }
}

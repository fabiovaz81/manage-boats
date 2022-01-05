using Amazon.S3.Model;
using BoatLux.Domain.Models.Fatura;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace BoatLux.Domain.Interfaces
{
    public interface IS3Service
    {
        Task UploadFile(PutObjectRequest putRequest);
    }
}

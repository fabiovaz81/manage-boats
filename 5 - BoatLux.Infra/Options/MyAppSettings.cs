using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Infra.Options
{
    public class MyAppSettings
    {
        public string ConnString { get; set; }
        public string Secret { get; set; }
        public string IuguBaseUrl { get; set; }
        public string IuguToken { get; set; }
        public IuguEndpoitsModel IuguEndPoints { get; set; }

        public class IuguEndpoitsModel
        {
            public string CriarFatura { get; set; }
        }

        public S3Data S3 { get; set; }

        public class S3Data
        {
            public string AccessKey { get; set; }
            public string SecretKey { get; set; }
            public string ServiceUrl { get; set; }
            public string BucketName { get; set; }
        }
    }
}

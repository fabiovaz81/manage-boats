using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Utils
{
    public static class StringUtil
    {
        public static Func<string, string> DealSql = value =>
        {
            if (!string.IsNullOrEmpty(value))
            {
                foreach (var chr in new string[] { "DROP", "TRUNCATE", "DELETE", "UPDATE", "SELECT" })
                    value = value.Replace(chr, "");
            }
            return value;
        };
    }
}

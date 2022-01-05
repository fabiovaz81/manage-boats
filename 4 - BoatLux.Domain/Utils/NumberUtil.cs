using System;
using System.Collections.Generic;
using System.Text;

namespace BoatLux.Domain.Utils
{
    public static class NumberUtil
    {
        public static int ConvertToInt(object num)
        {
            try { return Convert.ToInt32(num); }
            catch { return 0; }
        }
    }
}

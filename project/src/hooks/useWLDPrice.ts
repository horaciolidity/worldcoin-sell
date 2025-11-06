import { useState, useEffect, useCallback } from "react";

export function useWLDPrice() {
  const [usd, setUsd] = useState<number | null>(null);
  const [ars, setArs] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPrice = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Precio WLD en USD desde CoinGecko
      const wldRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=worldcoin-wld&vs_currencies=usd"
      );
      const wldData = await wldRes.json();
      const wldUsd = wldData["worldcoin-wld"].usd;

      // ✅ Dólar Blue en Argentina
      const usdRes = await fetch("https://api.bluelytics.com.ar/v2/latest");
      const usdData = await usdRes.json();
      const usdBlue = usdData.blue.value_avg;

      // ✅ Conversión
      const wldArs = wldUsd * usdBlue;

      setUsd(Number(wldUsd.toFixed(2)));
      setArs(Number(wldArs.toFixed(2)));
    } catch (err) {
      console.error("Error obteniendo cotizaciones:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60_000); // se actualiza cada minuto
    return () => clearInterval(interval);
  }, [fetchPrice]);

  // ✅ AHORA devolvemos refresh (manual)
  return { usd, ars, loading, refresh: fetchPrice };
}

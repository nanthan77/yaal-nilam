import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

export type DiasporaCurrency = "CAD" | "GBP" | "AUD" | "USD" | "EUR";

export const DEFAULT_RATES: Record<DiasporaCurrency, number> = {
  USD: 305.0,
  GBP: 395.0,
  EUR: 335.0,
  CAD: 225.0,
  AUD: 200.0,
};

export interface ExchangeRatesDocument {
  base: "LKR";
  rates: Record<DiasporaCurrency, number>;
  last_updated: string;
  source: string;
}

/**
 * Fetches current foreign exchange rates against LKR.
 * Uses open API with timeout; falls back gracefully to default Sri Lankan bank benchmarks.
 */
export async function fetchLiveExchangeRates(): Promise<{
  rates: Record<DiasporaCurrency, number>;
  source: string;
}> {
  try {
    const response = await axios.get("https://open.er-api.com/v6/latest/USD", {
      timeout: 5000,
    });

    if (response.data && response.data.result === "success" && response.data.rates) {
      const apiRates = response.data.rates;
      const usdToLkr = Number(apiRates.LKR);

      if (usdToLkr && usdToLkr > 100) {
        // Compute 1 Foreign Currency = X LKR
        const usdRate = usdToLkr;
        const gbpRate = (1 / Number(apiRates.GBP || 0.78)) * (usdToLkr * (apiRates.GBP || 0.78)) || DEFAULT_RATES.GBP;
        const eurRate = (1 / Number(apiRates.EUR || 0.92)) * (usdToLkr * (apiRates.EUR || 0.92)) || DEFAULT_RATES.EUR;
        const cadRate = (1 / Number(apiRates.CAD || 1.36)) * (usdToLkr) || DEFAULT_RATES.CAD;
        const audRate = (1 / Number(apiRates.AUD || 1.52)) * (usdToLkr) || DEFAULT_RATES.AUD;

        return {
          rates: {
            USD: Math.round(usdRate * 100) / 100,
            GBP: Math.round((usdToLkr / Number(apiRates.GBP)) * 100) / 100,
            EUR: Math.round((usdToLkr / Number(apiRates.EUR)) * 100) / 100,
            CAD: Math.round((usdToLkr / Number(apiRates.CAD)) * 100) / 100,
            AUD: Math.round((usdToLkr / Number(apiRates.AUD)) * 100) / 100,
          },
          source: "open.er-api.com",
        };
      }
    }
  } catch (error: any) {
    console.warn("Live exchange rate fetch failed; using baseline rates:", error?.message || error);
  }

  return {
    rates: DEFAULT_RATES,
    source: "default_fallback",
  };
}

/**
 * Saves current exchange rates to Firestore system_settings/exchange_rates
 */
export async function syncExchangeRates(): Promise<ExchangeRatesDocument> {
  const db = admin.firestore();
  const { rates, source } = await fetchLiveExchangeRates();

  const payload: ExchangeRatesDocument = {
    base: "LKR",
    rates,
    last_updated: new Date().toISOString(),
    source,
  };

  await db.collection("system_settings").doc("exchange_rates").set(payload, { merge: true });
  return payload;
}

/**
 * Callable endpoint to retrieve current cached rates for Web & Mobile Flutter apps
 */
export const getExchangeRates = functions.https.onCall(async () => {
  const db = admin.firestore();
  try {
    const docSnap = await db.collection("system_settings").doc("exchange_rates").get();
    if (docSnap.exists) {
      const data = docSnap.data() as ExchangeRatesDocument;
      // If older than 24 hours, background refresh
      const ageHours = (Date.now() - new Date(data.last_updated).getTime()) / (1000 * 60 * 60);
      if (ageHours > 24) {
        void syncExchangeRates();
      }
      return data;
    }
  } catch (err) {
    console.error("Error reading exchange rates document:", err);
  }

  return syncExchangeRates();
});

/**
 * Scheduled daily exchange rate sync (every day at midnight UTC)
 */
export const scheduledExchangeRateSync = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("UTC")
  .onRun(async () => {
    console.log("Running scheduled daily exchange rate sync...");
    const result = await syncExchangeRates();
    console.log("Daily exchange rate sync completed:", result.rates);
  });

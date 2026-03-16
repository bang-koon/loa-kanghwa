import transformMaterialName from "@/app/lib/transformMaterialName";
import { unstable_cache } from "next/cache";

const fetchMaterialPrice = async () => {
  const url = `${process.env.MARKET_URL}`;
  if (!url || url === "undefined") {
    console.error("MARKET_URL is not defined in environment variables.");
    throw new Error("MARKET_URL is not defined");
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch from ${url}. Status: ${response.status} ${response.statusText}, Body: ${errorText}`
      );
      throw new Error(`Failed to fetch material price: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchMaterialPrice:", error);
    throw error;
  }
};

const normalizePrices = (material: Record<string, number>) => {
  const normalized = { ...material };

  const stones = [
    "수호석 결정",
    "파괴석 결정",
    "수호강석",
    "파괴강석",
    "정제된 수호강석",
    "정제된 파괴강석",
    "운명의 수호석",
    "운명의 파괴석",
  ];

  stones.forEach(stone => {
    normalized[stone] = (normalized[stone] ?? 0) / 100;
  });

  normalized["운명의 파편 주머니(소)"] = parseFloat(
    ((normalized["운명의 파편 주머니(소)"] ?? 0) / 1000).toFixed(2)
  );

  return normalized;
};

const calculateCheapestHonorShard = (material: Record<string, number>) => {
  const processed = { ...material };
  const shardBags = [
    {
      name: "명예의 파편 주머니(소)",
      price: (processed["명예의 파편 주머니(소)"] ?? 0) / 500,
    },
    {
      name: "명예의 파편 주머니(중)",
      price: (processed["명예의 파편 주머니(중)"] ?? 0) / 1000,
    },
    {
      name: "명예의 파편 주머니(대)",
      price: (processed["명예의 파편 주머니(대)"] ?? 0) / 1500,
    },
  ];

  const cheapestBag = shardBags.reduce((prev, curr) =>
    prev.price < curr.price ? prev : curr
  );

  processed["명예의 파편"] = cheapestBag.price;

  delete processed["명예의 파편 주머니(소)"];
  delete processed["명예의 파편 주머니(중)"];
  delete processed["명예의 파편 주머니(대)"];

  return processed;
};

const getTimestampAsNumber = () => {
  const now = new Date();
  const y = String(now.getFullYear()).slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return parseInt(`${y}${m}${d}${hh}${mm}${ss}`, 10);
};

const getMaterialPriceData = async (): Promise<Record<string, number>> => {
  const data = await fetchMaterialPrice().then(res => res.items);
  let material: Record<string, number> = { 골드: 1 };
  for (const item of data) {
    material[item.Name] = item.RecentPrice;
  }

  material = normalizePrices(material);
  material = calculateCheapestHonorShard(material);

  const transformed = transformMaterialName(material);

  return {
    ...transformed,
    createdAt: getTimestampAsNumber(),
  };
};

export const getMaterialPrice = unstable_cache(
  async () => getMaterialPriceData(),
  ["material-prices"], 
  { revalidate: 3600 } 
);

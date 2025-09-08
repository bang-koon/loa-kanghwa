import transformMaterialName from "@/app/lib/transformMaterialName";

const fetchMaterialPrice = async () => {
  const url = `${process.env.MARKET_URL}`;
  const data = await fetch(url, { next: { revalidate: 3600 } })
    .then(res => res.json())
    .catch(error => {
      console.error("Error in fetchMaterialPrice:", error);
      throw new Error("Failed to fetch material price");
    });
  return data;
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

export const getMaterialPrice = async () => {
  const data = await fetchMaterialPrice().then(res => res.items);
  let material: Record<string, number> = { 골드: 1 };
  for (const item of data) {
    material[item.Name] = item.RecentPrice;
  }

  material = normalizePrices(material);
  material = calculateCheapestHonorShard(material);

  return transformMaterialName(material);
};

// This code is based on or references code from loa-calc.
// Original code is licensed under the MIT License.
// Copyright (c) 2021 icepeng
// https://github.com/icepeng/loa-calc

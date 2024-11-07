const fetchMaterialPrice = async () => {
  const url = `${process.env.MARKET_URL}`;
  const data = await fetch(url)
    .then(res => res.json())
    .catch(error => {
      console.error("Error in fetchMaterialPrice:", error);
      throw new Error("Failed to fetch material price");
    });
  return data;
};

export const getMaterialPrice = async () => {
  const data = await fetchMaterialPrice().then(res => res.items);
  const material: Record<string, number> = { 골드: 1 };
  for (const item of data) {
    material[item.Name] = item.RecentPrice;
  }

  material["수호석 결정"] = (material["수호석 결정"] ?? 0) / 10;
  material["파괴석 결정"] = (material["파괴석 결정"] ?? 0) / 10;
  material["수호강석"] = (material["수호강석"] ?? 0) / 10;
  material["파괴강석"] = (material["파괴강석"] ?? 0) / 10;
  material["정제된 수호강석"] = (material["정제된 수호강석"] ?? 0) / 10;
  material["정제된 파괴강석"] = (material["정제된 파괴강석"] ?? 0) / 10;
  material["운명의 수호석"] = (material["운명의 수호석"] ?? 0) / 10;
  material["운명의 파괴석"] = (material["운명의 파괴석"] ?? 0) / 10;
  material["운명의 파편 주머니(소)"] =
    (material["운명의 파편 주머니(소)"] ?? 0) / 1000;

  const shardBags = [
    {
      name: "명예의 파편 주머니(소)",
      price: material["명예의 파편 주머니(소)"] / 500,
    },
    {
      name: "명예의 파편 주머니(중)",
      price: material["명예의 파편 주머니(중)"] / 1000,
    },
    {
      name: "명예의 파편 주머니(대)",
      price: material["명예의 파편 주머니(대)"] / 1500,
    },
  ];

  const cheapestBag = shardBags.reduce((prev, curr) =>
    prev.price < curr.price ? prev : curr
  );

  material["명예의 파편"] = cheapestBag.price;

  delete material["명예의 파편 주머니(소)"];
  delete material["명예의 파편 주머니(중)"];
  delete material["명예의 파편 주머니(대)"];

  return material;
};

// This code is based on or references code from loa-calc.
// Original code is licensed under the MIT License.
// Copyright (c) 2021 icepeng
// https://github.com/icepeng/loa-calc

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

export interface Material {
  price: number;
  icon: string;
  name?: string;
}

export const getMaterialPrice = async () => {
  const data = await fetchMaterialPrice().then(res => res.items);
  const material: { [key: string]: Material } = {};
  for (const item of data) {
    material[item.Name] = { price: item.RecentPrice, icon: item.Icon };
  }

  material["수호석 결정"].price = (material["수호석 결정"].price ?? 0) / 10;
  material["파괴석 결정"].price = (material["파괴석 결정"].price ?? 0) / 10;
  material["수호강석"].price = (material["수호강석"].price ?? 0) / 10;
  material["파괴강석"].price = (material["파괴강석"].price ?? 0) / 10;
  material["정제된 수호강석"].price =
    (material["정제된 수호강석"].price ?? 0) / 10;
  material["정제된 파괴강석"].price =
    (material["정제된 파괴강석"].price ?? 0) / 10;
  material["운명의 수호석"].price = (material["운명의 수호석"].price ?? 0) / 10;
  material["운명의 파괴석"].price = (material["운명의 파괴석"].price ?? 0) / 10;
  material["운명의 파편 주머니(소)"].price =
    (material["운명의 파편 주머니(소)"].price ?? 0) / 1000;

  const shardBags = [
    {
      name: "명예의 파편 주머니(소)",
      price: material["명예의 파편 주머니(소)"].price / 500,
      icon: material["명예의 파편 주머니(소)"].icon,
    },
    {
      name: "명예의 파편 주머니(중)",
      price: material["명예의 파편 주머니(중)"].price / 1000,
      icon: material["명예의 파편 주머니(중)"].icon,
    },
    {
      name: "명예의 파편 주머니(대)",
      price: material["명예의 파편 주머니(대)"].price / 1500,
      icon: material["명예의 파편 주머니(대)"].icon,
    },
  ];

  const cheapestBag = shardBags.reduce((prev, curr) =>
    prev.price < curr.price ? prev : curr
  );

  material["명파"] = {
    name: cheapestBag.name,
    price: cheapestBag.price,
    icon: cheapestBag.icon,
  };

  delete material["명예의 파편 주머니(소)"];
  delete material["명예의 파편 주머니(중)"];
  delete material["명예의 파편 주머니(대)"];

  return material;
};

// This code is based on or references code from loa-calc.
// Original code is licensed under the MIT License.
// Copyright (c) 2021 icepeng
// https://github.com/icepeng/loa-calc

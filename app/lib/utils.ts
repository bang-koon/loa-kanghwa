/**
 * Zero out all book prices for boundBook mode
 * Used when users have bound (귀속) books from Mokoko Challenge
 * Note: Using 0.01 instead of 0 because refine.ts filters out items with price <= 0
 */
export const zeroBoundBookPrices = (priceMap: Record<string, number>): Record<string, number> => {
  const modified = { ...priceMap };

  // 일반 재련 책 (Normal Refine books)
  const normalRefineBooks = [
    "야금술기본",
    "야금술응용",
    "야금술심화",
    "야금술숙련",
    "야금술특화",
    "야금술복합",
    "야금술전문",
    "재봉술기본",
    "재봉술응용",
    "재봉술심화",
    "재봉술숙련",
    "재봉술특화",
    "재봉술복합",
    "재봉술전문",
    "야금술업화A",
    "야금술업화B",
    "야금술업화C",
    "재봉술업화A",
    "재봉술업화B",
    "재봉술업화C",
  ];

  // 상급 재련 책 (Advanced Refine books)
  const advancedRefineBooks = [
    "장인의 야금술 : 1단계",
    "장인의 야금술 : 2단계",
    "장인의 재봉술 : 1단계",
    "장인의 재봉술 : 2단계",
  ];

  // 0.01원으로 설정 (0원은 refine.ts에서 필터링됨)
  [...normalRefineBooks, ...advancedRefineBooks].forEach(book => {
    modified[book] = 0.01;
  });

  return modified;
};

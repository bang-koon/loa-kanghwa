export const getEquipmentDetail = async (characterName: string) => {
  const res = await fetch(
    `https://developer-lostark.game.onstove.com/armories/characters/${characterName}/equipment`,
    {
      headers: {
        accept: "application/json",
        authorization: `bearer ${process.env.LOSTARK_API_KEY}`,
      },
    }
  );

  // if (!res.ok) {
  //   throw new Error("데이터를 가져오는 데 실패했습니다.");
  // }
  const data = await res.json();
  return data.slice(0, 6);
};

export const getCharacterLevel = async (characterName: string) => {
  const data = await getEquipmentDetail(characterName);
  const equipments = [];

  const ITEM_LEVEL_REGEX = /아이템 레벨 (\d+) \(티어 (\d+)\)/;
  const ENHANCEMENT_REGEX = /\+(\d+)/;
  const ADVANCED_ENHANCEMENT_REGEX = /(\d+)<\/FONT>단계/;

  for (let obj of data) {
    const tooltip = JSON.parse(obj.Tooltip);
    const parsedObj: any = { type: obj.Type };

    const levelAndTear =
      tooltip.Element_001.value.leftStr2.match(ITEM_LEVEL_REGEX);
    if (levelAndTear) {
      parsedObj.level = parseInt(levelAndTear[1]);
      parsedObj.tear = parseInt(levelAndTear[2]);
    } else {
      console.warn(`아이템 레벨 매칭 실패: ${obj.Name}`);
    }

    const enhancementMatch = obj.Name.match(ENHANCEMENT_REGEX);
    if (enhancementMatch) {
      parsedObj.enhancement = parseInt(enhancementMatch[1]);
    } else {
      console.warn(`강화 매칭 실패: ${obj.Name}`);
    }

    if (typeof tooltip.Element_005.value === "string") {
      const advancedEnhancementMatch = tooltip.Element_005.value.match(
        ADVANCED_ENHANCEMENT_REGEX
      );
      if (advancedEnhancementMatch) {
        parsedObj.advancedEnhancement = parseInt(advancedEnhancementMatch[1]);
      } else {
        console.warn(`고급 강화 매칭 실패: ${obj.Name}`);
      }
    } else {
      parsedObj.advancedEnhancement = 0;
    }

    equipments.push(parsedObj);
  }
  return equipments;
};

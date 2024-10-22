export const fetchCharacterInfo = async (characterName: string) => {
  const res = await fetch(
    `https://developer-lostark.game.onstove.com/armories/characters/${characterName}?filters=profiles+equipment`,
    {
      headers: {
        accept: "application/json",
        authorization: `bearer ${process.env.LOSTARK_API_KEY}`,
      },
    }
  );

  const data = await res.json();
  return data;
};

export const getCharacterInfo = async (characterName: string) => {
  const data = await fetchCharacterInfo(characterName);
  const equipments = [];

  const ITEM_LEVEL_REGEX = /아이템 레벨 (\d+) \(티어 (\d+)\)/;
  const ENHANCEMENT_REGEX = /\+(\d+)/;
  const ADVANCED_ENHANCEMENT_REGEX = /(\d+)<\/FONT>단계/;

  for (let i = 0; i < 6; i++) {
    const tooltip = JSON.parse(data.ArmoryEquipment[i].Tooltip);
    const parsedObj: any = { type: data.ArmoryEquipment[i].Type };

    const levelAndTear =
      tooltip.Element_001.value.leftStr2.match(ITEM_LEVEL_REGEX);
    if (levelAndTear) {
      parsedObj.level = parseInt(levelAndTear[1]);
      parsedObj.tear = parseInt(levelAndTear[2]);
    } else {
      console.warn(`아이템 레벨 매칭 실패: ${data.ArmoryEquipment[i].Name}`);
    }

    const enhancementMatch =
      data.ArmoryEquipment[i].Name.match(ENHANCEMENT_REGEX);
    if (enhancementMatch) {
      parsedObj.enhancement = parseInt(enhancementMatch[1]);
    } else {
      console.warn(`강화 매칭 실패: ${data.ArmoryEquipment[i].Name}`);
    }

    if (typeof tooltip.Element_005.value === "string") {
      const advancedEnhancementMatch = tooltip.Element_005.value.match(
        ADVANCED_ENHANCEMENT_REGEX
      );
      if (advancedEnhancementMatch) {
        parsedObj.advancedEnhancement = parseInt(advancedEnhancementMatch[1]);
      } else {
        console.warn(`고급 강화 매칭 실패: ${data.ArmoryEquipment[i].Name}`);
      }
    } else {
      parsedObj.advancedEnhancement = 0;
    }

    equipments.push(parsedObj);
  }
  return {
    img: data.ArmoryProfile.CharacterImage,
    level: data.ArmoryProfile.ItemMaxLevel,
    equipments,
  };
};

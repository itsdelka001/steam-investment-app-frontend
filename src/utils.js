export const getGameFromItemName = (itemName) => {
    const cs2Keywords = ["case", "sticker", "skin", "glove", "knife", "pin", "key", "capsule", "souvenir", "weapon"];
    const dota2Keywords = ["treasure", "immortal", "arcana", "set", "courier", "chest", "hero"];
    const pubgKeywords = ["crate", "box", "outfit", "skin", "key", "g-coin"];

    const lowerItemName = itemName.toLowerCase();

    if (cs2Keywords.some(keyword => lowerItemName.includes(keyword))) {
        return "CS2";
    }
    if (dota2Keywords.some(keyword => lowerItemName.includes(keyword))) {
        return "Dota 2";
    }
    if (pubgKeywords.some(keyword => lowerItemName.includes(keyword))) {
        return "PUBG";
    }
    return "CS2";
};

export const getNetProfit = (grossProfit, totalValue, commissions) => {
    const totalRate = (commissions || []).reduce((sum, c) => sum + c.rate, 0);
    const totalCommission = totalValue * (totalRate / 100);
    return grossProfit - totalCommission;
};
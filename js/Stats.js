import { clamp } from "./util.js";
function normalizeStats(stats) {
    const modifiedStats = { ...stats };
    for (const stat in modifiedStats) {
        modifiedStats[stat] = Math.round(modifiedStats[stat]);
        modifiedStats[stat] = clamp(modifiedStats[stat], -6, 6);
    }
    return modifiedStats;
}
var Stats;
(function (Stats) {
    let BaseStatsWithoutHP;
    (function (BaseStatsWithoutHP) {
        function createDefault() {
            return {
                attack: 0,
                defense: 0,
                specialAttack: 0,
                specialDefense: 0,
                speed: 0,
            };
        }
        BaseStatsWithoutHP.createDefault = createDefault;
        function normalize(stats) {
            return normalizeStats(stats);
        }
        BaseStatsWithoutHP.normalize = normalize;
    })(BaseStatsWithoutHP = Stats.BaseStatsWithoutHP || (Stats.BaseStatsWithoutHP = {}));
    let BaseStats;
    (function (BaseStats) {
        function createDefault() {
            return {
                hp: 0,
                attack: 0,
                defense: 0,
                specialAttack: 0,
                specialDefense: 0,
                speed: 0,
            };
        }
        BaseStats.createDefault = createDefault;
        function normalize(stats) {
            return normalizeStats(stats);
        }
        BaseStats.normalize = normalize;
    })(BaseStats = Stats.BaseStats || (Stats.BaseStats = {}));
    let CreatureStats;
    (function (CreatureStats) {
        function createDefault() {
            return {
                currentHp: 0,
                hp: 0,
                attack: 0,
                defense: 0,
                specialAttack: 0,
                specialDefense: 0,
                speed: 0,
            };
        }
        CreatureStats.createDefault = createDefault;
        function normalize(stats) {
            return normalizeStats(stats);
        }
        CreatureStats.normalize = normalize;
    })(CreatureStats = Stats.CreatureStats || (Stats.CreatureStats = {}));
    function toDisplayName(stat) {
        if (stat === "currentHp")
            return "Current HP";
        if (stat === "hp")
            return "HP";
        if (stat === "attack")
            return "Attack";
        if (stat === "defense")
            return "Defense";
        if (stat === "specialAttack")
            return "Special Attack";
        if (stat === "specialDefense")
            return "Special Defense";
        return "Speed";
    }
    Stats.toDisplayName = toDisplayName;
    function getStatStageChangeInfoText(displayName, stat, amount) {
        const statDisplayName = toDisplayName(stat);
        if (amount === 1)
            return `${displayName}'s ${statDisplayName} rose!`;
        if (amount === 2)
            return `${displayName}'s ${statDisplayName} rose sharply!`;
        if (amount > 2)
            return `${displayName}'s ${statDisplayName} rose drastically!`;
        if (amount === -1)
            return `${displayName}'s ${statDisplayName} fell!`;
        if (amount === -2)
            return `${displayName}'s ${statDisplayName} harshly fell!`;
        if (amount < -2)
            return `${displayName}'s ${statDisplayName} severely fell!`;
        return null;
    }
    Stats.getStatStageChangeInfoText = getStatStageChangeInfoText;
})(Stats || (Stats = {}));
export default Stats;

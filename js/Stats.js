import { clamp } from "./util.js";
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
        /**
         * @param mode Input 1 to only return positive stats, input -1 to only return negative stats.
         */
        function getOnlyPositiveOrNegative(stats, mode) {
            const onlyPositiveStats = Stats.BaseStatsWithoutHP.createDefault();
            for (const _stat in stats) {
                const stat = _stat;
                if (mode === 1)
                    onlyPositiveStats[stat] = clamp(stats[stat], 0, 6);
                else
                    onlyPositiveStats[stat] = clamp(stats[stat], -6, 0);
            }
            return onlyPositiveStats;
        }
        BaseStatsWithoutHP.getOnlyPositiveOrNegative = getOnlyPositiveOrNegative;
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
    })(CreatureStats = Stats.CreatureStats || (Stats.CreatureStats = {}));
    let AccuracyEvasionStats;
    (function (AccuracyEvasionStats) {
        function createDefault() {
            return {
                accuracy: 0,
                evasion: 0
            };
        }
        AccuracyEvasionStats.createDefault = createDefault;
    })(AccuracyEvasionStats = Stats.AccuracyEvasionStats || (Stats.AccuracyEvasionStats = {}));
    function normalize(stats) {
        const modifiedStats = { ...stats };
        for (const stat in modifiedStats) {
            modifiedStats[stat] = Math.round(modifiedStats[stat]);
            modifiedStats[stat] = clamp(modifiedStats[stat], -6, 6);
        }
        return modifiedStats;
    }
    Stats.normalize = normalize;
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
        if (stat === "accuracy")
            return "Accuracy";
        if (stat === "evasion")
            return "Evasion";
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

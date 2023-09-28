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
})(Stats || (Stats = {}));
export default Stats;

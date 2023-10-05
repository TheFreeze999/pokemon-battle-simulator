class Ability {
    name;
    displayName;
    battleActionModifiers;
    applyPostActionBattleActions;
    constructor(data) {
        this.name = data.name;
        this.displayName = data.displayName;
        this.battleActionModifiers = data.battleActionModifiers ?? [];
        this.applyPostActionBattleActions = data.applyPostActionBattleActions ?? (() => { });
    }
}
export default Ability;

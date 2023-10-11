class Ability {
    name;
    displayName;
    preExecutionModifiers;
    postExecutionModifiers;
    applyPreStartPhaseBattleActions;
    applyFinalPhaseBattleActions;
    constructor(data) {
        this.name = data.name;
        this.displayName = data.displayName;
        this.preExecutionModifiers = data.preExecutionModifiers ?? [];
        this.postExecutionModifiers = data.postExecutionModifiers ?? [];
        this.applyPreStartPhaseBattleActions = data.applyPreStartPhaseBattleActions ?? (() => { });
        this.applyFinalPhaseBattleActions = data.applyFinalPhaseBattleActions ?? (() => { });
    }
}
export default Ability;

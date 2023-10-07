class Ability {
    name;
    displayName;
    preExecutionModifiers;
    postExecutionModifiers;
    applyFinalPhaseBattleActions;
    constructor(data) {
        this.name = data.name;
        this.displayName = data.displayName;
        this.preExecutionModifiers = data.preExecutionModifiers ?? [];
        this.postExecutionModifiers = data.postExecutionModifiers ?? [];
        this.applyFinalPhaseBattleActions = data.applyFinalPhaseBattleActions ?? (() => { });
    }
}
export default Ability;

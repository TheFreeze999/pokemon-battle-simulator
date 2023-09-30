class Ability {
    name;
    displayName;
    battleActionModifiers;
    constructor(data) {
        this.name = data.name;
        this.displayName = data.displayName;
        this.battleActionModifiers = data.battleActionModifiers ?? [];
    }
}
export default Ability;

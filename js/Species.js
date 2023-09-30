class Species {
    name;
    displayName;
    types;
    baseStats;
    constructor(data) {
        this.name = data.name;
        this.displayName = data.displayName;
        this.types = data.types;
        this.baseStats = data.baseStats;
    }
}
export default Species;

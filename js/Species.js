class Species {
    name;
    displayName;
    types;
    baseStats;
    abilities;
    // add available abilities property to the species class
    constructor(data) {
        this.name = data.name;
        this.displayName = data.displayName;
        this.types = data.types;
        this.baseStats = data.baseStats;
        this.abilities = data.abilities;
    }
}
export default Species;

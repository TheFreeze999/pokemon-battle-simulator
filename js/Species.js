class Species {
    name;
    types;
    baseStats;
    constructor(data) {
        this.name = data.name;
        this.types = data.types;
        this.baseStats = data.baseStats;
    }
}
export default Species;

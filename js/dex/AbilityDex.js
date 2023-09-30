import Ability from "../Ability.js";
var AbilityDex;
(function (AbilityDex) {
    AbilityDex.noAbility = new Ability({
        name: "no_ability",
        displayName: "No Ability"
    });
    AbilityDex.overgrow = new Ability({
        name: "overgrow",
        displayName: "Overgrow"
    });
    AbilityDex.blaze = new Ability({
        name: "blaze",
        displayName: "Blaze"
    });
})(AbilityDex || (AbilityDex = {}));
export default AbilityDex;

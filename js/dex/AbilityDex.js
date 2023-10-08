import Ability from "../Ability.js";
var AbilityDex;
(function (AbilityDex) {
    AbilityDex.no_ability = new Ability({
        name: "no_ability",
        displayName: "No Ability"
    });
})(AbilityDex || (AbilityDex = {}));
export default AbilityDex;

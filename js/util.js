export function removeNullAndUndefined(array) {
    return array.filter(elem => elem !== null && elem !== undefined);
}
export function objectClone(object) {
    return { ...object };
}
export function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
export function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function clamp(value, min, max) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}

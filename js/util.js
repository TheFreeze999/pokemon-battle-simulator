export function removeNullAndUndefined(array) {
    return array.filter(elem => elem !== null && elem !== undefined);
}
export function objectClone(object) {
    return { ...object };
}
export async function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    });
}
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

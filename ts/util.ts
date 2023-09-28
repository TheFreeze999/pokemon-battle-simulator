export function removeNullAndUndefined<T>(array: (T | null | undefined)[]) {
	return array.filter(elem => elem !== null && elem !== undefined) as T[];
}

export function objectClone<T extends Record<keyof any, any>>(object: T) {
	return { ...object }
}

export async function delay(ms: number): Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(), ms);
	})
}

export function random(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
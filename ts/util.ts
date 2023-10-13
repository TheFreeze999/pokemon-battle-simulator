export function removeNullAndUndefined<T>(array: (T | null | undefined)[]) {
	return array.filter(elem => elem !== null && elem !== undefined) as T[];
}

export function objectClone<T extends Record<keyof any, any>>(object: T) {
	return { ...object }
}

export async function delay(ms: number): Promise<void> {
	if (ms === 0) return;
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, ms);
	})
}

export function randomInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(value: number, min: number, max: number) {
	if (value < min) return min;
	if (value > max) return max;
	return value;
}

export function mapNumberInRange(number: number, fromRange: [number, number], toRange: [number, number]): number {
	const [fromMin, fromMax] = fromRange
	const [toMin, toMax] = toRange;

	const fromDiff = fromMax - fromMin;
	const toDiff = toMax - toMin;
	if (fromDiff === 0) return number;

	const minDiff = toMin - fromMin;

	return number / fromDiff * toDiff + minDiff;
}

export function randomArrayElement<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * For use with input type datetime-local.
 *
 * @param date `Date` object or ISO date string.
 */
export function toDateTimeLocalString(date: Date | string) {
	const d = typeof date === 'string' ? new Date(date) : date;
	const year = d.getFullYear();
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const day = d.getDate().toString().padStart(2, '0');
	const hours = d.getHours().toString().padStart(2, '0');
	const minutes = d.getMinutes().toString().padStart(2, '0');

	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

import type { Toast, ToastType } from '$lib/types/ticket';

let toasts = $state<Toast[]>([]);

export function getToasts() {
	return toasts;
}

export function showToast(type: ToastType, title: string, message = '', duration = 4000) {
	const toast: Toast = {
		id: crypto.randomUUID(),
		type,
		title,
		message,
		duration
	};
	toasts.push(toast);

	if (duration > 0) {
		setTimeout(() => closeToast(toast.id), duration);
	}
}

export function closeToast(id: string) {
	toasts = toasts.filter((t) => t.id !== id);
}

import api from "../api/axios";

export async function loginService(payload) {
	const res = await api.post("/login", payload);
	return {
		token: res?.data?.token || null,
		user: res?.data?.user || null,
	};
}

export async function registerService(payload) {
	const res = await api.post("/register", payload);
	return res?.data;
}

export function getApiErrorMessage(error, fallbackMessage) {
	return error?.response?.data?.message || fallbackMessage;
}

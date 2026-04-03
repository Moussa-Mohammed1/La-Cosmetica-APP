import api from "../api/axios";

export async function getCategoriesService(params = {}) {
	const res = await api.get("/categories", { params });
	return res?.data;
}

export async function createCategoryService(payload) {
	const res = await api.post("/categories", payload);
	return res?.data;
}

export async function updateCategoryService(id, payload) {
	const res = await api.put(`/categories/${id}`, payload);
	return res?.data;
}

export async function deleteCategoryService(id) {
	const res = await api.delete(`/categories/${id}`);
	return res?.data;
}

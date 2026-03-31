import api from "../api/axios";

export async function getProductsService(params = {}) {
	const res = await api.get("/products", { params });
	return res?.data;
}

export async function getProductDetails(id) {
	const res = await api.get(`/products/${id}`);
	return res?.data;
}


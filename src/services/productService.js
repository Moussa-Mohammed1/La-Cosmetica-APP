import api from "../api/axios";

export async function getProductsService(params = {}) {
	const res = await api.get("/products", { params });
	return res?.data;
}

export async function getProductDetails(slug) {
	const res = await api.get(`/products/${slug}`);
	return res?.data;
}

export async function createProductService(payload) {
    const res = await api.post('/products', payload);
    return res?.data;
}

export async function updateProductService(id,payload) {
    const res = await api.put(`/products/${id}`, payload);
    return res?.data;
}

export async function deleteProductService(id) {
    const res = await api.delete(`/products/${id}`);
    return res?.data;
}
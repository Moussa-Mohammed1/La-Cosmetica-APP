import api from "../api/axios";

export async function orderProductsService(products) {
	const res = await api.post("/orders", { products });
	return res?.data;
}

export async function getPendingOrder() {
	const res = await api.get('/client/orders/pending');
	return res?.data;
}

export async function addItem(payload) {
	const res = await api.post('/order', {payload});
	return res?.data
}
export async function getClientOrdersService(params) {
	const res = await api.get('/orders');
	return res?.data;
}

export async function getOrdersService() {
	const res = await api.get('/client/orders');
	return res?.data;
}
export async function cancelOrderService(id) {
	const res = await api.put(`/orders/${id}/cancel`);
	return res?.data;
}

export async function prepareOrderService(id) {
	const res = await api.put(`/orders/${id}/prepare`);
	return res?.data;
}

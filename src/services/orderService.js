import api from "../api/axios";

export async function orderProductsService(products) {
	const res = await api.post("/orders", { products });
	return res?.data;
}


export async function cancelOrderService(id) {
	const res = await api.put(`/orders/${id}/cancel`);
	return res?.data;
}
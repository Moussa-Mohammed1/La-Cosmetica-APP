
export async function getAdminStatsService() {
	const res = await api.get('/admin/statistics');
	return res?.data;
}
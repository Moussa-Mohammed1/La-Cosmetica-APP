import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStatsService } from "../../services/adminService";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadStats() {
            try {
                setLoading(true);
                setMessage("");
                const data = await getAdminStatsService();
                setStats(data?.data || data || {});
            } catch (error) {
                setMessage(error?.response?.data?.message || "Unable to load admin statistics");
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    const totalSales = useMemo(() => {
        return (
            stats?.totalSales ??
            stats?.total_sales ??
            stats?.sales ??
            0
        );
    }, [stats]);

    const totalOrders = useMemo(() => {
        return (
            stats?.totalOrders ??
            stats?.total_orders ??
            stats?.orders ??
            0
        );
    }, [stats]);

    const popularProducts = useMemo(() => {
        return stats?.popularProducts || stats?.popular_products || [];
    }, [stats]);

    const categories = useMemo(() => {
        return stats?.categoryDistribution || stats?.category_distribution || [];
    }, [stats]);

    const maxCategoryCount = useMemo(() => {
        if (!categories.length) {
            return 1;
        }
        return Math.max(...categories.map((item) => item?.count || item?.products_count || 0), 1);
    }, [categories]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-600">Sales, popular products and categories overview.</p>
                    </div>
                    <Link
                        to="/admin/products"
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Manage Products & Categories
                    </Link>
                </div>

                {message && (
                    <div className="rounded-xl border border-red-300 bg-red-100 p-3 text-sm text-red-700">{message}</div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900">{totalSales} MAD</p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900">{totalOrders}</p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Popular Products</p>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900">{popularProducts.length}</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900">Top Popular Products</h2>
                        {loading ? (
                            <p className="mt-4 text-sm text-gray-500">Loading statistics...</p>
                        ) : !popularProducts.length ? (
                            <p className="mt-4 text-sm text-gray-500">No popular products data.</p>
                        ) : (
                            <ul className="mt-4 space-y-3">
                                {popularProducts.map((item, index) => (
                                    <li key={item?.id || item?.slug || index} className="rounded-xl border border-gray-200 p-3">
                                        <p className="font-semibold text-gray-900">{item?.name || "Unnamed product"}</p>
                                        <p className="text-sm text-gray-500">
                                            Sold: {item?.sold ?? item?.sold_count ?? item?.count ?? 0}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900">Category Distribution</h2>
                        {loading ? (
                            <p className="mt-4 text-sm text-gray-500">Loading statistics...</p>
                        ) : !categories.length ? (
                            <p className="mt-4 text-sm text-gray-500">No category distribution data.</p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {categories.map((item, index) => {
                                    const count = item?.count || item?.products_count || 0;
                                    const width = `${Math.max((count / maxCategoryCount) * 100, 8)}%`;
                                    return (
                                        <div key={item?.id || item?.category || index}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="font-medium text-gray-700">{item?.category || item?.name || "Unknown"}</span>
                                                <span className="text-gray-500">{count}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-gray-200">
                                                <div className="h-2 rounded-full bg-blue-600" style={{ width }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
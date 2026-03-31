import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import ProductDetails from "../../components/ProductDetails";
import { getProductDetails, getProductsService } from "../../services/productService";

export default function ClientProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true);
                setMessage("");
                const data = await getProductsService();
                const productsList = Array.isArray(data) ? data : data?.data || [];
                setProducts(productsList);
            } catch (error) {
                setMessage(error?.response?.data?.message || "Unable to load products");
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    async function handleOpenDetails(product) {
        if (!product?.slug) {
            setMessage("Product slug is missing");
            return;
        }

        setOpenDetails(true);
        setDetailsLoading(true);
        setSelectedProduct(null);

        try {
            const data = await getProductDetails(product.slug);
            setSelectedProduct(data?.data || data);
        } catch (error) {
            setSelectedProduct(null);
            setMessage(error?.response?.data?.message || "Unable to load product details");
        } finally {
            setDetailsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Browse available products and click any item to view detailed information.
                    </p>
                </div>

                {message && (
                    <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="text-sm text-gray-500">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
                        No products available.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product?.id || product?.slug || product?.name}
                                product={product}
                                onClick={handleOpenDetails}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ProductDetails
                product={selectedProduct}
                open={openDetails}
                loading={detailsLoading}
                onClose={() => {
                    setOpenDetails(false);
                    setSelectedProduct(null);
                }}
            />
        </div>
    );
}
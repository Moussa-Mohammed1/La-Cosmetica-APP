import { useEffect, useMemo, useState } from "react";
import {
	createCategoryService,
	deleteCategoryService,
	getCategoriesService,
	updateCategoryService,
} from "../../services/categoryService";
import {
	createProductService,
	deleteProductService,
	getProductsService,
	updateProductService,
} from "../../services/productService";

function toList(data) {
	if (Array.isArray(data)) {
		return data;
	}
	return data?.data || [];
}

export default function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);

	const [categoryModalOpen, setCategoryModalOpen] = useState(false);
	const [productModalOpen, setProductModalOpen] = useState(false);

	const [editingCategory, setEditingCategory] = useState(null);
	const [editingProduct, setEditingProduct] = useState(null);

	const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
	const [productForm, setProductForm] = useState({
		name: "",
		description: "",
		price: "",
		stock: "",
		category_id: "",
		images: [""],
	});

	const maxImagesReached = useMemo(() => productForm.images.length >= 4, [productForm.images.length]);

	useEffect(() => {
		loadAll();
	}, []);

	async function loadAll() {
		try {
			setLoading(true);
			const [productsRes, categoriesRes] = await Promise.all([
				getProductsService(),
				getCategoriesService(),
			]);
			setProducts(toList(productsRes));
			setCategories(toList(categoriesRes));
		} catch (error) {
			setIsError(true);
			setMessage(error?.response?.data?.message || "Failed to load admin data");
		} finally {
			setLoading(false);
		}
	}

	function openCreateCategoryModal() {
		setEditingCategory(null);
		setCategoryForm({ name: "", description: "" });
		setCategoryModalOpen(true);
	}

	function openEditCategoryModal(category) {
		setEditingCategory(category);
		setCategoryForm({
			name: category?.name || "",
			description: category?.description || "",
		});
		setCategoryModalOpen(true);
	}

	function openCreateProductModal() {
		setEditingProduct(null);
		setProductForm({ name: "", description: "", price: "", stock: "", category_id: "", images: [""] });
		setProductModalOpen(true);
	}

	function openEditProductModal(product) {
		const existingImages = Array.isArray(product?.images)
			? product.images
			: product?.image
				? [product.image]
				: [""];

		setEditingProduct(product);
		setProductForm({
			name: product?.name || "",
			description: product?.description || "",
			prix: product?.price?.toString?.() || "",
			stock: (product?.stock || "").toString(),
			category_id: (product?.category_id || product?.category?.id || "").toString(),
			images: existingImages.slice(0, 4),
		});
		setProductModalOpen(true);
	}

	function closeCategoryModal() {
		setCategoryModalOpen(false);
	}

	function closeProductModal() {
		setProductModalOpen(false);
	}

	function addProductImageField() {
		if (maxImagesReached) {
			return;
		}
		setProductForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
	}

	function removeProductImageField(index) {
		setProductForm((prev) => {
			const next = prev.images.filter((_, i) => i !== index);
			return { ...prev, images: next.length ? next : [""] };
		});
	}

	async function handleCategorySubmit(e) {
		e.preventDefault();
		try {
			setMessage("");
			const payload = {
				name: categoryForm.name,
				description: categoryForm.description,
			};

			if (editingCategory?.id) {
				await updateCategoryService(editingCategory.id, payload);
				setIsError(false);
				setMessage("Category updated successfully");
			} else {
				await createCategoryService(payload);
				setIsError(false);
				setMessage("Category created successfully");
			}

			closeCategoryModal();
			await loadAll();
		} catch (error) {
			setIsError(true);
			setMessage(error?.response?.data?.message || "Category action failed");
		}
	}

	async function handleProductSubmit(e) {
		e.preventDefault();
		const cleanImages = productForm.images.map((img) => img.trim()).filter(Boolean);
		if (cleanImages.length > 4) {
			setIsError(true);
			setMessage("You can add a maximum of 4 images per product");
			return;
		}

		try {
			setMessage("");
			const payload = {
				name: productForm.name,
				description: productForm.description,
				prix: Number(productForm.price),
				stock: Number(productForm.stock),
				category_id: Number(productForm.category_id),
				images: cleanImages,
			};

			if (editingProduct?.id) {
				await updateProductService(editingProduct.id, payload);
				setIsError(false);
				setMessage("Product updated successfully");
			} else {
				await createProductService(payload);
				setIsError(false);
				setMessage("Product created successfully");
			}

			closeProductModal();
			await loadAll();
		} catch (error) {
			setIsError(true);
			setMessage(error?.response?.data?.message || "Product action failed");
		}
	}

	async function handleDeleteCategory(id) {
		try {
			await deleteCategoryService(id);
			setIsError(false);
			setMessage("Category deleted successfully");
			await loadAll();
		} catch (error) {
			setIsError(true);
			setMessage(error?.response?.data?.message || "Unable to delete category");
		}
	}

	async function handleDeleteProduct(id) {
		try {
			await deleteProductService(id);
			setIsError(false);
			setMessage("Product deleted successfully");
			await loadAll();
		} catch (error) {
			setIsError(true);
			setMessage(error?.response?.data?.message || "Unable to delete product");
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6 md:p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="text-3xl font-extrabold text-gray-900">Admin Products & Categories</h1>
						<p className="mt-1 text-sm text-gray-600">Create, update and delete categories and products.</p>
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={openCreateCategoryModal}
							className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
						>
							Add Category
						</button>
						<button
							type="button"
							onClick={openCreateProductModal}
							className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
						>
							Add Product
						</button>
					</div>
				</div>

				{message && (
					<div
						className={`rounded-xl p-3 text-sm ${
							isError
								? "border border-red-300 bg-red-100 text-red-700"
								: "border border-green-300 bg-green-100 text-green-700"
						}`}
					>
						{message}
					</div>
				)}

				<div className="grid gap-6 lg:grid-cols-2">
					<section className="rounded-2xl bg-white p-5 shadow-sm">
						<h2 className="text-lg font-bold text-gray-900">Categories</h2>
						{loading ? (
							<p className="mt-4 text-sm text-gray-500">Loading categories...</p>
						) : !categories.length ? (
							<p className="mt-4 text-sm text-gray-500">No categories available.</p>
						) : (
							<div className="mt-4 space-y-3">
								{categories.map((category) => (
									<div key={category?.id || category?.name} className="rounded-xl border border-gray-200 p-3">
										<div className="flex items-start justify-between gap-2">
											<div>
												<p className="font-semibold text-gray-900">{category?.name}</p>
												<p className="text-sm text-gray-500">{category?.description || "No description"}</p>
											</div>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => openEditCategoryModal(category)}
													className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
												>
													Edit
												</button>
												<button
													type="button"
													onClick={() => handleDeleteCategory(category.id)}
													className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</section>

					<section className="rounded-2xl bg-white p-5 shadow-sm">
						<h2 className="text-lg font-bold text-gray-900">Products</h2>
						{loading ? (
							<p className="mt-4 text-sm text-gray-500">Loading products...</p>
						) : !products.length ? (
							<p className="mt-4 text-sm text-gray-500">No products available.</p>
						) : (
							<div className="mt-4 space-y-3">
								{products.map((product) => (
									<div key={product?.id || product?.slug || product?.name} className="rounded-xl border border-gray-200 p-3">
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="font-semibold text-gray-900">{product?.name}</p>
												<p className="text-xs text-gray-500">
													{product?.category?.name || product?.category || "Uncategorized"}
												</p>
												<p className="mt-1 text-sm text-gray-600">{product?.description || "No description"}</p>
												<p className="mt-1 text-sm font-bold text-gray-900">{product?.price} MAD</p>
											</div>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => openEditProductModal(product)}
													className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
												>
													Edit
												</button>
												<button
													type="button"
													onClick={() => handleDeleteProduct(product.id)}
													className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				</div>
			</div>

			{categoryModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeCategoryModal}>
					<div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
						<h3 className="text-lg font-bold text-gray-900">
							{editingCategory ? "Edit Category" : "Add Category"}
						</h3>
						<form className="mt-4 space-y-3" onSubmit={handleCategorySubmit}>
							<input
								value={categoryForm.name}
								onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
								placeholder="Category name"
								className="h-10 w-full rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
								required
							/>
							<textarea
								value={categoryForm.description}
								onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
								placeholder="Description"
								className="min-h-20 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
							/>
							<div className="flex justify-end gap-2">
								<button type="button" onClick={closeCategoryModal} className="rounded-xl bg-gray-100 px-4 py-2 text-sm">
									Cancel
								</button>
								<button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
									{editingCategory ? "Update" : "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{productModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeProductModal}>
					<div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
						<h3 className="text-lg font-bold text-gray-900">
							{editingProduct ? "Edit Product" : "Add Product"}
						</h3>
						<form className="mt-4 space-y-3" onSubmit={handleProductSubmit}>
							<div className="grid gap-3 md:grid-cols-2">
								<input
									value={productForm.name}
									onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
									placeholder="Product name"
									className="h-10 w-full rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
									required
								/>
								<input
									value={productForm.price}
									onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
									placeholder="Price"
									type="number"
									min="0"
									step="0.01"
									className="h-10 w-full rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
									required
								/>
								<input
									value={productForm.stock}
									onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
									placeholder="Stock quantity"
									type="number"
									min="0"
									className="h-10 w-full rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
									required
								/>
							</div>

							<select
								value={productForm.category_id}
								onChange={(e) => setProductForm((prev) => ({ ...prev, category_id: e.target.value }))}
								className="h-10 w-full rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
								required
							>
								<option value="">Select category</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>

							<textarea
								value={productForm.description}
								onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
								placeholder="Description"
								className="min-h-20 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
								required
							/>

							<div className="space-y-2 rounded-xl border border-gray-200 p-3">
								<div className="flex items-center justify-between">
									<p className="text-sm font-semibold text-gray-700">Product Images (max 4)</p>
									<button
										type="button"
										onClick={addProductImageField}
										disabled={maxImagesReached}
										className={`rounded-lg px-3 py-1 text-xs font-semibold ${
											maxImagesReached
												? "cursor-not-allowed bg-gray-200 text-gray-500"
												: "bg-blue-100 text-blue-700"
										}`}
									>
										Add image
									</button>
								</div>
								{productForm.images.map((image, index) => (
									<div key={index} className="flex gap-2">
										<input
											value={image}
											onChange={(e) => {
												const value = e.target.value;
												setProductForm((prev) => ({
													...prev,
													images: prev.images.map((item, i) => (i === index ? value : item)),
												}));
											}}
											placeholder="https://..."
											className="h-10 w-full rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
										/>
										<button
											type="button"
											onClick={() => removeProductImageField(index)}
											className="rounded-lg bg-red-100 px-3 text-xs font-semibold text-red-700"
										>
											Remove
										</button>
									</div>
								))}
							</div>

							<div className="flex justify-end gap-2">
								<button type="button" onClick={closeProductModal} className="rounded-xl bg-gray-100 px-4 py-2 text-sm">
									Cancel
								</button>
								<button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
									{editingProduct ? "Update" : "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

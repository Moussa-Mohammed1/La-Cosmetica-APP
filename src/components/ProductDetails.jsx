export default function ProductDetails({ product, open, onClose, loading }) {
	if (!open) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
			<div
				className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute right-3 top-3 h-8 w-8 rounded-full bg-black/70 text-sm font-bold text-white"
				>
					X
				</button>

				{loading ? (
					<div className="p-8 text-center text-sm text-gray-500">Loading product details...</div>
				) : !product ? (
					<div className="p-8 text-center text-sm text-gray-500">Unable to load product details.</div>
				) : (
					<div className="grid gap-0 md:grid-cols-2">
						<div className="aspect-square bg-gray-100">
							{product?.image ? (
								<img
									src={product.image}
									alt={product?.name || "Product image"}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full items-center justify-center text-sm text-gray-400">
									No image
								</div>
							)}
						</div>

						<div className="space-y-4 p-6">
							<p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
								{product?.category || "Uncategorized"}
							</p>
							<h2 className="text-2xl font-extrabold text-gray-900">{product?.name}</h2>
							<p className="text-sm leading-6 text-gray-600">{product?.description}</p>
							<p className="text-xl font-extrabold text-gray-900">{product?.price} MAD</p>
							{product?.slug && (
								<p className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600">
									Slug: {product.slug}
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

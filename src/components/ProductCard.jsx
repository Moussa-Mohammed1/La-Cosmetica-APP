export default function ProductCard({ product, onClick }) {
	return (
		<button
			type="button"
			onClick={() => onClick(product)}
			className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
		>
			<div className="aspect-4/3 w-full bg-gray-100">
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

			<div className="space-y-2 p-4">
				<p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
					{product?.category || "Uncategorized"}
				</p>
				<h3 className="line-clamp-1 text-lg font-bold text-gray-900">{product?.name}</h3>
				<p className="line-clamp-2 text-sm text-gray-600">{product?.description}</p>
				<p className="text-base font-extrabold text-gray-900">{product?.price} MAD</p>
			</div>
		</button>
	);
}

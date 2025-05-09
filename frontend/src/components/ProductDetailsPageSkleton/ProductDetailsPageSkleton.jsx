
const ProductDetailsPageSkleton = () => {
    return (
        <div className='bg-white p-1 md:p-2 lg:p-4 pb-20 animate-pulse'>
        {/* Breadcrumb Skeleton */}
        <div className="flex mt-2 items-center gap-2 text-xs lg:text-sm text-gray-300">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>

        {/* Main content skeleton */}
        <div className="flex mt-4 gap-2 lg:gap-8 flex-col lg:flex-row">
            {/* Image skeleton */}
            <div className="w-full lg:w-[60%]">
                <div className="bg-gray-300 h-64 lg:h-96 rounded"></div>
            </div>

            {/* Details skeleton */}
            <div className="w-full lg:w-[40%] space-y-4">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-8 bg-gray-300 rounded w-48"></div>
                <div className="h-8 bg-gray-300 rounded w-24"></div>
                <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-gray-300 rounded w-16"></div>
                    <div className="h-8 bg-gray-300 rounded w-16"></div>
                    <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>

                {/* Quantity Skeleton */}
                <div className="mt-6">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="h-8 w-8 bg-gray-300 rounded"></div>
                        <div className="h-8 w-10 bg-gray-300 rounded"></div>
                        <div className="h-8 w-8 bg-gray-300 rounded"></div>
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex items-center gap-3 mt-7">
                    <div className="h-10 w-full bg-gray-300 rounded"></div>
                    <div className="h-10 w-40 bg-gray-300 rounded"></div>
                </div>

                {/* Info Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-4 bg-gray-300 rounded w-48"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
            </div>
        </div>

        {/* Description and Related Products Skeleton */}
        <div className="flex gap-8 flex-col lg:flex-row mt-7">
            <div className="w-full lg:w-[60%] space-y-4">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full lg:w-[40%] grid grid-cols-2 gap-4">
                {new Array(2).fill(0).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-300 rounded"></div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default ProductDetailsPageSkleton;
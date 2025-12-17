import { Skeleton } from '../_components/Skeleton'

export default function Loading() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <Skeleton className="h-12 w-40 rounded-lg" />
            </div>

            <div className="flex gap-4 pb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border border-zinc-800 rounded-xl overflow-hidden p-6 bg-zinc-900/20">
                        <div className="flex justify-between mb-4">
                            <div className="flex gap-4">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <div>
                                    <Skeleton className="h-5 w-32 mb-2" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-20 rounded" />
                        </div>
                        <Skeleton className="h-10 w-full mb-6" />
                        <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

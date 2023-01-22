export function SummaryLoading() {
    return (
        <div
            className="h-full justify-center items-center shadow rounded-md p-4 
                w-full mx-auto"
        >
            <div className="animate-pulse flex space-x-4">
                <div className="flex-1 grid grid-rows-7 grid-flow-row gap-3">
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-70" />
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-70" />
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-70" />
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-70" />
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-70" />
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-70" />
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-70" />
                </div>
            </div>
        </div>
    );
}

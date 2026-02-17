import { Search } from 'lucide-react'

const SearchBar = () => {
    return (
        <>
            <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search products, orders..."
                    className="bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 w-72 focus:ring-4 focus:ring-purple-500/10 transition-all"
                />
            </div>
        </>
    )
}

export default SearchBar
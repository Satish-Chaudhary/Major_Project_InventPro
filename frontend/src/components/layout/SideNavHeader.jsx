import { Link } from "react-router-dom"

const SideNavHeader = ({ name, Package }) => {
    return (
        <>
            <Link
                to='/'
                className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">{name}</span>
            </Link>
        </>
    )
}

export default SideNavHeader
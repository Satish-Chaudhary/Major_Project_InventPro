import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[#050505] flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-x-hidden pt-2">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

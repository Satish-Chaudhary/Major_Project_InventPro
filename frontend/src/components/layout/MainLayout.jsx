import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppDispatch } from '../../redux/hooks';
import { setActiveTab } from '../../redux/slices/uiSlice';

const MainLayout = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const path = location.pathname.split('/')[1];
        if (path) {
            dispatch(setActiveTab(path));
        } else {
            dispatch(setActiveTab('dashboard'));
        }
    }, [location, dispatch]);

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

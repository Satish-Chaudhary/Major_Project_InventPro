import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProductsList from './pages/Products';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import AddPurchaseOrder from './pages/AddPurchaseOrder';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import UserManagement from './pages/UserManagement';
import UserApprovals from './pages/UserApprovals';
import AuditLogs from './pages/AuditLogs';
import Security from './pages/Security';
import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import AdminRegister from './pages/AdminRegister';
import RequestAccess from './pages/RequestAccess';
import ResetPassword from './pages/ResetPassword';
import AddUser from './pages/AddUser';
import AddOrder from './pages/AddOrder';
import OrderDetails from './pages/OrderDetails';
import AddSupplier from './pages/AddSupplier';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoles from './pages/AdminRoles';
import AddRole from './pages/AddRole';
import Unauthorized from './pages/Unauthorized';
import MainLayout from './components/layout/MainLayout';

import { ClipLoader } from 'react-spinners';

const ProtectedRoute = ({ isLoggedIn, user, allowedRoles, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase();

  // Normalize roles to match PERMISSION_MATRIX keys if necessary
  const normalizedRole = role === 'warehouse' ? 'warehouse staff' : role === 'sales' ? 'sales staff' : role;

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
import { serverUrl } from './config/api';

import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchCurrentUser, selectIsAuthenticated, selectUser, selectAuthLoading } from './redux/slices/authSlice';
import { selectModal } from './redux/slices/uiSlice';
import { useEffect } from 'react';

const App = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const authLoading = useAppSelector(selectAuthLoading);
  const productFormModal = useAppSelector(selectModal('productForm'));

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <ClipLoader color='#8b5cf6' size={60} />
        <p className="mt-6 text-slate-500 font-black uppercase tracking-widest text-sm animate-pulse">Initializing System Intelligence...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b', borderRadius: '12px' },
      }} />

      <AddProduct
        isOpen={productFormModal.isOpen}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> :
              <Login />
          }
        />
        <Route path="/register-admin" element={<AdminRegister />} />
        <Route path="/request-access" element={<RequestAccess />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/inventory' element={<ProductsList />} />
          <Route path='/categories' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'warehouse staff']}>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path='/security' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'root']}>
              <Security />
            </ProtectedRoute>
          } />
          <Route path='/audit' element={<AuditLogs />} />
          <Route path='/analytics' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'accountant']}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path='/reports' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'accountant']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path='/orders' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'sales staff']}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path='/suppliers' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'accountant']}>
              <Suppliers />
            </ProtectedRoute>
          } />
          <Route path='/purchase-orders' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'accountant', 'warehouse staff']}>
              <PurchaseOrders />
            </ProtectedRoute>
          } />
          <Route path='/create-po' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'accountant']}>
              <AddPurchaseOrder />
            </ProtectedRoute>
          } />
          <Route path='/settings' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin']}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/users' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path='/approvals' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin']}>
              <UserApprovals />
            </ProtectedRoute>
          } />
          <Route path='/add-category' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager']}>
              <AddCategory />
            </ProtectedRoute>
          } />
          <Route path='/add-user' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin']}>
              <AddUser />
            </ProtectedRoute>
          } />
          <Route path='/add-order' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'sales staff']}>
              <AddOrder />
            </ProtectedRoute>
          } />
          <Route path='/order/:id' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager', 'sales staff', 'warehouse staff']}>
              <OrderDetails />
            </ProtectedRoute>
          } />
          <Route path='/add-supplier' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin', 'manager']}>
              <AddSupplier />
            </ProtectedRoute>
          } />
          <Route path='/admin-dashboard' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path='/roles' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin']}>
              <AdminRoles />
            </ProtectedRoute>
          } />
          <Route path='/add-role' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={['admin']}>
              <AddRole />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;
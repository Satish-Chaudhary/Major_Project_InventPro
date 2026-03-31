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
import RootRegister from './pages/RootRegister';
import RequestAccess from './pages/RequestAccess';
import ResetPassword from './pages/ResetPassword';
import AddUser from './pages/AddUser';
import AddOrder from './pages/AddOrder';
import OrderDetails from './pages/OrderDetails';
import AddSupplier from './pages/AddSupplier';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoles from './pages/AdminRoles';
import AddRole from './pages/AddRole';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoices from './pages/Invoices';
import SalesOrders from './pages/SalesOrders';
import SalesOrderDetails from './pages/SalesOrderDetails';
import Unauthorized from './pages/Unauthorized';
import MainLayout from './components/layout/MainLayout';

import { ClipLoader } from 'react-spinners';
import { ROLES } from './config/permissions';

const ProtectedRoute = ({ isLoggedIn, user, allowedRoles, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase();

  // Root always has full access
  if (role === ROLES.ROOT) {
    return children;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchCurrentUser, selectIsAuthenticated, selectUser, selectAuthLoading } from './redux/slices/authSlice';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { selectModal } from './redux/slices/uiSlice';
import { useEffect } from 'react';

const App = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const authLoading = useAppSelector(selectAuthLoading);
  const productFormModal = useAppSelector(selectModal('productForm'));

  useRealTimeUpdates();

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
        <Route path="/register-root" element={<RootRegister />} />
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
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />

          <Route path='/categories' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE]}>
              <Categories />
            </ProtectedRoute>
          } />

          <Route path='/security' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
              <Security />
            </ProtectedRoute>
          } />

          <Route path='/audit' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
              <AuditLogs />
            </ProtectedRoute>
          } />

          <Route path='/analytics' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.SALES_STAFF]}>
              <Analytics />
            </ProtectedRoute>
          } />

          <Route path='/reports' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.ACCOUNTANT, ROLES.MANAGER]}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path='/invoices' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.ACCOUNTANT, ROLES.MANAGER, ROLES.SALES_STAFF]}>
              <Invoices />
            </ProtectedRoute>
          } />

          <Route path='/sales-orders' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.ACCOUNTANT]}>
              <SalesOrders />
            </ProtectedRoute>
          } />

          <Route path='/orders' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.ACCOUNTANT]}>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path='/suppliers' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT]}>
              <Suppliers />
            </ProtectedRoute>
          } />

          <Route path='/purchase-orders' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE]}>
              <PurchaseOrders />
            </ProtectedRoute>
          } />

          <Route path='/create-po' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT]}>
              <AddPurchaseOrder />
            </ProtectedRoute>
          } />

          <Route path='/settings' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.SALES_STAFF, ROLES.WAREHOUSE, ROLES.STAFF]}>
              <Settings />
            </ProtectedRoute>
          } />

          <Route path='/profile' element={<UserProfile />} />

          <Route path='/users' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
              <UserManagement />
            </ProtectedRoute>
          } />

          <Route path='/approvals' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
              <UserApprovals />
            </ProtectedRoute>
          } />

          <Route path='/add-category' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER]}>
              <AddCategory />
            </ProtectedRoute>
          } />

          <Route path='/add-user' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
              <AddUser />
            </ProtectedRoute>
          } />

          <Route path='/sales-order/:id' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.ACCOUNTANT]}>
              <SalesOrderDetails />
            </ProtectedRoute>
          } />

          <Route path='/add-order' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF]}>
              <AddOrder />
            </ProtectedRoute>
          } />

          <Route path='/order/:id' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.WAREHOUSE, ROLES.ACCOUNTANT]}>
              <OrderDetails />
            </ProtectedRoute>
          } />

          <Route path='/add-supplier' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER]}>
              <AddSupplier />
            </ProtectedRoute>
          } />

          <Route path='/admin-dashboard' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path='/roles' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
              <AdminRoles />
            </ProtectedRoute>
          } />

          <Route path='/add-role' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
              <AddRole />
            </ProtectedRoute>
          } />

          <Route path='/customers' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.ACCOUNTANT]}>
              <Customers />
            </ProtectedRoute>
          } />

          <Route path='/add-customer' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF]}>
              <AddCustomer />
            </ProtectedRoute>
          } />

          <Route path='/edit-customer/:id' element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF]}>
              <AddCustomer />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;
import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalSearch from './components/GlobalSearch';

import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchCurrentUser, selectIsAuthenticated, selectUser, selectAuthLoading } from './redux/slices/authSlice';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { selectModal, closeModal } from './redux/slices/uiSlice';
import { ROLES } from './config/permissions';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const ProductsList = lazy(() => import('./pages/Products'));
const Categories = lazy(() => import('./pages/Categories'));
const Reports = lazy(() => import('./pages/Reports'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Orders = lazy(() => import('./pages/Orders'));
const Suppliers = lazy(() => import('./pages/Suppliers'));
const PurchaseOrders = lazy(() => import('./pages/PurchaseOrders'));
const AddPurchaseOrder = lazy(() => import('./pages/AddPurchaseOrder'));
const Settings = lazy(() => import('./pages/Settings'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const UserApprovals = lazy(() => import('./pages/UserApprovals'));
const AuditLogs = lazy(() => import('./pages/AuditLogs'));
const Security = lazy(() => import('./pages/Security'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const AddCategory = lazy(() => import('./pages/AddCategory'));
const AdminRegister = lazy(() => import('./pages/AdminRegister'));
const RootRegister = lazy(() => import('./pages/RootRegister'));
const RequestAccess = lazy(() => import('./pages/RequestAccess'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AddUser = lazy(() => import('./pages/AddUser'));
const AddOrder = lazy(() => import('./pages/AddOrder'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const AddSupplier = lazy(() => import('./pages/AddSupplier'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminRoles = lazy(() => import('./pages/AdminRoles'));
const AddRole = lazy(() => import('./pages/AddRole'));
const Customers = lazy(() => import('./pages/Customers'));
const AddCustomer = lazy(() => import('./pages/AddCustomer'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Invoices = lazy(() => import('./pages/Invoices'));
const SalesOrders = lazy(() => import('./pages/SalesOrders'));
const SalesOrderDetails = lazy(() => import('./pages/SalesOrderDetails'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const StockMovement = lazy(() => import('./pages/StockMovement'));
const InventoryValuation = lazy(() => import('./pages/InventoryValuation'));
const SalesPerformance = lazy(() => import('./pages/SalesPerformance'));
const VendorPerformance = lazy(() => import('./pages/VendorPerformance'));
const ProfitLoss = lazy(() => import('./pages/ProfitLoss'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'));
const BackupExport = lazy(() => import('./pages/BackupExport'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
    <ClipLoader color='#8b5cf6' size={60} />
    <p className="mt-6 text-slate-500 font-black uppercase tracking-widest text-sm animate-pulse">Loading...</p>
  </div>
);

const App = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const authLoading = useAppSelector(selectAuthLoading);
  const productFormModal = useAppSelector(selectModal('productForm'));
  const searchModal = useAppSelector((state) => state.ui?.modals?.search || { isOpen: false });

  useRealTimeUpdates();
  useKeyboardShortcuts();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (authLoading) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b', borderRadius: '12px' },
      }} />

      <Suspense fallback={<LoadingFallback />}>
        <AddProduct isOpen={productFormModal.isOpen} />

        <GlobalSearch
          isOpen={searchModal.isOpen}
          onClose={() => dispatch(closeModal('search'))}
        />

        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route path="/register-admin" element={<AdminRegister />} />
          <Route path="/register-root" element={<RootRegister />} />
          <Route path="/request-access" element={<RequestAccess />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

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

            <Route path='/stock-movement' element={
              <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE]}>
                <StockMovement />
              </ProtectedRoute>
            } />

            <Route path='/inventory-valuation' element={
              <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT]}>
                <InventoryValuation />
              </ProtectedRoute>
            } />

            <Route path='/sales-performance' element={
              <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT]}>
                <SalesPerformance />
              </ProtectedRoute>
            } />

            <Route path='/vendor-performance' element={
              <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT]}>
                <VendorPerformance />
              </ProtectedRoute>
            } />

            <Route path='/profit-loss' element={
              <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT, ROLES.ACCOUNTANT]}>
                <ProfitLoss />
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

            <Route path='/notification-settings' element={
              <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
                <NotificationSettings />
              </ProtectedRoute>
            } />

            <Route path='/backup-export' element={
              <ProtectedRoute isLoggedIn={isLoggedIn} user={user} allowedRoles={[ROLES.ADMIN, ROLES.ROOT]}>
                <BackupExport />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
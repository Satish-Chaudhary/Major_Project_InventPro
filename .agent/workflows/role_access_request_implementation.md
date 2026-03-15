---
description: How to implement the Role Access Request System in InventPro
---

# Role Access Request System Implementation Workflow

This workflow guides the implementation of the "Role Access Request System" where staff request accounts and admins approve them.

## 1. Database Schema Update
- [x] Modify `backend/models/auth.model.js`.
- [x] Add `role` (enum: staff, manager, accountant).
- [x] Add `status` (enum: pending, active, rejected).
- [x] Create `backend/models/accessRequest.model.js` for dedicated request tracking.

## 2. Backend Controller & Notifications
- [x] Update `backend/controllers/auth.controllers.js`.
- [x] Modify `requestAccess`: Store in both User and AccessRequest collections.
- [x] Implement `backend/utils/email.utils.js` for NodeMailer alerts.
- [x] Send emails to both Applicant and System Admin upon request.
- [x] Update `login`: Return 403 error for pending/rejected users.

## 3. Backend Routing
- [x] Create `backend/routes/admin.routes.js`.
- [x] Register admin routes in `server.js`.
- [x] Add protected endpoints for approvals and status fetching.

## 4. Frontend: Request Access Page
- [x] Modify `frontend/src/pages/RequestAccess.jsx`.
- [x] Add dynamic role selection and password confirmation.
- [x] Connect form to backend with robust error extraction.

## 5. Frontend: Admin Control Center
- [x] Create `frontend/src/pages/AdminDashboard.jsx`.
- [x] Create `frontend/src/pages/AdminRoles.jsx`.
- [x] Update `frontend/src/components/layout/Sidebar.jsx` with full Admin navigation.
- [x] Connect `UserApprovals` to real backend endpoints.

## 6. Verification
- [x] Register new user -> Verify DB entries.
- [x] Check User + Admin email delivery.
- [x] Approve user via dashboard -> Verify status change to 'active'.
- [x] Verify successful login after approval.
- [x] Audit activity logs for tracking correctness.

# InventPro Website Workflow & Connectivity

This document outlines the user flow and connectivity of pages within the InventPro application.

## High-Level Workflow Diagram

```mermaid
graph TD
    %% Start Node
    Start((Start)) --> LoginPage[Login Page]
    
    %% Authentication Flow with Decision Points
    subgraph Auth_Flow [Authentication Workflow]
        LoginPage --> EnterCred[Enter Credentials]
        EnterCred --> ValidateCred{Validate Credentials}
        
        ValidateCred -->|✅ Success| CheckStatus{Check User Status}
        ValidateCred -->|❌ Failure| ShowError[Show Error Message]
        ShowError -->|Retry| EnterCred
        
        CheckStatus -->|✅ Active| CheckRole{Check User Role}
        CheckStatus -->|❌ Inactive| ShowInactive[Account Inactive]
        CheckStatus -->|⏳ Pending| ShowPending[Approval Pending]
        ShowInactive -->|Contact Admin| LoginPage
        ShowPending -->|Wait for Approval| LoginPage
        
        CheckRole -->|Admin| AdminDashboard[Admin Dashboard]
        CheckRole -->|Manager| ManagerDashboard[Manager Dashboard]
        CheckRole -->|Staff| StaffDashboard[Staff Dashboard]
        CheckRole -->|Sales| SalesDashboard[Sales Dashboard]
        CheckRole -->|Accountant| AccountantDashboard[Accountant Dashboard]
    end

    %% Forgot Password Flow with OTP Verification
    subgraph Forgot_Password [Password Reset Workflow]
        LoginPage -->|Forgot Password| ForgotPass[Forgot Password]
        ForgotPass --> EnterEmail[Enter Registered Email]
        EnterEmail --> CheckEmail{Email in System?}
        
        CheckEmail -->|✅ Found| GenerateOTP[Generate 4-digit OTP]
        CheckEmail -->|❌ Not Found| EmailError[Email Not Registered]
        EmailError -->|Try Again| EnterEmail
        
        GenerateOTP --> SendOTP[Send OTP via Email]
        SendOTP --> OTPVerification[Enter OTP]
        OTPVerification --> ValidateOTP{Validate OTP}
        
        ValidateOTP -->|✅ Correct| SetNewPass[Set New Password]
        ValidateOTP -->|❌ Incorrect| OTPError[Invalid OTP]
        OTPError -->|Try Again| OTPVerification
        ValidateOTP -->|⌛ Expired| OTPExpired[OTP Expired]
        OTPExpired -->|Request New| ForgotPass
        
        SetNewPass --> EnterNewPass[Enter New Password]
        EnterNewPass --> ConfirmNewPass[Confirm New Password]
        ConfirmNewPass --> ValidatePass{Passwords Match?}
        
        ValidatePass -->|✅ Yes| UpdatePassword{Update in DB}
        ValidatePass -->|❌ No| PassMismatch[Passwords Don't Match]
        PassMismatch -->|Re-enter| SetNewPass
        
        UpdatePassword -->|✅ Success| PasswordReset[Password Updated ✓]
        UpdatePassword -->|❌ Failure| UpdateError[Database Error]
        UpdateError -->|Retry| UpdatePassword
        
        PasswordReset -->|Redirect to| LoginPage
    end

    %% Enhanced Request Access Flow with Email Notifications
    subgraph Request_Access [Request Access Workflow]
        LoginPage -->|Request Access| RequestForm[Request Access Form]
        RequestForm --> EnterDetails[Enter Name & Email]
        EnterDetails --> CheckUserExists{Check if User Exists}
        
        CheckUserExists -->|✅ Already Exists| UserExistsMsg[User Already Exists]
        CheckUserExists -->|❌ New User| CreatePending[Create Pending Request]
        
        UserExistsMsg -->|Redirect to| LoginPage
        
        CreatePending --> SendAdminEmail[Send Request Email to Admin]
        SendAdminEmail --> SendUserWaiting[Send Waiting Email to User]
        SendUserWaiting --> PendingApproval[Pending Approval Status]
        
        PendingApproval --> AdminReview{Admin Reviews Request}
        
        AdminReview -->|✅ Approve| ApproveRequest[Approve Request]
        AdminReview -->|❌ Reject| RejectRequest[Reject Request]
        
        ApproveRequest --> CreateUserAccount[Create User Account]
        CreateUserAccount --> SendApprovalEmail[Send Approval Email to User]
        SendApprovalEmail --> AccountCreated[Account Created ✓]
        AccountCreated -->|User Can Now Login| LoginPage
        
        RejectRequest --> SendRejectionEmail[Send Rejection Email to User]
        SendRejectionEmail --> RequestDenied[Request Denied]
        RequestDenied -->|Back to| LoginPage
    end

    %% Main Application Operations
    subgraph Operations [Core Operations Flow]
        %% Admin Dashboard Operations
        AdminDashboard --> AdminActions{Select Action}
        AdminActions -->|User Management| UserMgmt[User Management]
        AdminActions -->|Approvals| ApprovalDesk[Approval Desk]
        AdminActions -->|Settings| SysSettings[System Settings]
        AdminActions -->|Analytics| SysAnalytics[System Analytics]
        
        %% Manager Dashboard Operations
        ManagerDashboard --> ManagerActions{Select Action}
        ManagerActions -->|Inventory| InvMgmt[Inventory Management]
        ManagerActions -->|Reports| ViewReports[View Reports]
        ManagerActions -->|Team| TeamOversight[Team Oversight]
        
        %% Staff Dashboard Operations
        StaffDashboard --> StaffActions{Select Action}
        StaffActions -->|Update Stock| StockUpdate[Stock Update]
        StaffActions -->|View Inventory| ViewInv[View Inventory]
        
        %% Sales Dashboard Operations
        SalesDashboard --> SalesActions{Select Action}
        SalesActions -->|Create Order| CreateOrder[New Order]
        SalesActions -->|View Products| BrowseProd[Browse Products]
        SalesActions -->|Sales Metrics| ViewMetrics[View Metrics]
        
        %% Accountant Dashboard Operations
        AccountantDashboard --> AccountantActions{Select Action}
        AccountantActions -->|Financial Reports| FinReports[Generate Reports]
        AccountantActions -->|Audit Trail| ViewAudit[View Audit Log]
        AccountantActions -->|Cost Analysis| CostAnalysis[Cost Analysis]
    end

    %% CRUD Operations with Success/Failure
    subgraph CRUD_Ops [Transaction Workflows]
        %% Add Product Flow
        InvMgmt --> AddProduct[Add Product Form]
        AddProduct --> ValidateProduct{Validate Data}
        ValidateProduct -->|✅ Success| SaveProduct{Save to DB}
        ValidateProduct -->|❌ Failure| ProductError[Show Validation Errors]
        ProductError -->|Fix| AddProduct
        
        SaveProduct -->|✅ Success| ProductSuccess[Product Added ✓]
        SaveProduct -->|❌ Failure| ProductDBError[Database Error]
        ProductDBError -->|Retry| SaveProduct
        
        %% Create Order Flow
        CreateOrder --> SelectItems[Select Products]
        SelectItems --> ValidateStock{Check Stock}
        ValidateStock -->|✅ Available| ProcessOrder{Process Payment}
        ValidateStock -->|❌ Out of Stock| StockAlert[Low Stock Alert]
        StockAlert -->|Adjust Order| SelectItems
        
        ProcessOrder -->|✅ Success| OrderConfirm[Order Confirmed ✓]
        ProcessOrder -->|❌ Failure| PaymentError[Payment Failed]
        PaymentError -->|Try Again| ProcessOrder
        
        %% Approval Flow
        ApprovalDesk --> ViewRequest[View Pending Request]
        ViewRequest --> Decision{Approve or Reject?}
        Decision -->|✅ Approve| AssignRole[Assign Role]
        Decision -->|❌ Reject| RejectReason[Add Rejection Reason]
        
        AssignRole --> SaveAssignment{Save Assignment}
        SaveAssignment -->|✅ Success| NotifyUser[Notify User ✓]
        SaveAssignment -->|❌ Failure| AssignmentError[Save Failed]
        AssignmentError -->|Retry| AssignRole
        
        RejectReason --> SaveRejection{Save Rejection}
        SaveRejection -->|✅ Success| NotifyRejection[Notify User of Rejection]
        SaveRejection -->|❌ Failure| RejectionError[Save Failed]
        RejectionError -->|Retry| RejectReason
    end

    %% Logout Flow
    AdminDashboard -->|Logout| Logout{Confirm Logout?}
    ManagerDashboard -->|Logout| Logout
    StaffDashboard -->|Logout| Logout
    SalesDashboard -->|Logout| Logout
    AccountantDashboard -->|Logout| Logout
    
    Logout -->|✅ Yes| LoginPage
    Logout -->|❌ No| ReturnToDash[Return to Dashboard]

    %% Success Path Connections
    ProductSuccess -->|Continue| InvMgmt
    OrderConfirm -->|Continue| SalesDashboard
    NotifyUser -->|Back to| ApprovalDesk
    NotifyRejection -->|Back to| ApprovalDesk

    %% Styling for Professional Look
    classDef success fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef failure fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef process fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    classDef dashboard fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef terminal fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff
    classDef email fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#fff
    
    class ProductSuccess,OrderConfirm,PasswordReset,AccountCreated,ProductSuccess,NotifyUser success
    class ShowError,ProductError,StockAlert,PaymentError,EmailError,OTPError,OTPExpired,PassMismatch,UpdateError,AssignmentError,RejectionError,UserExistsMsg,RequestDenied failure
    class ValidateCred,CheckStatus,CheckRole,CheckEmail,ValidateOTP,ValidatePass,UpdatePassword,CheckUserExists,AdminReview,SubmitRequest,ValidateProduct,SaveProduct,ValidateStock,ProcessOrder,Decision,SaveAssignment,SaveRejection,Logout decision
    class EnterCred,ShowInactive,ShowPending,EnterEmail,GenerateOTP,SendOTP,OTPVerification,SetNewPass,EnterNewPass,ConfirmNewPass,EnterDetails,CreatePending,SendAdminEmail,SendUserWaiting,PendingApproval,ApproveRequest,RejectRequest,CreateUserAccount,SendApprovalEmail,SendRejectionEmail,UserMgmt,ApprovalDesk,InvMgmt,AddProduct,CreateOrder process
    class AdminDashboard,ManagerDashboard,StaffDashboard,SalesDashboard,AccountantDashboard dashboard
    class Start,LoginPage,PasswordReset,ForgotPass,RequestForm terminal
    class SendAdminEmail,SendUserWaiting,SendApprovalEmail,SendRejectionEmail email
```

## Detailed Connectivity Matrix

| From Page | Action | To Page/Modal | Trigger/Logic |
| :--- | :--- | :--- | :--- |
| **Login** | Enter Credentials | Validate Creds | Frontend form submission |
| **Login** | Forgot Password | Reset Password | Logic: Reset workflow |
| **Login** | Request Access | Request Access | Logic: Onboarding workflow |
| **Login** | Sign In Success | Check Status | Logic: Check for Active/Pending/Inactive |
| **Check Status** | ✅ Active | Check Role | Redirect to appropriate Dashboard |
| **Check Status** | ⏳ Pending | Show Pending | Action: Show "Approval Pending" modal |
| **Check Status** | ❌ Inactive | Show Inactive | Action: Show "Account Inactive" alert |
| **Reset Password**| Enter Email | Generate OTP | Logic: Server-side validation |
| **Reset Password**| Validate OTP | Set New Pass | Logic: 4-digit code match |
| **Request Access** | Submit Request | Pending Approval | Trigger: NodeMailer sends Admin/User emails |
| **Approval Desk** | Review Request | Decision Point | Action: Approve or Reject user |
| **Approval Desk** | ✅ Approve | Assign Role | Logic: User account becomes "Active" |
| **Inventory** | Add Product | Add Product Page | Action: Opens product creation form |
| **Orders** | Create Order | Select Items | Logic: Real-time stock availability check |
| **Dashboards** | Logout | Confirm Logout | Action: JWT destruction & redirect |

## Website Logic & Algorithms

### 1. Advanced Authentication & Status Logic
**Objective**: Ensure only authorized and active personnel can enter the sytem.

*   **Credential Validation**: 
    1. User submits Login form.
    2. Server verifies email/password hash.
    3. **Fail**: Trigger "Invalid Credentials" Toast -> Halt.
*   **Status Lifecycle Check**:
    *   **Active**: Grant JWT -> Identify Role -> Route to specific Dashboard.
    *   **Pending**: Block Login -> Show "Waiting for Admin Approval" feedback.
    *   **Inactive**: Block Login -> Notify user to contact Admin.

### 2. Password Reset (OTP) Algorithm
**Objective**: Secure self-service account recovery.

1.  **Request**: User enters registered email.
2.  **Verification**: System generates a 4-digit OTP; stores with expiry.
3.  **Transmission**: `backend/utils/email.utils.js` sends OTP via NodeMailer.
4.  **Validation**: User enters OTP.
    *   **Correct**: Unlock "Set New Password" fields.
    *   **Incorrect**: Show error; limit attempts to 3.
    *   **Expired**: Force user to restart the flow.
5.  **Completion**: Passwords must match -> Update DB -> Redirect to Login.

### 3. Request Access & Onboarding Workflow
**Objective**: Controlled entry via administrative oversight.

1.  **Submission**: Applicant fills form (Name, Email, Message).
2.  **Duplication Check**: System verifies if Email is already in `Users` or `AccessRequests`.
3.  **Notifications**:
    *   **To Admin**: High-priority "New Access Request" alert.
    *   **To User**: "Request Received - Awaiting Review" confirmation.
4.  **Admin Review**: Admin reviews details in the `Approval Desk`.
    *   **Approval**: Admin assigns a Role -> Status becomes `Active` -> User is notified.
    *   **Rejection**: Admin provides reason -> Request Archived -> User is notified of Denial.

### 4. Transactional Logic (CRUD Workflows)

#### A. Product Creation (Inventory)
1.  **Form Validation**: Check if SKU or Barcode is unique.
2.  **Category Linkage**: If category is new, it must be created before product finalization.
3.  **Stock Threshold**: `lowStockThreshold` set during creation for automated alerts.

#### B. Order Fulfillment (Sales)
1.  **Stock Verification**: Before processing, system checks `initialQty` for each item.
2.  **Payment Processing**: If success, trigger state update.
3.  **Inventory Sync**: Automatically deduct `initialQty` based on order volume.
4.  **Notification**: Trigger "Shortage Alert" if stock drops below threshold post-order.

### 3. Settings & Personalization
*   **Profile**: Update name, bio, and profile picture.
*   **System Settings**: Toggle notifications, change theme preferences, or update business details.

---

## III. Role-Based Feature Workflows

This section defines the specific boundaries and capabilities granted to each user identity by the system administrator.

### Role-Based Permission Hierarchy
The following diagram illustrates how permissions are distributed and inherited across different user archetypes:

```mermaid
graph TD
    %% User Archetype Hierarchy with Clear Role Relationships
    subgraph Roles [User Archetype Hierarchy - RBAC Structure]
        Root((Super Admin))
        
        Root --> Admin((Administrator))
        Admin --> Manager[Manager]
        Manager --> Staff[Warehouse Staff]
        Manager --> Sales[Sales Staff]
        Admin --> Accountant[Accountant]
        
        %% Role Relationships
        Staff -.-> |Reports to| Manager
        Sales -.-> |Reports to| Manager
        Manager -.-> |Reports to| Admin
        Accountant -.-> |Reports to| Admin
    end

    subgraph Admin_Privileges [System Privileges - Level 4]
        direction TB
        U_MGT[👥 User Management<br/>Create/Edit/Delete Users]
        U_APP[✅ Approval Desk<br/>Pending Requests]
        U_AUD[📋 Full Activity Audit<br/>All System Logs]
        S_SET[⚙️ System Settings<br/>Configuration]
    end

    subgraph Operations [Operational Privileges - Level 3]
        direction TB
        I_CRUD[📦 Product CRUD<br/>Full Product Control]
        C_CRUD[🏷️ Category CRUD<br/>Category Management]
        V_MGT[🤝 Vendor Registry<br/>Supplier Management]
        A_VIZ[📊 System Analytics<br/>Dashboard Metrics]
    end

    subgraph Execution [Floor Execution - Level 2]
        direction TB
        S_UPD[📈 Stock Updates<br/>Real-time Inventory]
        O_TRK[🚚 Procurement Tracking<br/>Order Status]
        I_RED[👁️ Inventory Read-Only<br/>View Only Access]
    end

    subgraph Commercial [Commercial Actions - Level 2]
        direction TB
        O_CRT[💰 Create Sales Orders<br/>Process Sales]
        S_MET[📈 Sales Metrics<br/>Performance Data]
        P_SRCH[🔍 Product Discovery<br/>Search & Browse]
    end

    subgraph Financial [Financial Forensics - Level 3]
        direction TB
        R_ADV[📑 Advanced Reports<br/>Custom Reporting]
        C_AUD[💰 Cost Auditing<br/>Financial Analysis]
        O_HIST[📜 Full Order History<br/>Transaction Logs]
    end

    %% Permission Mapping with Clear Access Levels
    %% Solid line = Full Access, Dashed line = Limited/Read-only Access
    
    %% Admin Level Access
    Admin ===>|Full Control| Admin_Privileges
    Admin --->|Manage| Operations
    Admin --->|Oversee| Execution
    Admin --->|Monitor| Commercial
    Admin --->|Review| Financial

    %% Manager Level Access
    Manager --->|Manage| Operations
    Manager --->|Supervise| Execution
    Manager --->|View| Commercial
    Manager -.->|Read-only| Financial

    %% Staff Level Access
    Staff --->|Update| Execution
    Staff -.->|View Only| Commercial
    
    %% Sales Level Access
    Sales --->|Create & View| Commercial
    Sales -.->|Basic View| Execution

    %% Accountant Level Access
    Accountant --->|Full Access| Financial
    Accountant -.->|Read-only| Operations

    %% Cross-Departmental Dependencies
    Operations -.->|Provides Data to| Financial
    Execution -.->|Updates| Operations
    Commercial -.->|Generates Data for| Financial

    %% Legend
    subgraph Legend [Access Level Legend]
        L1[🔵 Solid Line = Full Access]
        L2[⚪ Dashed Line = Limited/Read-only]
        L3[⬆️ Hierarchy Flow = Reports To]
    end

    %% Styling
    style Root fill:#312e81,stroke:#818cf8,stroke-width:3px,color:#fff
    style Admin fill:#4f46e5,stroke:#c7d2fe,stroke-width:2px,color:#fff
    style Manager fill:#0891b2,stroke:#a5f3fc,stroke-width:2px,color:#fff
    style Staff fill:#059669,stroke:#a7f3d0,stroke-width:2px,color:#fff
    style Sales fill:#b45309,stroke:#fed7aa,stroke-width:2px,color:#fff
    style Accountant fill:#7c3aed,stroke:#ddd6fe,stroke-width:2px,color:#fff
    
    style Admin_Privileges fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fff
    style Operations fill:#1e1b4b,stroke:#4f46e5,stroke-width:2px,color:#fff
    style Execution fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff
    style Commercial fill:#92400e,stroke:#f59e0b,stroke-width:2px,color:#fff
    style Financial fill:#451a03,stroke:#fbbf24,stroke-width:2px,color:#fff
    
    style Legend fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#fff
```

### 1. The Administrator (Full Authority - Level 4)
**Objective**: System integrity, global settings, and personnel oversight.
*   **Core Actions**:
    *   **Approval Desk**: Full ownership of the Staff Onboarding lifecycle.
    *   **System Settings**: Configuration of organization details and currencies.
    *   **Audit Trail**: Reviewing the `Activity Stream` for all Level 1-3 actions.
*   **Oversight**: Directly manages the **Manager** and **Accountant** roles.

### 2. The Manager (Operational Lead - Level 3)
**Objective**: Tactical management of inventory, vendors, and team performance.
*   **Core Actions**:
    *   **Team Oversight**: Supervising the **Warehouse Staff** and **Sales Staff**.
    *   **Inventory CRUD**: Full control over product specifications and category data.
    *   **Vendor Registry**: Managing the supplier database and procurement contacts.
*   **Restriction**: No access to System Settings or the Approval Desk.

### 3. Warehouse Staff (Floor Execution - Level 2)
**Objective**: Real-time stock accuracy and procurement reconciliation.
*   **Core Actions**:
    *   **Stock Updates**: Modifying quantities during shipment reception.
    *   **Procurement Tracking**: Viewing order statuses to prepare for arriving stock.
*   **Reports to**: Manager.

### 4. Sales Staff (Commercial Actions - Level 2)
**Objective**: Driving revenue through order creation and product discovery.
*   **Core Actions**:
    *   **New Orders**: Processing sales and checking real-time availability.
    *   **Product Discovery**: Searching the catalog for customer inquiries.
*   **Reports to**: Manager.

### 5. The Accountant (Financial Forensics - Level 3)
**Objective**: Financial auditing, cost analysis, and advanced reporting.
*   **Core Actions**:
    *   **Advanced Reports**: Generating tax-ready financial summaries.
    *   **Cost Auditing**: Reviewing product margins and supplier pricing.
*   **Reports to**: Administrator.

---

## IV. Permission Matrix (Quick Reference)

| Feature | Admin | Manager | Warehouse | Sales | Accountant |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Approve Users** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Delete Products** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Edit Stock Levels** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Create Orders** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **View Profit/Cost** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **System Settings** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Activity Logs** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Technical Flow Summary
1.  **Request**: User interacts with the React Frontend (Vite).
2.  **State Management**: Redux Toolkit manages the global application state and user session.
3.  **Authentication**: Middleware checks for valid JWT stored in a secure cookie.
4.  **Data Fetching**: RTK Query handles all API communications with automated caching and invalidation.
5.  **Action**: Backend (Node/Express) processes business logic and permission enforcement.
6.  **Persistence**: Data is saved/retrieved from MongoDB.
7.  **Feedback**: The UI updates dynamically via Redux selectors and displays real-time Toast notifications.

---

## Design Philosophy
The application follows a **Dark Luxury** aesthetic, utilizing:
- **Primary Colors**: Deep Black (`#050505`), Purple-600, Cyan-600.
- **Glassmorphism**: 40% opacity slates with heavy backdrop blurs.
- **Micro-interactions**: Framer Motion animations for transitions between states.

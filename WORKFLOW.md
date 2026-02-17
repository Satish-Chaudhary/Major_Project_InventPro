# InventPro Website Workflow & Connectivity

This document outlines the user flow and connectivity of pages within the InventPro application.

## High-Level Workflow Diagram

```mermaid
graph TD
    %% Entry Point
    Start((Start)) --> Login[Login Page]

    %% Authentication Flow
    subgraph Auth [Authentication]
        Login -->|Forgot Password| Reset[Reset Password]
        Login -->|No Account| Request[Request Access]
        Reset -->|Back| Login
        Request -->|Back| Login
        Login -->|Login Success| Dashboard[Dashboard]
    end

    %% Main Application Flow
    subgraph App [Main Application]
        Dashboard -->|Sidebar Nav| Inv[Inventory/Products]
        Dashboard -->|Sidebar Nav| Cat[Categories]
        Dashboard -->|Sidebar Nav| Ana[Analytics]
        Dashboard -->|Sidebar Nav| Rep[Reports]
        Dashboard -->|Sidebar Nav| Ord[Orders]
        Dashboard -->|Sidebar Nav| Sup[Suppliers]
        Dashboard -->|Sidebar Nav| Users[User Management]
        Dashboard -->|Sidebar Nav| Sett[Settings]
        Dashboard -->|Sidebar Nav| Prof[User Profile]

        %% Sub-pages & Modals
        Inv -->|Header Action| AddProd[Add Product Modal]
        Cat -->|Add Action| AddCat[Add Category Page]
        Users -->|Add Action| AddUser[Add User Page]
        
        %% Global Header
        Header[Global Header] -.->|Global Add| AddProd
    end

    %% Logout
    App -->|Logout| Login
```

## Detailed Connectivity Matrix

| From Page | Action | To Page/Modal |
| :--- | :--- | :--- |
| **Login** | Sign In | Dashboard |
| **Login** | Forgot Password | Reset Password |
| **Login** | Request Access | Request Access |
| **Sidebar** | Navigation | Any Main Page |
| **Header** | Add Button (+) | Add Product (Modal) |
| **Categories** | Add Category | Add Category (Page/State) |
| **User Management** | Add User | Add User (Page/State) |
| **Add Product** | Close / Save | Inventory |

## Design Philosophy
The application follows a **Dark Luxury** aesthetic, utilizing:
- **Primary Colors**: Deep Black (`#050505`), Purple-600, Cyan-600.
- **Glassmorphism**: 40% opacity slates with heavy backdrop blurs.
- **Micro-interactions**: Framer Motion animations for transitions between states.

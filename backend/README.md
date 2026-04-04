# 🏛️ FinDash: Enterprise-Grade Finance Analytics Backend

> **Advanced Financial Insights | Secure Role-Based Access | Scalable API Architecture**

🔗 **GitHub Repository**: [https://github.com/Tanmay24-ya/FinDash](https://github.com/Tanmay24-ya/FinDash)

FinDash is a high-performance, secure, and analytically-driven backend engineered to power modern professional financial dashboards. This system provides a robust infrastructure for wealth tracking, multi-tier user management, and deep-dive financial analytics, all while maintaining strict data integrity and a consistent developer experience.

---

## 💎 Project Highlights & Vision

This backend is designed with **scalability** and **security** at its core. It isn't just about storing numbers; it's about providing a **reliable financial intelligence layer**.

*   🏗️ **Modular Controller-Route-Service Architecture**: Engineered for maintainability and easy expansion.
*   📉 **Smart Analytics Engine**: Computes high-level summaries, monthly trends, and expense-to-income ratios on the fly.
*   🛡️ **Pro-Grade Security**: JWT-based authentication combined with a hierarchical **Role-Based Access Control (RBAC)** system.
*   🧹 **Soft Delete Implementation**: Protects audit trails by flagging data as `isDeleted` instead of permanent deletion.
*   🔍 **Advanced Query Support**: Includes case-insensitive search, multi-field filtering, and server-side pagination with full metadata.
*   ✅ **Strict Schema Enforcement**: Every single byte entering the system is validated via **Zod** schemas.
*   🚦 **Centralized Error Ecosystem**: Consistent error handling ensuring no server-side stack traces are exposed to users.

---

## 🏛️ System Architecture Deep-Dive

To ensure top-tier performance and safety, FinDash implements a battle-tested request lifecycle:

```text
  [ CLIENT REQUEST ]
         ↓
  [ EXPRESS ROUTER ]
         ↓
  [ INPUT VALIDATION ] → (Zod) Prevents malformed data from touching the database.
         ↓
  [ AUTHENTICATION ]   → (JWT) Verified using process.env.JWT_SECRET.
         ↓
  [ AUTHORIZATION ]    → (RBAC Middleware) Validates if (Admin/Analyst/Viewer) can proceed.
         ↓
  [ CONTROLLER LAYER ] → Orchestrates request/response logic.
         ↓
  [ PRISMA ORM ]       → Provides type-safe and optimized access to PostgreSQL.
         ↓
  [ POSTGRESQL (NEON) ]→ ACID compliant storage with high availability.
```

---

## 🚀 The Tech Stack: Why These Choices?

| Technology | Purpose | Our Reasoning |
| :--- | :--- | :--- |
| **Node.js & Express** | Server Engine | Exceptionally fast for I/O bound financial operations. |
| **PostgreSQL** | Database | Crucial for financial data where relational integrity and ACID compliance are non-negotiable. |
| **Prisma** | ORM | Replaces manual SQL with a type-safe, human-readable client. |
| **Zod** | Validation | Guarantees that "Amount" is always a positive number and "Category" is never empty. |
| **JWT** | Auth | Allows for stateless authentication, perfect for distributed dashboard systems. |
| **Bcryptjs** | Security | Current industry gold-standard for hashing passwords securely. |

---

## 🔐 Role-Based Access Control (RBAC) Explained

To mirror a real-world financial firm, we implement three distinct permission levels:

| Role | Description | Permissions |
| :--- | :--- | :--- |
| **VIEWER** | Read-only access for executives/observers. | Can view dashboard summaries and records only. |
| **ANALYST** | Data entry and management role. | Can Create/Read/Update records but cannot delete. |
| **ADMIN** | Full system administrator. | Can manage users, edit all data, and perform deletions. |

---

## 📡 Detailed API Reference (Standardized Format)

Every single response from the FinDash API follows the same, predictable success wrapper:
`{ "success": true, "data": { ... }, "message"?: "..." }`

### 🔑 1. Authentication (Public)
*   `POST /api/auth/register`: Create a new user account.
*   `POST /api/auth/login`: Authenticate and receive a 7-day JWT access token.

### 📊 2. Records Management (Protected)
*   `GET /api/records`: Fetch transactions with integrated filters.
    - **Pagination**: `?page=1&limit=10`
    - **Global Search**: `?search=freelance` (Scans category/notes case-insensitively).
    - **Filtering**: `?type=INCOME&category=Food`
*   `POST /api/records`: Analysts/Admins can add new entries.
*   `PUT /api/records/:id`: Update existing records (Owner-matching logic applied).
*   `DELETE /api/records/:id`: Admin-only soft delete.

### 📈 3. Dashboard Summary (Analytics Engine)
*   `GET /api/dashboard/summary`: Computes aggregate data on-the-fly.
    - Includes: Net Balance, Total Income, Total Expenses.
    - Features: Monthly trend mapping (Income vs Expense over time).
    - Features: Data-rich category breakdown for charts.

---

## 🧪 Advanced Features: How They Work (Algorithms)

### 📊 The Analytics Engine
Our engine doesn't just pull data; it **interprets** it. When calling `/summary`, the system:
1.  Fetches all non-deleted records for the specific user.
2.  Iterates through them once (O(n) efficiency) to calculate totals.
3.  Maps transactions into a **Category Object** for localized breakdown.
4.  Groups transactions into a **Time Series** (Monthly trends) by formatting dates.
5.  Returns a structured payload ready for Frontend Charts (like Recharts or Chart.js).

### 🔍 Optimized Global Search
The search function implements **ILike** behavior (Case-Insensitive contains). If you search for `"food"`, it will correctly find records with category `"Food"`, `"food"`, or `"Street Food"`.

### 🧹 Consistent Soft Delete
When a record is deleted, we set `isDeleted: true`. **Crucially**, all other logic (Analytics, Pagination, Filters) includes `isDeleted: false` in their Prisma queries. This ensures deleted data is **never** counted in your balance, but it's still there in the database for auditing and recovery.

---

## 📡 API Testing & Examples (The Postman Guide)

### 🔑 1. User Registration
**Request Body (JSON)**:
```json
{
  "name": "Jane Admin",
  "email": "jane@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```
**Expected Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "id": "uuid", "name": "Jane Admin", "role": "ADMIN" }
}
```

### 📈 2. Fetch Aggregated Statistics
**Request**: `GET /api/dashboard/summary` (With Bearer Token)
**Response Highlights**:
```json
{
  "success": true,
  "data": {
    "summary": { "totalIncome": 5000, "totalExpense": 200, "balance": 4800 },
    "categoryBreakdown": [ { "category": "Food", "income": 0, "expense": 200 } ],
    "monthlyTrends": [ { "month": "Apr 2026", "income": 5000, "expense": 200 } ]
  }
}
```

### 📄 3. Paginated Transaction List
**Request**: `GET /api/records?page=1&limit=5`
**Response**:
```json
{
  "success": true,
  "data": [ ...5 items... ],
  "pagination": { "totalCount": 24, "totalPages": 5, "currentPage": 1 }
}
```

---

## ⚠️ Robust Error & Edge Case Handling

*   **Concurrency Safe**: Uses Prisma for transaction-safe operations.
*   **Case Sensitivity**: All categories are case-normalized during searching.
*   **Data Integrity**: Zod prevents negative transaction amounts from being created.
*   **Role Protection**: If a Viewer tries to `POST` a record, they receive an immediate `403 Forbidden` with a clear message.
*   **Soft Delete Awareness**: Deleted users cannot log in, and deleted records never show up in calculations.

---

## ⚙️ Configuration & One-Minute Setup

### 1. Database Provisioning
FinDash is designed for **PostgreSQL**. Ensure your `DATABASE_URL` is configured in `.env`.

### 2. Environment Variables (`.env`)
```env
PORT=5000
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your_deep_secret_key"
```

### 3. Quickstart Commands
```bash
# Install dependencies
npm install

# Run database migrations (Sync Schema)
npx prisma migrate dev --name init_system

# Start the optimized dev server
npm run dev
```

---

## 🎓 Design Philosophy: Why FinDash?

FinDash was built not just to store data, but to **empower users with information**. By leveraging structured schemas and role-based guardrails, it provides a "Zero Trust" security model where only authorized users can access specific analytics. It simplifies complex financial reporting into a series of highly efficient, standardized JSON responses.

---

## 🔮 Future Roadmap
*   **PDF/CSV Export**: Generate financial reports dynamically.
*   **Webhook notifications**: Alert users on anomalous high-expense records.
*   **Refresh Tokens**: Improved session management for mobile clients.
*   **Multi-Currency Engine**: Localized currency conversion on the fly.

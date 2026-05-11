# Personal Finance & Budget Tracking Application

## Overview
A full-stack web application designed to help users track their income, expenses, budgets, and financial insights through a beautiful, data-driven dashboard. Built using React (Vite) and Node.js with MongoDB.

## Features
- **User Authentication**: Secure register and login.
- **Transactions**: Add, edit, and delete income and expense records.
- **Budgets**: Set category-based monthly budgets and track spending progress.
- **Categories**: Custom categories for income and expenses.
- **Dashboard**: Visual insights with charts and key metrics.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)

### 1. Database
Ensure your MongoDB is running on `mongodb://localhost:27017` or configure the `.env` file in the backend.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deliverables
- **GitHub Repository**: [GitHub Link Placeholder]
- **Presentation**: [Google Slides Link Placeholder]
- **Video Explanation / Demo**: [Google Drive Link Placeholder]
- **ER Diagram**:
  ```mermaid
  erDiagram
      USER ||--o{ TRANSACTION : "creates"
      USER ||--o{ CATEGORY : "creates"
      USER ||--o{ BUDGET : "creates"
      
      USER {
          ObjectId _id PK
          String name
          String email
          String password
          Date createdAt
      }
      
      TRANSACTION {
          ObjectId _id PK
          ObjectId user FK
          String title
          Number amount
          String category
          String type "Income / Expense"
          Date date
          String note
      }
      
      CATEGORY {
          ObjectId _id PK
          ObjectId user FK
          String name
          String type "Income / Expense"
      }
      
      BUDGET {
          ObjectId _id PK
          ObjectId user FK
          String category
          Number amount
          String period
      }
  ```
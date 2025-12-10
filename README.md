# RetailRx - Pharmacy Management System

<div align="center">

![RetailRx Logo](https://img.shields.io/badge/RetailRx-Pharmacy%20Management-teal?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTkgMTEgMyAzTDIyIDR2MTBhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJWNmEyIDIgMCAwIDEgMi0yaDE2Ii8+PC9zdmc+)

[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A comprehensive, modern pharmacy management system built with React, TypeScript, and Supabase.**

[Features](#-features) • [Installation](#-installation) • [Configuration](#-configuration) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running Locally](#-running-locally)
- [Building for Production](#-building-for-production)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏥 Overview

RetailRx is a full-featured pharmacy management system designed to streamline pharmacy operations, from inventory management to prescription processing. Built with modern web technologies, it provides a responsive, intuitive interface for pharmacists, cashiers, and administrators.

### Key Highlights

- **Real-time Inventory Tracking** - Monitor stock levels, expiration dates, and automated reordering
- **Prescription Management** - Complete workflow from e-prescribing to verification and dispensing
- **Customer Portal** - Self-service features for customers to manage prescriptions and appointments
- **Multi-location Support** - Manage inventory across multiple pharmacy locations
- **Compliance Tracking** - Built-in tools for regulatory compliance and audit trails
- **Advanced Analytics** - Comprehensive reporting and sales analytics

---

## ✨ Features

### Inventory Management
- 📦 Real-time inventory tracking with barcode scanning
- ⏰ Automated expiration monitoring and alerts
- 🔄 Automated reorder system with configurable thresholds
- 📊 Inventory forecasting and demand prediction
- 🏪 Multi-location inventory management
- 🚚 Inter-location inventory transfers

### Prescription Processing
- 📝 E-prescribing integration
- ✅ Prescription verification workflow
- 💊 Drug interaction checking
- 📋 Patient medication history
- 🔍 Prescription audit trail
- 🔄 Automated refill management

### Customer Management
- 👥 Customer profiles and history
- 🎁 Loyalty program management
- 🏥 Insurance claims processing
- 📱 Customer self-service portal
- 📅 Appointment booking system
- 💬 In-app messaging

### Point of Sale
- 💳 Integrated POS system
- 📊 Transaction history
- 🧾 Receipt generation
- 💰 Multiple payment methods

### Analytics & Reporting
- 📈 Sales analytics dashboard
- 📊 Supplier analytics
- 📉 Inventory forecasting
- 📋 Custom report generation
- 🔔 Automated alerts and notifications

### Administration
- 👤 User management with role-based access
- 🏢 Location management
- 📧 Email notification system
- 🔐 Secure authentication

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State Management** | React Context, TanStack Query |
| **Routing** | React Router v6 |
| **Build Tool** | Vite |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Charts** | Recharts |
| **Forms** | React Hook Form, Zod |
| **Icons** | Lucide React |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** - [Sign up](https://supabase.com/) (for database)

### Verify Installation

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be v9.0.0 or higher
git --version     # Any recent version
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/YOUR_USERNAME/retailrx-pharmacy.git

# Or clone via SSH
git clone git@github.com:YOUR_USERNAME/retailrx-pharmacy.git

# Navigate to project directory
cd retailrx-pharmacy
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### Step 3: Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ⚙️ Configuration

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Click "New Project"
   - Enter project details and wait for setup to complete

2. **Get Your API Keys**
   - Navigate to Project Settings → API
   - Copy the `Project URL` and `anon/public` key
   - Add these to your `.env` file

3. **Update Supabase Client**
   
   Edit `src/lib/supabase.ts`:
   
   ```typescript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```

---

## 🗄️ Database Setup

### Run Database Migrations

Execute the following SQL in your Supabase SQL Editor to create the required tables:

#### 1. User Profiles Table

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'cashier' CHECK (role IN ('admin', 'pharmacist', 'cashier')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger for new user profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'cashier')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

#### 2. Inventory Table

```sql
-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  category TEXT,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 10,
  max_quantity INTEGER DEFAULT 100,
  unit_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  supplier_id UUID,
  location_id UUID,
  expiration_date DATE,
  batch_number TEXT,
  requires_prescription BOOLEAN DEFAULT false,
  controlled_substance BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view inventory" ON inventory
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can manage inventory" ON inventory
  FOR ALL TO authenticated USING (true);
```

#### 3. Customers Table

```sql
-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  insurance_provider TEXT,
  insurance_id TEXT,
  allergies TEXT[],
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage customers" ON customers
  FOR ALL TO authenticated USING (true);
```

#### 4. Prescriptions Table

```sql
-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  prescriber_name TEXT NOT NULL,
  prescriber_npi TEXT,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  quantity INTEGER,
  refills_remaining INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'dispensed', 'rejected', 'expired')),
  verified_by UUID REFERENCES user_profiles(id),
  dispensed_by UUID REFERENCES user_profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage prescriptions" ON prescriptions
  FOR ALL TO authenticated USING (true);
```

#### 5. Transactions Table

```sql
-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  user_id UUID REFERENCES user_profiles(id),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'completed',
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage transactions" ON transactions
  FOR ALL TO authenticated USING (true);
```

#### 6. Suppliers Table

```sql
-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT,
  lead_time_days INTEGER DEFAULT 7,
  rating DECIMAL(2,1),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage suppliers" ON suppliers
  FOR ALL TO authenticated USING (true);
```

#### 7. Locations Table

```sql
-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  manager_id UUID REFERENCES user_profiles(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view locations" ON locations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage locations" ON locations
  FOR ALL TO authenticated USING (true);
```

---

## 🏃 Running Locally

### Development Server

```bash
# Start the development server
npm run dev

# Or with yarn
yarn dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview the production build locally
npm run preview
```

The build output will be in the `dist/` directory.

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add your Supabase credentials

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/retailrx-pharmacy",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/retailrx-pharmacy/',
     // ... rest of config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run**
   ```bash
   docker build -t retailrx .
   docker run -p 80:80 retailrx
   ```

---

## 📁 Project Structure

```
retailrx-pharmacy/
├── public/                 # Static assets
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AppLayout.tsx  # Main layout component
│   │   ├── Dashboard.tsx  # Dashboard view
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   └── ...            # Feature components
│   ├── contexts/          # React contexts
│   │   ├── AppContext.tsx
│   │   └── AuthContext.tsx
│   ├── data/              # Static data
│   │   └── inventory.ts
│   ├── hooks/             # Custom hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/               # Utilities
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── Profile.tsx
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment template
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 👥 User Roles

RetailRx supports three user roles with different permissions:

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features including user management, locations, and system settings |
| **Pharmacist** | Access to inventory, prescriptions, customers, analytics, and most operational features |
| **Cashier** | Limited access to POS, customer lookup, and basic inventory viewing |

### Role-Based Access Control

Features are automatically shown/hidden based on user role. The sidebar menu adapts to display only accessible features for each role.

---

## 📚 API Documentation

### Supabase Tables

| Table | Description |
|-------|-------------|
| `user_profiles` | User account information and roles |
| `inventory` | Medication and product inventory |
| `customers` | Customer information and history |
| `prescriptions` | Prescription records and status |
| `transactions` | Sales and transaction records |
| `suppliers` | Supplier information |
| `locations` | Pharmacy location data |

### Authentication

RetailRx uses Supabase Auth for authentication:

```typescript
// Sign in
await supabase.auth.signInWithPassword({ email, password });

// Sign up
await supabase.auth.signUp({ email, password, options: { data: { full_name, role } } });

// Sign out
await supabase.auth.signOut();
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint` before committing
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Supabase](https://supabase.com/) - Backend & Database
- [Vite](https://vitejs.dev/) - Build Tool
- [Lucide](https://lucide.dev/) - Icons

---

<div align="center">

**Built with ❤️ by the RetailRx Team**

[Report Bug](https://github.com/YOUR_USERNAME/retailrx-pharmacy/issues) • [Request Feature](https://github.com/YOUR_USERNAME/retailrx-pharmacy/issues)

</div>

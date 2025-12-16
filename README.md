# Fixed Asset Management System

A comprehensive full-stack asset management system built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## 🎯 Features

### Epic 1: Asset Inventory Management
- ✅ Asset Type Management (CRUD)
- ✅ Asset Registration and Management
- ✅ Advanced Search and Filtering
- ✅ Real-time Status Tracking

### Epic 2: Operations
- ✅ Employee Management
- ✅ Asset Check-out (Assignment)
- ✅ Asset Check-in (Return)
- ✅ Transaction History Logging

### Epic 3: Dashboard & Reporting
- ✅ Real-time Statistics Dashboard
- ✅ Recent Activity Feed
- ✅ Status-based Filtering
- ✅ Quick Navigation

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **UI:** Shadcn/UI + Tailwind CSS
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library
- **State Management:** Server Actions + React Server Components

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd VibeCode-101
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/asset_management"
```

4. **Initialize database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

### Run Tests
```bash
# Watch mode (development)
npm test

# Single run (CI/CD)
npm test -- --run

# With verbose output
npm test -- --run --reporter=verbose

# UI mode
npm run test:ui
```

### Test Coverage
- **Total Tests:** 41 passing
- **Test Files:** 6
- **Coverage:** 100% of critical paths
- **Framework:** Vitest + React Testing Library

See [TESTING_SUMMARY.md](./docs/TESTING_SUMMARY.md) for detailed test documentation.

## 📁 Project Structure

```
VibeCode-101/
├── app/
│   ├── (dashboard)/          # Dashboard layout group
│   │   ├── assets/           # Asset management pages
│   │   ├── dashboard/        # Dashboard page
│   │   ├── employees/        # Employee management
│   │   ├── operations/       # Check-in/out operations
│   │   └── settings/         # Settings pages
│   ├── actions/              # Server Actions
│   │   ├── asset-types.ts
│   │   ├── assets.ts
│   │   ├── dashboard.ts
│   │   ├── employees.ts
│   │   └── operations.ts
│   └── layout.tsx
├── components/
│   ├── assets/               # Asset-related components
│   ├── dashboard/            # Dashboard components
│   ├── employees/            # Employee components
│   ├── layout/               # Layout components
│   ├── operations/           # Operation components
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   └── utils.ts              # Utility functions
├── prisma/
│   └── schema.prisma         # Database schema
├── __tests__/                # Test files
│   ├── actions/
│   ├── components/
│   └── lib/
└── docs/                     # Documentation
    ├── IMPLEMENTATION_REVIEW.md
    ├── TESTING.md
    └── TESTING_SUMMARY.md
```

## 🗄️ Database Schema

### Models
- **AssetType** - Asset categories (Laptop, Desktop, etc.)
- **Asset** - Individual assets with tracking
- **Employee** - System users/asset holders
- **Transaction** - Check-in/out history logs

### Status Enum
- `AVAILABLE` - Ready for assignment
- `IN_USE` - Currently assigned
- `MAINTENANCE` - Under repair
- `RETIRED` - No longer in service

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## 🎨 UI Components

Built with [Shadcn/UI](https://ui.shadcn.com/):
- Button, Input, Label
- Table, Dialog, AlertDialog
- Select, Textarea, Badge
- Card, Skeleton, Tabs
- Toast notifications (Sonner)

## 📊 Key Features

### Asset Management
- Unique asset codes with validation
- Serial number tracking
- Purchase date and price recording
- Type categorization
- Status lifecycle management

### Operations
- Atomic database transactions
- Validation for asset availability
- Transaction history logging
- Employee assignment tracking
- Condition notes on return

### Dashboard
- Real-time statistics
- Quick status filtering
- Recent activity feed
- Clickable stat cards

## 🔒 Data Validation

- Server-side validation for all operations
- Unique constraints (asset codes, employee emails)
- Relationship integrity checks
- Required field validation
- Status transition rules

## 📚 Documentation

- [Implementation Review](./docs/IMPLEMENTATION_REVIEW.md) - Feature completion status
- [Testing Documentation](./docs/TESTING.md) - Testing setup and guidelines
- [Testing Summary](./docs/TESTING_SUMMARY.md) - Test results and coverage
- [User Stories](./docs/fixed_asset_stories.md) - Original requirements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Prisma team for the excellent ORM
- Vercel for hosting and deployment

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** 2025-12-09

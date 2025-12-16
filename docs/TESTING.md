# Testing Documentation

## Test Framework: Vitest

### Setup
- **Framework**: Vitest
- **UI Testing**: @testing-library/react
- **Environment**: jsdom
- **Coverage**: v8

### Test Scripts
```bash
npm test              # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

### Test Structure

```
__tests__/
├── lib/
│   └── utils.test.ts                    # Utility function tests
├── components/
│   └── dashboard/
│       ├── stat-card.test.tsx           # StatCard component tests
│       └── recent-activity.test.tsx     # RecentActivity component tests
└── actions/
    ├── dashboard.test.ts                # Dashboard server actions
    ├── asset-types.test.ts              # Asset type CRUD actions
    └── operations.test.ts               # Check-in/out operations
```

## Test Coverage

### Unit Tests

#### 1. Utility Functions (`lib/utils.test.ts`)
- ✅ `cn()` class name merging
- ✅ Conditional class handling
- ✅ Falsy value filtering
- ✅ Empty input handling

#### 2. Dashboard Components

**StatCard (`components/dashboard/stat-card.test.tsx`)**
- ✅ Basic rendering with props
- ✅ Optional description handling
- ✅ Link functionality
- ✅ Color variant application
- ✅ Icon rendering by name
- ✅ Default icon fallback
- ✅ Zero value display

**RecentActivity (`components/dashboard/recent-activity.test.tsx`)**
- ✅ Transaction list rendering
- ✅ CHECK_OUT badge display
- ✅ CHECK_IN badge display
- ✅ Asset type badges
- ✅ Relative time formatting
- ✅ Empty state handling
- ✅ Table headers

#### 3. Server Actions

**Dashboard Actions (`actions/dashboard.test.ts`)**
- ✅ `getDashboardStats()` - Returns correct statistics
- ✅ `getDashboardStats()` - Error handling
- ✅ `getRecentTransactions()` - Default limit (10)
- ✅ `getRecentTransactions()` - Custom limit
- ✅ `getRecentTransactions()` - Error handling

**Asset Type Actions (`actions/asset-types.test.ts`)**
- ✅ `getAssetTypes()` - Fetch all with counts
- ✅ `getAssetTypes()` - Error handling
- ✅ `createAssetType()` - Successful creation
- ✅ `createAssetType()` - Required field validation
- ✅ `createAssetType()` - Unique constraint handling
- ✅ `updateAssetType()` - Successful update
- ✅ `updateAssetType()` - Required field validation
- ✅ `deleteAssetType()` - Delete with no assets
- ✅ `deleteAssetType()` - Prevent deletion with assets
- ✅ `deleteAssetType()` - Error handling

**Operations Actions (`actions/operations.test.ts`)**
- ✅ `checkOutAsset()` - Successful checkout
- ✅ `checkOutAsset()` - Validation (asset availability)
- ✅ `checkOutAsset()` - Required fields
- ✅ `checkInAsset()` - Successful check-in
- ✅ `checkInAsset()` - Validation (asset in use)
- ✅ `checkInAsset()` - Required fields
- ✅ `getAvailableAssets()` - Filter by AVAILABLE status
- ✅ `getAssetsInUse()` - Filter by IN_USE with holder info

## Test Statistics

### Current Coverage
- **Total Test Files**: 6
- **Total Test Cases**: 45+
- **Components Tested**: 2
- **Server Actions Tested**: 3 modules (11 functions)
- **Utility Functions Tested**: 1

### Coverage Goals
- **Statements**: Target 80%+
- **Branches**: Target 75%+
- **Functions**: Target 80%+
- **Lines**: Target 80%+

## Running Tests

### Watch Mode (Development)
```bash
npm test
```

### Single Run (CI/CD)
```bash
npm test -- --run
```

### With Coverage
```bash
npm run test:coverage
```

### UI Mode
```bash
npm run test:ui
```

## Mocking Strategy

### Prisma Client
All database operations are mocked using `vi.mock('@/lib/prisma')` to avoid actual database calls during testing.

### Next.js Functions
- `revalidatePath` - Mocked to verify cache invalidation
- `Link` component - Mocked to render as anchor tags

### External Libraries
- `date-fns` - Mocked for consistent time formatting in tests

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Cleanup**: Automatic cleanup after each test via `vitest.setup.ts`
3. **Mocking**: External dependencies are mocked to ensure unit test isolation
4. **Assertions**: Clear, specific assertions using `@testing-library/jest-dom` matchers
5. **Coverage**: Aim for high coverage but focus on critical paths

## Future Test Additions

### Integration Tests (Recommended)
- [ ] Full user flow tests (Epic 1, 2, 3)
- [ ] Database integration tests with test DB
- [ ] API route testing

### E2E Tests (Recommended)
- [ ] Playwright setup
- [ ] Critical user journeys
- [ ] Cross-browser testing

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --run
      - run: npm run test:coverage
```

## Notes

- All tests use Vitest's built-in mocking capabilities
- Tests follow AAA pattern (Arrange, Act, Assert)
- Component tests use React Testing Library for user-centric testing
- Server action tests verify both success and error paths

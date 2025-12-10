# Contributing to RetailRx

First off, thank you for considering contributing to RetailRx! It's people like you that make RetailRx such a great tool for pharmacy management.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Git
- A Supabase account (for database features)

### Setting Up Your Development Environment

1. **Fork the Repository**
   
   Click the "Fork" button at the top right of the repository page.

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/retailrx-pharmacy.git
   cd retailrx-pharmacy
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/retailrx-pharmacy.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node.js version)

**Bug Report Template:**

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g., Windows 11, macOS 14]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node.js: [e.g., 18.19.0]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement, include:**

- A clear and descriptive title
- A detailed description of the proposed feature
- Why this enhancement would be useful
- Possible implementation approach (optional)

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues for newcomers
- `help wanted` - Issues that need assistance
- `documentation` - Documentation improvements

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/barcode-scanning`)
- `fix/` - Bug fixes (e.g., `fix/login-redirect`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/inventory-service`)
- `test/` - Test additions or fixes (e.g., `test/auth-flow`)

### Creating a Feature Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in the feature branch
2. Write or update tests if applicable
3. Run linting: `npm run lint`
4. Test your changes locally
5. Commit your changes (see [Commit Messages](#commit-messages))

### Keeping Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Use functional components with hooks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

```typescript
// Good
const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Avoid
const calc = (i: any[]) => i.reduce((t, x) => t + x.p * x.q, 0);
```

### React Components

- Use functional components
- Use TypeScript interfaces for props
- Keep components focused and reusable
- Use custom hooks for complex logic

```typescript
// Good
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Component logic
};
```

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent spacing and colors
- Leverage the existing design system

```tsx
// Good - Using Tailwind classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">

// Avoid - Inline styles
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
```

### File Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layouts/      # Layout components
├── hooks/            # Custom React hooks
├── contexts/         # React contexts
├── lib/              # Utilities and helpers
├── types/            # TypeScript type definitions
└── pages/            # Page components
```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(inventory): add barcode scanning functionality"

# Bug fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(dashboard): extract metrics into separate component"
```

## Pull Request Process

### Before Submitting

1. ✅ Ensure your code follows the style guidelines
2. ✅ Run `npm run lint` and fix any issues
3. ✅ Test your changes thoroughly
4. ✅ Update documentation if needed
5. ✅ Write meaningful commit messages

### Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to the repository on GitHub
   - Click "Pull Requests" → "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Title Format**
   ```
   feat(scope): Brief description of changes
   ```

### Pull Request Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Delete your feature branch after merging

## Questions?

Feel free to open an issue with the `question` label if you have any questions about contributing.

---

Thank you for contributing to RetailRx! 🎉

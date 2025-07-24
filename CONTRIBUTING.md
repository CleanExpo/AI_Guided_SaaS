# Contributing to The Starter Pack

First off, thank you for considering contributing to The Starter Pack! It's people like you that make this project better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible using the issue template.

**Great Bug Reports** tend to have:
- A quick summary and/or background
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide:
- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any alternatives you've considered

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Simple fixes to get you started
- `help wanted` - More involved issues perfect for contributing

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Issue that pull request!

## Development Setup

1. **Prerequisites**
   - Node.js 20+
   - Git
   - PostgreSQL (for database features)

2. **Setup**
   ```bash
   # Clone your fork
   git clone https://github.com/your-username/The-Starter-Pack.git
   cd The-Starter-Pack

   # Install dependencies
   npm install

   # Copy environment variables
   cp .env.example .env.local

   # Run development server
   npm run dev
   ```

3. **Making Changes**
   ```bash
   # Create a new branch
   git checkout -b feature/your-feature-name

   # Make your changes
   # Run tests
   npm test

   # Check types
   npm run typecheck

   # Lint code
   npm run lint

   # Commit changes
   git commit -m "feat: add amazing feature"

   # Push to your fork
   git push origin feature/your-feature-name
   ```

## Style Guide

### Git Commit Messages

We use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvement
- `test:` Adding missing tests
- `chore:` Changes to the build process or auxiliary tools

### JavaScript/TypeScript Style Guide

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines

- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript interfaces for props
- Document complex components

Example:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Test edge cases

## Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update TypeScript types
- Include examples for new features

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## Recognition

Contributors will be recognized in our README. Thank you for your contributions!

---

Happy coding! 🚀
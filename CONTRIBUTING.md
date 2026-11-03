# Contributing to Stellar Toolkit

Thank you for your interest in contributing to Stellar Toolkit! We welcome contributions from the community.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/stellar-toolkit.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Run linter: `npm run lint`
7. Commit your changes: `git commit -m "Add: your feature description"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Open a Pull Request

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

Examples:
```
feat: add path payment functionality
fix: resolve account balance caching issue
docs: update README with new examples
test: add tests for payment operations
```

## 🧪 Testing Requirements

- All new features must include tests
- All tests must pass before submitting a PR
- Aim for at least 80% code coverage
- Test both success and error scenarios

## 📋 Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md with your changes
3. Ensure all tests pass and linting is clean
4. Link any related issues in your PR description
5. Request review from maintainers

## 🐛 Reporting Bugs

When reporting bugs, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment (Node version, OS, etc.)
- Code samples if applicable

## 💡 Suggesting Features

We love new ideas! When suggesting features:

- Check if it's already been suggested
- Explain the use case clearly
- Describe how it would work
- Consider backward compatibility

## 🔍 Code Review Process

- All PRs require at least one approval from a maintainer
- Address all review comments
- Keep PRs focused and reasonably sized
- Be patient - maintainers are often volunteers

## 📚 Development Guidelines

### Code Style

- Follow the existing code style
- Use TypeScript for all code
- Run `npm run format` before committing
- Keep functions small and focused
- Add JSDoc comments for public APIs

### File Structure

```
src/
  ├── core/           # Core functionality
  ├── utils/          # Helper utilities
  ├── types/          # TypeScript types
  └── __tests__/      # Test files
```

### Writing Tests

```typescript
describe('StellarToolkit', () => {
  it('should create a new account', async () => {
    const toolkit = new StellarToolkit({ network: 'testnet' });
    const account = await toolkit.createAccount();
    expect(account).toHaveProperty('publicKey');
  });
});
```

## 🎯 Good First Issues

Look for issues labeled `good-first-issue` - these are great for new contributors!

## 💬 Questions?

Feel free to:
- Open an issue with the `question` label
- Join our community discussions
- Reach out to maintainers

## 🙏 Thank You!

Every contribution, no matter how small, helps make Stellar Toolkit better!

---

Happy coding! 🌟

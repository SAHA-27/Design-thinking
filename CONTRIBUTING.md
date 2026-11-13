# Contributing to Smart Service Booking Platform

Thank you for your interest in contributing to **Smart Service Booking Platform**! This document provides guidelines for contributing code, reporting bugs, and submitting pull requests.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please treat everyone with respect and empathy.

---

## Development Workflow

### 1. Fork & Branch
- Fork the repository and create your feature branch:
  ```bash
  git checkout -b feature/your-feature-name
  ```

### 2. Follow Commit Conventions
Use clear Conventional Commit messages:
- `feat:` for new capabilities (e.g., `feat: add OTP confirmation step to booking completion`)
- `fix:` for bug fixes (e.g., `fix: resolve leaflet map container re-render glitch`)
- `docs:` for documentation updates (e.g., `docs: update API documentation for revised quotes`)
- `refactor:` for code restructurings without behavior changes
- `test:` for test suites and unit tests

### 3. Code Standards
- **TypeScript**: Strict type checks enabled; avoid using `any`.
- **Styling**: Use utility classes in Tailwind CSS consistent with the design system (deep navy `#0a192f`, crisp slate `#1e293b`, teal accents `#0d9488`).
- **Translations**: When adding user-facing UI labels, ensure keys exist in both English and Tamil inside `client/src/utils/translations.ts`.
- **Backend**: Validate all request parameters and return consistent JSON structures with clear HTTP status codes.

---

## Submitting Pull Requests

1. Ensure the app builds without errors:
   ```bash
   npm run build
   ```
2. Open a Pull Request pointing to the `main` branch.
3. Provide a clear PR description detailing:
   - Summary of changes
   - Which of the 10 smart features (if any) are affected
   - Verification steps taken

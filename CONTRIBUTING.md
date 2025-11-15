# Contributing to Asthma Health Dashboard

Thank you for your interest in contributing to Asthma Health Dashboard! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/asthma-health.git
   cd asthma-health
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Make your changes** and test them
6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: Description of your changes"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** on GitHub

## Development Setup

1. Copy `env.example` to `.env.local`
2. Add your `GEMINI_API_KEY` if you want to test AI features
3. Run `npm run dev` to start development servers
4. Open `http://localhost:3000` in your browser

## Code Style

- Use TypeScript for all new files
- Follow React best practices
- Use functional components with hooks
- Use Tailwind CSS for styling
- Follow the existing code structure and naming conventions

## Commit Messages

Use clear, descriptive commit messages:
- `Add: Feature description`
- `Fix: Bug description`
- `Update: What was updated`
- `Refactor: What was refactored`

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Make sure all tests pass (if applicable)
3. Update documentation if needed
4. Provide a clear description of your changes
5. Reference any related issues

## Reporting Issues

When reporting issues, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and OS information
- Screenshots if applicable

## Questions?

Feel free to open an issue for any questions or discussions.

Thank you for contributing! 🎉



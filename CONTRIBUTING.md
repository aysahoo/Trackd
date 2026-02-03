# Contributing to Trackd

Thanks for your interest in contributing to Trackd! Here's how you can help.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Trackd.git
   cd Trackd
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```
5. Run migrations:
   ```bash
   npx drizzle-kit push
   ```
6. Start the dev server:
   ```bash
   npm run dev
   ```

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes locally
4. Commit with a clear message:
   ```bash
   git commit -m "Add: description of what you added"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request

## Guidelines

- Keep PRs focused on a single change
- Follow the existing code style
- Update documentation if needed
- Test your changes before submitting

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Questions?

Open a discussion or reach out on X: [@ayushfyi](https://x.com/ayushfyi)

# Journal App 📔

A modern journaling application with user authentication, rich entries, and data visualization.  
**Live Demo:** [https://legendary-octo-pancake-nine.vercel.app](https://legendary-octo-pancake-nine.vercel.app)


## Features ✨

- 🔐 Secure authentication with 2FA support
- 📝 Rich text journal entries
- 🗂️ Category organization system
- 📊 Data visualization (word clouds, heatmaps)
- 🔍 Search and filter entries
- 🎨 Responsive UI with dark/light mode
- 🛡️ Admin dashboard (user management)

## Getting Started 🚀

### Prerequisites

- Node.js v18+
- PostgreSQL database
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/vincentmuriuki/legendary-octo-pancake.git
cd legendary-octo-pancake

# Install dependencies
yarn

# Configure environment
cp .env.example .env

Update .env with your database credentials:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/journal-app?schema=public"
NEXTAUTH_SECRET=secret
```

## Database Setup

```bash
# Generate Prisma client and setup database
npx prisma generate && npx prisma db push && npx prisma db seed
```

## Running the App
```bash
yarn dev
```
Open http://localhost:3000 in your browser.

## To Run Tests
```bash
yarn test

# Integration tests
yarn test:integration

# e2e tests
yarn test:e2e
```
## Default Credentials 🔑
```
Admin Account:
Email: admin@journal.com
Password: securepassword
```

## Tech Stack 💻
- Framework: Next.js
- Database: PostgreSQL + Prisma
- Authentication: NextAuth.js
- Styling: Tailwind CSS
- Visualization: Recharts
- Testing: Jest + Playwright
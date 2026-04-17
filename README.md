# MPV Capital Intelligence

Capital Markets Intelligence Platform for institutional investor sourcing, relationship management, and deal flow analysis.

## Overview

A full-stack web application for browsing and analyzing capital market firms — including private equity, venture capital, hedge funds, investment banks, family offices, and more. Populated with 57 real-world firms (Sequoia Capital, Blackstone, KKR, Goldman Sachs, etc.) with contacts, transactions, and industry classifications.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React 18)
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack React Query](https://tanstack.com/query)
- **Tables**: [TanStack React Table](https://tanstack.com/table)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Heroicons](https://heroicons.com/)

## Features

- **Dashboard** — Overview with key stats, pipeline breakdown, recent activity, and geographic distribution
- **Firm Browser** — Filter and search firms by institution type, industry, geography, AUM, check size, and more
- **Firm Profiles** — Detailed views with contacts, transactions, tags, investment preferences, and activity logs
- **Global Search** — Search across firms, contacts, and transactions
- **CSV Export** — Export filtered firm data
- **Analytics API** — Aggregated stats by institution type, industry, CRM status, and geography

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main dashboard with search, stats, and browsing |
| `/browse` | Advanced firm browser with filters and grid/table views |
| `/firms/[id]` | Individual firm profile with tabs for overview, contacts, transactions |

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/firms` | List firms with filtering, pagination, and sorting |
| `POST /api/firms` | Create a new firm |
| `GET /api/firms/[id]` | Full firm profile with relations |
| `PATCH /api/firms/[id]` | Update firm details |
| `DELETE /api/firms/[id]` | Soft-delete a firm |
| `GET /api/contacts` | List contacts |
| `GET /api/transactions` | List transactions |
| `GET /api/analytics` | Dashboard statistics and aggregations |
| `GET /api/search` | Global search across firms, contacts, transactions |
| `GET /api/industries` | Industry taxonomy with firm counts |
| `GET /api/institution-types` | Institution type list with firm counts |
| `GET /api/export` | Export filtered firms as CSV |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/download/) 14+
- [Git](https://git-scm.com/downloads)

---

### macOS (Terminal)

**1. Install Homebrew, Node.js, and PostgreSQL**

```bash
# Install Homebrew (skip if you already have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Follow the instructions Homebrew prints to add it to your PATH, e.g.:
# echo >> ~/.zprofile
# echo 'eval "$(/opt/homebrew/bin/brew shellenv zsh)"' >> ~/.zprofile
# eval "$(/opt/homebrew/bin/brew shellenv zsh)"

# Install Node.js and PostgreSQL
brew install node
brew install postgresql@15
brew services start postgresql@15
```

**2. Clone and set up the project**

```bash
git clone https://github.com/yupengli531/Platform-Demo.git
cd Platform-Demo

npm install
```

**3. Create the database and configure environment**

```bash
# Create the database (uses your Mac username by default)
createdb mpv_capital_intelligence

# Create the .env file — replace YOUR_MAC_USERNAME with your actual username
echo 'DATABASE_URL="postgresql://YOUR_MAC_USERNAME@localhost:5432/mpv_capital_intelligence?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="MPV Capital Intelligence"' > .env
```

> **Tip:** Run `whoami` in Terminal to see your Mac username.

**4. Initialize the database and seed data**

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

This seeds 57 real capital market firms, 106 contacts, 30 transactions, 13 institution types, and 27 industries.

**5. Run the app**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Windows (PowerShell or Command Prompt)

**1. Install Node.js and PostgreSQL**

- Download and install **Node.js LTS** from [nodejs.org](https://nodejs.org/) (includes npm)
- Download and install **PostgreSQL** from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
  - During install, remember the password you set for the `postgres` user
  - Keep the default port `5432`

**2. Clone and set up the project**

```powershell
git clone https://github.com/yupengli531/Platform-Demo.git
cd Platform-Demo

npm install
```

> If `git` is not installed, download it from [git-scm.com/downloads](https://git-scm.com/downloads).

**3. Create the database**

Open **pgAdmin** (installed with PostgreSQL) or **SQL Shell (psql)** and run:

```sql
CREATE DATABASE mpv_capital_intelligence;
```

Or from PowerShell (if PostgreSQL bin is in your PATH):

```powershell
& "C:\Program Files\PostgreSQL\15\bin\createdb.exe" -U postgres mpv_capital_intelligence
```

**4. Configure environment**

Create a `.env` file in the project root:

```powershell
@"
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mpv_capital_intelligence?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="MPV Capital Intelligence"
"@ | Out-File -Encoding utf8 .env
```

> Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

**5. Initialize the database and seed data**

```powershell
npx prisma generate
npx prisma db push
npm run db:seed
```

**6. Run the app**

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Troubleshooting

| Problem | Solution |
|---------|----------|
| `brew: command not found` | Run the Homebrew install command again and follow the PATH instructions it prints |
| `createdb: command not found` (Mac) | Run `export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"` |
| `User postgres was denied access` (Mac) | Your DATABASE_URL should use your Mac username, not `postgres` |
| `ECONNREFUSED` or `connection refused` | Make sure PostgreSQL is running (`brew services start postgresql@15` on Mac, or check Services on Windows) |
| Page loads but shows no data | Make sure you ran `npm run db:seed` successfully |

### Additional Data Import

You can also import firms from CSV or JSON files:

```bash
npm run import:csv -- --file data/ib_firms.csv
npm run import:json -- --file data/firms.json
```

## Seed Data

The database comes pre-loaded with firms across all 13 institution categories:

| Category | Example Firms |
|----------|--------------|
| Venture Capital | Sequoia Capital, Andreessen Horowitz, Benchmark, General Catalyst |
| Private Equity | Blackstone, KKR, Apollo, Carlyle, TPG, Bain Capital |
| Hedge Funds | Citadel, Bridgewater, Point72, D.E. Shaw, Two Sigma |
| Investment Banks | Goldman Sachs, Morgan Stanley, Lazard, Evercore |
| Banks | JPMorgan Chase, Bank of America, Wells Fargo, Citigroup |
| Family Offices | Gates Frontier, Walton Enterprises, Cascade Investment |
| Institutional Investors | CalPERS, Ontario Teachers', CPP Investments |
| Allocators | Hamilton Lane, StepStone, HarbourVest |
| Independent Sponsors | Sun Capital, Marlin Equity, Frontenac |
| Angel Investors | SV Angel, Lerer Hippeau |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                # Dashboard
│   ├── browse/page.tsx         # Firm browser
│   ├── firms/[id]/page.tsx     # Firm profile
│   └── api/                    # API routes
│       ├── firms/
│       ├── contacts/
│       ├── transactions/
│       ├── analytics/
│       ├── search/
│       ├── export/
│       ├── industries/
│       └── institution-types/
├── components/
│   ├── firms/                  # FirmCard, FirmGrid, FirmProfile, FirmFilters
│   ├── layout/                 # AppShell, Header, Sidebar, Footer
│   ├── navigation/             # IndustryTabs, InvestorTypeTabs
│   └── ui/                     # Badge, Button, Input, Modal, Spinner, etc.
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── constants.ts            # CRM status config, formatting helpers
│   └── types.ts                # TypeScript interfaces
prisma/
├── schema.prisma               # Database schema
├── seed.ts                     # Seed script
└── seed_data.json              # 57 firms with contacts and transactions
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:seed` | Seed the database |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run import:csv` | Import firms from CSV |
| `npm run import:json` | Import firms from JSON |

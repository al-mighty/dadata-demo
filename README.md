# DaData API Demo

Interactive demo of the [DaData](https://dadata.ru) suggestions and validation API, protected by Yandex SmartCaptcha. Four pages showcasing address autocomplete, company lookup, bank search, and contractor validation with server-side processing.

**Live:** [cheslav.space/dadata](https://cheslav.space/dadata/)

## Tech Stack

- **Next.js 16** — App Router, Server Actions
- **React 19** — React Hook Form + Zod validation
- **TypeScript**
- **Tailwind CSS 4**
- **Yandex SmartCaptcha** — bot protection on form submissions
- **DaData API** — suggestions and data enrichment

## Pages

| Route | Feature |
|-------|---------|
| `/address` | Address autocomplete with suggestions dropdown |
| `/company` | Company lookup by name, INN, or OGRN |
| `/bank` | Bank search with BIC/SWIFT details |
| `/form` | Contractor validation — composite form with all lookups |

## Getting Started

### Prerequisites

Create `.env.local` with the following keys:

```env
DADATA_API_KEY=your_dadata_api_key
DADATA_SECRET_KEY=your_dadata_secret_key
NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY=your_client_key
SMARTCAPTCHA_SERVER_KEY=your_server_key
```

### Run

```bash
npm install
npm run dev        # http://localhost:3000
```

### Build

```bash
npm run build
npm start
```

## Project Structure

```
dadata-demo/
├── src/
│   ├── app/
│   │   ├── address/        # Address autocomplete page
│   │   ├── company/        # Company lookup page
│   │   ├── bank/           # Bank search page
│   │   ├── form/           # Contractor validation form
│   │   │   └── actions.ts  # Server Actions for form processing
│   │   ├── api/
│   │   │   └── dadata/     # API route for DaData proxy
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── ui/             # Reusable UI primitives
│   │   ├── captcha/        # SmartCaptcha widget
│   │   ├── dadata/         # DaData suggestion components
│   │   ├── form/           # Form field components
│   │   └── layout/         # Page layout wrappers
│   ├── hooks/
│   │   ├── use-dadata.ts   # DaData API hook with caching
│   │   └── use-debounce.ts # Input debounce hook
│   └── lib/
│       ├── dadata/         # DaData API client & types
│       ├── captcha/        # SmartCaptcha verification
│       └── rate-limit.ts   # Server-side rate limiting
├── package.json
└── tsconfig.json
```

## Author

Vyacheslav Kovalev — [GitHub](https://github.com/al-mighty) · [cheslav.space](https://cheslav.space)

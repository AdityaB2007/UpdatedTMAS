# TMAS Academy - Frontend

This is the Next.js frontend for The Math and Science Academy (TMAS), an educational non-profit providing free math and science resources.

## Tech Stack

- **Next.js 15** with React 19 (App Router)
- **TypeScript**
- **Tailwind CSS v4** with PostCSS
- **Lucide React** for icons
- **react-pdf** for PDF viewing (latest pdfjs-dist)
- **Turbopack** for fast builds

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Other commands:

```bash
npm run build   # Build for production with Turbopack
npm start       # Start production server
```

## Project Structure

```
client/
├── app/              # App Router (Next.js 15)
│   ├── layout.tsx    # Root layout with Navigation & Footer
│   ├── page.tsx      # Home page
│   ├── about/        # About page
│   ├── books/        # Books page with PDF viewer
│   ├── contact/      # Contact page
│   ├── donate/       # Donate page
│   ├── join/         # Join page
│   └── resources/    # Resources page
├── components/       # Reusable React components
│   ├── Navigation.tsx
│   └── Footer.tsx
├── styles/
│   ├── globals.css   # Global Tailwind styles
│   └── PDFViewer.module.css # PDF viewer styles
└── public/
    └── pdfs/         # ACE series study guides (7 PDFs)
```

## Pages

- **Home** (`/`) - Landing page with mission and features
- **About** (`/about`) - Organization information
- **Books** (`/books`) - Interactive PDF viewer for study guides
- **Resources** (`/resources`) - Educational materials
- **Contact** (`/contact`) - Contact form
- **Join** (`/join`) - Community/Discord info
- **Donate** (`/donate`) - Support the mission

## Components

- **Navigation** - Site-wide navigation bar
- **Footer** - Site-wide footer with social links

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

# TMAS Academy

**Free STEM Education for Everyone**

TMAS Academy is a student-led nonprofit organization dedicated to making high-quality STEM education accessible to everyone. We create comprehensive, free study guides for AP courses and competitive mathematics.

## Features

- **Free Study Guides** - 7 comprehensive guides for AP courses and AMC competitions
- **Interactive PDF Viewer** - Read study guides directly in your browser
- **Community** - Join 500+ students on Discord
- **AI Chatbot** - Get help with your studies (coming soon)
- **Modern UI** - Dark theme with smooth GSAP animations
- **Interactive Grid Effect** - Dynamic hover highlights with scroll-aligned grid magnification

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + CSS Variables
- **Animations**: GSAP (ScrollTrigger, Draggable)
- **Icons**: Lucide React
- **PDF**: react-pdf

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tmas-academy.git

# Navigate to client directory
cd tmas-academy/client

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
client/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── resources/         # Study guides
│   ├── books/             # PDF viewer
│   ├── contact/           # Contact form
│   ├── donate/            # Support page
│   ├── join/              # Volunteer signup
│   └── chatbot/           # AI assistant
├── components/
│   ├── effects/           # Visual effects (GridDistortion)
│   ├── features/          # Feature components
│   ├── layout/            # Layout components
│   └── navigation/        # Navigation components
├── data/                  # Static data files
├── public/pdfs/           # PDF study guides
└── styles/                # Global CSS
```

## Available Study Guides

| Subject | Guide |
|---------|-------|
| Calculus | ACE AP Calculus AB |
| Calculus | ACE AP Calculus BC |
| Computer Science | ACE AP Computer Science Principles |
| Physics | ACE AP Physics 1 |
| Physics | ACE AP Physics C Mechanics |
| Statistics | ACE AP Statistics |
| Competition Math | ACE The AMC 10 and 12 |

## Contributing

We welcome contributions! Here's how you can help:

1. **Content Creation** - Write study guides and practice problems
2. **Development** - Improve the website and add features
3. **Outreach** - Help spread the word about TMAS

To join the team, visit [tmasacademy.org/join](https://tmasacademy.org/join) or fill out our volunteer application.

## Community

- **Discord**: [Join our server](https://discord.gg/UKdzN7Ebsh)
- **Instagram**: [@tmasacademy](https://instagram.com/tmasacademy)
- **LinkedIn**: [TMAS Academy](https://linkedin.com/company/tmas-academy)
- **Email**: tmasacademy@gmail.com

## License

This project is open source and available for educational purposes.

---

Made with care by the TMAS Academy team

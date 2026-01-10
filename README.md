# TMAS Academy

**Free STEM Education for Everyone**

TMAS Academy is a student-led nonprofit organization dedicated to making high-quality STEM education accessible to everyone. We create comprehensive, free study guides for AP courses and competitive mathematics.

## Features

- **Free Study Guides** - Comprehensive guides for AP courses and AMC competitions
- **Interactive PDF Viewer** - Read study guides directly in your browser
- **AI Chatbot** - Get personalized help with your studies
  - **Smart Book Recommendations** - AI-powered vector embeddings find the most relevant study guides based on your questions
  - **Interactive Quizzes** - Generate 3-question quizzes to test your understanding with hints and instant feedback
  - **Practice Problem Recommendations** - Get specific practice problems from study guides using PDF parsing and semantic search
  - **Topic Identification** - Automatically identifies relevant subjects (Physics, Calculus, Biology, etc.)
  - **Educational Content Filtering** - Ensures the chatbot focuses on educational content
- **Community** - Join 500+ students on Discord
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
- **OpenAI API Key** (required for vector embeddings and AI features)
  - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
  - Add it to your environment variables (see Configuration section below)

### Quick Start (One Command)

Install all dependencies and start the development server with a single command:

**macOS / Linux:**
```bash
cd client && npm install && npm run dev
```

**Windows (Command Prompt):**
```cmd
cd client && npm install && npm run dev
```

**Windows (PowerShell):**
```powershell
cd client; npm install; npm run dev
```

### Installation (Step by Step)

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

### Configuration

#### Environment Variables

Create a `.env.local` file in the `client/` directory with the following:

```bash
# Required for AI features (vector embeddings, book recommendations, quiz generation)
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: Without the OpenAI API key, the following features will use fallback methods:
- Book recommendations will use keyword matching instead of vector embeddings
- Topic identification will use keyword matching
- Educational content filtering will use keyword-based detection
- PDF parsing for practice problems will be disabled (AI-based recommendations will still work)

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
| Chemistry | ACE AP Chemistry |
| Biology | ACE AP Biology |
| Statistics | ACE AP Statistics |
| Psychology | ACE AP Psychology |
| Geography | ACE AP Human Geography |
| Competition Math | ACE The AMC 10 and 12 |

## AI Features

### Vector Embeddings & Semantic Search

The platform uses OpenAI's embedding models to provide intelligent book recommendations:

- **Semantic Book Matching**: Finds relevant study guides based on the meaning of your questions, not just keywords
- **Topic Identification**: Automatically identifies which subjects your question relates to (Physics, Calculus, Biology, etc.)
- **Practice Problem Discovery**: Parses PDFs and uses embeddings to find specific practice problems related to your query

### How It Works

1. **Book Recommendations**: When you ask a question, the system:
   - Converts your query into a vector embedding
   - Compares it against embeddings of all available books
   - Returns the most relevant books based on semantic similarity

2. **Topic Identification**: 
   - Analyzes your question to identify relevant educational topics
   - Shows topic relevance percentages
   - Filters book recommendations when a topic is 100% relevant

3. **Practice Problems**:
   - Parses PDF study guides using `pdf-parse` (Node.js-compatible)
   - Extracts practice problems using pattern matching
   - Creates embeddings for each problem
   - Finds the most relevant problems using vector similarity search

### Dependencies

- **pdf-parse**: Node.js-compatible PDF parsing library for extracting text from study guides
- **OpenAI API**: Used for generating vector embeddings (`text-embedding-3-small` model)
- **KaTeX**: Renders LaTeX mathematical expressions in chat and quizzes

## Contributing

We welcome contributions! Here's how you can help:

1. **Content Creation** - Write study guides and practice problems
2. **Development** - Improve the website and add features
3. **Outreach** - Help spread the word about TMAS

To join the team, visit us online and fill out our volunteer application.

## Community

- **Discord**: [Join our server](https://discord.gg/UKdzN7Ebsh)
- **Instagram**: [@tmasacademy](https://instagram.com/tmasacademy)
- **LinkedIn**: [TMAS Academy](https://linkedin.com/company/tmas-academy)
- **Email**: weexploremath@gmail.com

## License

This project is open source and available for educational purposes.

---

Made with care by the TMAS Academy team

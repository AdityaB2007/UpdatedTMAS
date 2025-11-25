# TMAS Website Redesign - Implementation Plan

## Project Overview
Complete redesign of TMAS Academy website with modern dark theme, animations, and AI chatbot integration.

## Design Inspiration Analysis

### Key Patterns Identified from Reference Sites:

**Fortnight Studio:**
- Dark theme with high contrast typography
- Scroll-triggered animations
- Premium minimalist aesthetic
- Horizontal scrolling carousels

**Sightbox:**
- Dual dark/light theme support
- Smooth transitions (0.2s ease-out)
- Bold startup aesthetic
- Asymmetrical layouts

**Paddle:**
- Sophisticated color system with CSS custom properties
- Cubic-bezier easing functions for smooth animations
- Frosted glass effects (backdrop-filter: blur)
- 12-column responsive grid
- Gradient text treatments

**Linear:**
- Dark-first design with glass variants
- Styled-components CSS-in-JS
- Monospace fonts for technical elements
- Card-based component design
- Hardware acceleration detection

### Design Direction for TMAS:
- **Primary Theme**: Dark (#0e1414 inspired by Paddle)
- **Accent Colors**: Yellow/amber highlights (from Paddle)
- **Typography**: Sans-serif for UI, serif for editorial content
- **Grid System**: 12-column responsive (mobile 4-col, tablet 6-col, desktop 12-col)
- **Animations**: GSAP for scroll effects with GPU acceleration
- **Effects**: Frosted glass navigation, gradient text, smooth cubic-bezier transitions

## Technical Stack

### Core Framework:
- **Frontend**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Animations**: GSAP + ScrollTrigger
- **Icons**: Lucide React
- **Markdown**: Marked.js (for chatbot)
- **Math Rendering**: KaTeX (for chatbot)
- **TypeScript**: Strict mode enabled

### New Dependencies to Install:
```bash
npm install gsap
npm install @aws-sdk/client-cognito-identity-provider @aws-sdk/client-s3
npm install marked katex
npm install @types/marked @types/katex
```

## Information Architecture

### Navigation Structure (Sticky Top Nav):
```
Home | About | Our Resources | Donate | Contact | Join the Team | Chatbot
```

### Pages & Routes:

#### 1. Home (`/`)
- Hero Section (tagline + 2 CTAs)
- Organization Stats (4 cards)
- Our Resources (preview)
- Testimonials

#### 2. About (`/about`)
- Mission & Vision
- Our Story
- Meet the Team (Jako, Mahado, Dainna, Katelyn only)

#### 3. Our Resources (`/resources`)
- Search bar for books
- Grid of all books with metadata
- Link to individual book pages

#### 4. Book Individual Pages (`/books/[slug]`)
**Dynamic routing for each book:**
- `/books/ace-ap-calculus-ab`
- `/books/ace-ap-calculus-bc`
- `/books/ace-ap-csp`
- `/books/ace-ap-physics-1`
- `/books/ace-ap-physics-c`
- `/books/ace-ap-stats`
- `/books/ace-amc-10-12`

**Each page includes:**
- Book cover/hero image
- Author information
- Page count
- Number of practice problems
- Overview/description
- PDF viewer (iframe)
- Download button

#### 5. Join the Team (`/join`)
- Embedded Google Form
- Team benefits/culture info

#### 6. Contact (`/contact`)
- Contact form
- Email: tmasacademy@gmail.com
- Social media links (Instagram, LinkedIn, Discord)

#### 7. Donate (`/donate`)
- Donation info
- Impact statement
- External donation link

#### 8. Chatbot (`/chat`)
- AWS Cognito authentication
- AI chat interface with:
  - Message history
  - Streaming responses
  - Markdown rendering
  - Math equation support (KaTeX)
  - Image attachment upload to S3
  - Web search toggle

#### 9. Legal Pages:
- `/privacy` - Privacy Policy
- `/terms` - Terms of Use
- `/accessibility` - Accessibility Statement

## Component Architecture

### Layout Components:
```
/components/
├── navigation/
│   ├── Navbar.tsx           # Sticky nav with frosted glass
│   ├── MobileMenu.tsx       # Mobile hamburger menu
│   └── NavLink.tsx          # Animated nav links
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Container.tsx        # Max-width container
│   └── Section.tsx          # Animated section wrapper
└── ui/
    ├── Button.tsx           # CTA buttons
    ├── Card.tsx             # Stat cards, book cards
    ├── Input.tsx            # Form inputs
    ├── SearchBar.tsx        # Resource search
    └── GradientText.tsx     # Accent gradient text
```

### Feature Components:
```
/components/features/
├── hero/
│   ├── HeroSection.tsx      # Home hero with CTAs
│   └── AnimatedBackground.tsx # Animated gradient bg
├── stats/
│   └── StatsGrid.tsx        # 4 stat cards with animations
├── books/
│   ├── BookCard.tsx         # Book grid item
│   ├── BookGrid.tsx         # Responsive book grid
│   ├── BookHero.tsx         # Individual book hero
│   └── PDFViewer.tsx        # Iframe PDF viewer
├── chat/
│   ├── ChatContainer.tsx    # Main chat interface
│   ├── MessageList.tsx      # Chat messages
│   ├── MessageInput.tsx     # Input with attachments
│   ├── AuthFlow.tsx         # AWS Cognito login
│   └── StreamingMessage.tsx # Markdown + KaTeX renderer
├── team/
│   ├── TeamGrid.tsx         # Team member cards
│   └── TeamMember.tsx       # Individual member
└── testimonials/
    └── TestimonialSlider.tsx # GSAP horizontal slider
```

### Animation Components:
```
/components/animations/
├── ScrollReveal.tsx         # GSAP scroll-triggered animations
├── FadeIn.tsx               # Fade in on scroll
├── SlideIn.tsx              # Slide in from direction
└── ParallaxSection.tsx      # Parallax scroll effect
```

## Data Structure

### Books Data (`/data/books.ts`):
```typescript
export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  coverImage: string;
  pdfUrl: string;
  pageCount: number;
  problemCount: number;
  description: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const books: Book[] = [
  {
    id: '1',
    slug: 'ace-ap-calculus-ab',
    title: 'ACE AP Calculus AB',
    // ...
  },
  // ... other books
];
```

### Team Data (`/data/team.ts`):
```typescript
export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio?: string;
}

export const team: TeamMember[] = [
  { name: 'Jako', role: 'Core Member', photo: '/team/jako.jpg' },
  { name: 'Mahado', role: 'Core Member', photo: '/team/mahado.jpg' },
  { name: 'Dainna', role: 'Core Member', photo: '/team/dainna.jpg' },
  { name: 'Katelyn', role: 'Core Member', photo: '/team/katelyn.jpg' },
];
```

### Testimonials Data (`/data/testimonials.ts`):
```typescript
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
}
```

## Animation Strategy (GSAP)

### Scroll Animations:
1. **Fade In**: Elements fade in as they enter viewport
2. **Slide Up**: Cards slide up from bottom
3. **Stagger**: Grid items animate in sequence
4. **Parallax**: Background elements move at different speeds
5. **Scale**: Elements scale up on scroll
6. **Number Counter**: Stats count up when visible

### Interaction Animations:
1. **Hover Effects**: Scale, glow, color transitions
2. **Button Press**: Scale down on click
3. **Nav Hover**: Underline animation
4. **Card Hover**: Lift + shadow increase

### Page Transitions:
1. **Route Changes**: Fade out/in
2. **Modal Open**: Scale + blur background
3. **Menu Toggle**: Slide + fade

## Dark Theme Color System

### CSS Custom Properties (`globals.css`):
```css
:root {
  /* Background Colors */
  --bg-primary: #0e1414;
  --bg-secondary: #1a1f1f;
  --bg-tertiary: #252b2b;

  /* Text Colors */
  --text-primary: #fcfcfc;
  --text-secondary: #b4b8b8;
  --text-tertiary: #8a8e8e;

  /* Accent Colors */
  --accent-yellow: #fff800;
  --accent-amber: #ffb800;
  --accent-orange: #ff6b00;

  /* Border Colors */
  --border-primary: rgba(255, 255, 255, 0.1);
  --border-secondary: rgba(255, 255, 255, 0.05);

  /* Glass Effect */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);

  /* Easing Functions */
  --ease-smooth: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

## Chatbot Implementation (AWS Cognito + Lambda)

### Environment Variables (`.env.local`):
```env
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=<from lunarift credentials>
NEXT_PUBLIC_AWS_CLIENT_ID=<from lunarift credentials>
AWS_COGNITO_USERNAME=<from lunarift credentials>
AWS_COGNITO_PASSWORD=<from lunarift credentials>
NEXT_PUBLIC_LAMBDA_ENDPOINT=<chat API endpoint>
NEXT_PUBLIC_S3_BUCKET=knowt-user-attachments
```

### Authentication Flow:
1. User navigates to `/chat`
2. Auto-authenticate with stored credentials (AWS Cognito)
3. Retrieve JWT token
4. Store token in memory for API calls

### Chat Flow:
1. User types message
2. Message added to history array
3. POST to Lambda endpoint with:
   - chatId (generated on first message)
   - message text
   - message history
   - JWT token
4. Stream response from Lambda
5. Parse JSON chunks with regex
6. Render markdown with Marked.js
7. Render math with KaTeX
8. Display in chat interface

### Image Upload:
1. User selects image
2. Upload to S3 bucket
3. Get S3 URL
4. Include URL in message attachments
5. Lambda processes image with AI

## Mobile Responsiveness Strategy

### Breakpoints:
```css
/* Mobile First Approach */
- mobile: < 640px (4-column grid)
- tablet: 640px - 1024px (6-column grid)
- desktop: > 1024px (12-column grid)
```

### Mobile Optimizations:
1. **Navigation**: Hamburger menu
2. **Hero**: Stack CTAs vertically
3. **Stats**: 2x2 grid instead of 4 columns
4. **Books**: Single column grid
5. **Team**: Single column
6. **Chatbot**: Full-screen interface
7. **Touch**: Larger tap targets (min 44px)

## Implementation Phases

### Phase 1: Foundation & Design System (2-3 hours)
- Install dependencies (GSAP, AWS SDK, Marked, KaTeX)
- Set up CSS custom properties
- Create base components (Button, Card, Input)
- Set up dark theme
- Configure Tailwind with custom colors
- Save logo to `/public/logo.png`

### Phase 2: Layout & Navigation (1-2 hours)
- Build sticky navbar with frosted glass
- Mobile hamburger menu
- Footer with social links
- Page layout wrapper
- Route structure setup

### Phase 3: Home Page (2-3 hours)
- Hero section with animated gradient
- 2 CTA buttons (Resources, Discord)
- Stats grid with GSAP counters
- Resources preview section
- Testimonials slider

### Phase 4: About Page (1 hour)
- Mission & Vision section
- Our Story section
- Team grid (4 members)

### Phase 5: Resources & Books (3-4 hours)
- Resources page with search
- Book grid with filtering
- Dynamic book pages (`/books/[slug]`)
- Book data file
- PDF viewer component
- Download functionality

### Phase 6: Other Pages (2 hours)
- Join page with embedded Google Form
- Contact page with form + social links
- Donate page
- Legal pages (Privacy, Terms, Accessibility)

### Phase 7: Chatbot (4-5 hours)
- AWS Cognito authentication
- Chat interface
- Message streaming
- Markdown + KaTeX rendering
- Image upload to S3
- Message history management
- Error handling

### Phase 8: Animations & Polish (2-3 hours)
- GSAP scroll animations
- Page transitions
- Hover effects
- Loading states
- Smooth scrolling
- Performance optimization

### Phase 9: Testing & Refinement (1-2 hours)
- Mobile testing
- Cross-browser testing
- Animation performance
- Accessibility audit
- SEO optimization

### Phase 10: Deployment Prep (1 hour)
- Environment variables setup
- Build optimization
- Image optimization
- Final review

## Pending Requirements from User

Before implementation, need:
1. ✅ Discord invite URL
2. ✅ Google Form URL (Join the Team)
3. ✅ Social media URLs (Instagram, LinkedIn, etc.)
4. ✅ Brand colors (hex codes)
5. ✅ Logo saved to project
6. ⏳ AWS Cognito credentials (UserPoolId, ClientId, Username, Password)
7. ⏳ Lambda/API endpoint for chat
8. ⏳ Team member photos (Jako, Mahado, Dainna, Katelyn)
9. ⏳ Book metadata (authors, page counts, problem counts, descriptions)
10. ⏳ Testimonial quotes
11. ⏳ Legal document text (Privacy Policy, Terms, Accessibility)
12. ⏳ Company mission statement / tagline

## Success Criteria

- ✅ Modern dark theme inspired by reference sites
- ✅ Smooth GSAP scroll animations
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Working AI chatbot with AWS Cognito
- ✅ Dynamic book pages with PDF viewer
- ✅ Sticky navigation with glass effect
- ✅ Fast page load times (<2s)
- ✅ Accessible (WCAG 2.1 AA)
- ✅ SEO optimized
- ✅ Zero console errors

## Subagent Task Distribution

Once approved, implementation will use subagents for:
1. **Design System Setup**: Install deps, configure theme, base components
2. **Navigation & Layout**: Navbar, Footer, page wrappers
3. **Home Page**: Hero, stats, testimonials
4. **Resources System**: Book grid, search, dynamic pages
5. **Chatbot**: AWS integration, chat interface, streaming
6. **Animations**: GSAP setup, scroll effects
7. **Content Pages**: About, Join, Contact, Donate, Legal
8. **Testing & Polish**: QA, optimization, final touches

## Estimated Timeline
**Total: 18-25 hours** (can be parallelized with subagents to 8-12 hours real-time)

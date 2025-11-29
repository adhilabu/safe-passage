# SafePassage Network 🧭

<div align="center">

**A community-driven platform connecting travelers with shared safety priorities and generating ethical, AI-powered travel itineraries.**

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.86.0-3ECF8E.svg)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4.svg)](https://ai.google.dev/)

</div>

---

## 📖 Overview

SafePassage Network is a modern web application designed to make travel safer and more inclusive for everyone. The platform addresses two key challenges:

1. **Community Matching**: Connect with like-minded travelers who share your safety priorities and travel style
2. **Ethical Itinerary Planning**: Generate AI-powered travel itineraries that prioritize safety, accessibility, and ethical tourism

### Key Features

- 🤝 **Smart Community Matching** - Find travel companions based on shared safety priorities and community styles
- 🗺️ **AI-Powered Itineraries** - Generate personalized travel plans using Google Gemini with grounding sources
- 🛡️ **Safety-First Approach** - Multiple safety priority categories including solo female safety, accessibility, minority support, and more
- 👤 **User Profiles** - Create and manage your travel profile with preferences and priorities
- 💬 **AI Icebreakers** - Generate personalized conversation starters to connect with potential travel companions
- 📱 **Responsive Design** - Beautiful, modern UI built with TailwindCSS and Lucide icons
- 🔐 **Secure Authentication** - Powered by Supabase Auth with demo mode support

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Gemini API Key** ([Get one here](https://ai.google.dev/))
- **Supabase Account** (optional - app works in demo mode without it)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your `.env.local` file**
   ```env
   # Required: Gemini API Key
   API_KEY=your_gemini_api_key_here

   # Optional: Supabase Configuration (for production use)
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🏗️ Project Structure

```
Hackathon/
├── components/           # React components
│   ├── AuthPage.tsx     # Authentication UI
│   ├── MatchFinder.tsx  # Community matching feature
│   ├── ItineraryGenerator.tsx  # AI itinerary generation
│   ├── ProfilePage.tsx  # User profile management
│   ├── MultiSelect.tsx  # Reusable multi-select component
│   ├── NotificationModal.tsx  # Notification system
│   └── ReportModal.tsx  # Content reporting feature
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── services/            # External service integrations
│   ├── geminiService.ts # Google Gemini AI integration
│   └── supabaseClient.ts # Supabase client setup
├── supabase/            # Database schema and migrations
│   └── schema.sql       # Database schema definition
├── data/                # Mock data
│   └── mockUsers.ts     # Sample user data for demo mode
├── App.tsx              # Main application component
├── types.ts             # TypeScript type definitions
├── constants.ts         # Application constants
└── index.tsx            # Application entry point
```

---

## 🎯 Core Features

### 1. Community Match

Connect with travelers who share your priorities:

- **Safety Priorities**:
  - Solo Female Safety
  - Accessible Travel (Mobility)
  - Minority Community Support
  - Religious Inclusivity
  - Neurodivergent Friendly

- **Community Styles**:
  - Quiet Observer
  - Active Advocate
  - Community Builder
  - Culture Seeker

- **Smart Filtering**: Find matches based on destination, dates, and shared values
- **AI Icebreakers**: Generate personalized conversation starters using Gemini AI

### 2. Ethical Itinerary Generator

Create responsible travel plans with AI assistance:

- **Itinerary Types**:
  - Trekking & Hiking
  - Sightseeing & Landmarks
  - Food Exploration
  - Cultural Immersion
  - Adventure Sports
  - Relaxation & Wellness
  - Custom (define your own)

- **AI-Powered Planning**: Leverages Google Gemini with grounding for accurate, source-backed recommendations
- **Safety-Focused**: Incorporates your safety priorities into every recommendation
- **Grounding Sources**: All recommendations include verifiable sources
- **Report Feature**: Community-driven content moderation

### 3. User Profiles

Manage your travel identity:

- Personal information and avatar
- Safety priorities
- Preferred community style
- Favorite itinerary types
- Bio and location
- Profile data integration across features

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0** - UI library
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool and dev server
- **TailwindCSS 3.4.18** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Markdown** - Markdown rendering for itineraries

### Backend & Services
- **Supabase 2.86.0** - Authentication and database
- **Google Gemini AI** - AI-powered content generation
- **PostgreSQL** - Database (via Supabase)

### Development Tools
- **PostCSS & Autoprefixer** - CSS processing
- **Vite Plugin React** - Fast refresh and JSX support

---

## 🔧 Configuration

### Supabase Setup (Optional)

The app works in demo mode without Supabase, but for production use:

1. Create a [Supabase account](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `supabase/schema.sql` in the SQL Editor
4. Get your project URL and anon key from Project Settings > API
5. Add them to your `.env.local` file

### Gemini API Setup (Required)

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create or select a project
3. Generate an API key
4. Add it to your `.env.local` as `API_KEY`

---

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deployment

### Build the Application

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Deploy to Vercel

1. Import your repository in Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables

---

## 🔐 Security & Privacy

- **Row Level Security**: Supabase RLS policies protect user data
- **Environment Variables**: Sensitive keys stored securely
- **Client-side Auth**: Secure authentication flow with Supabase
- **Content Moderation**: Report feature for community safety
- **No Data Tracking**: Privacy-focused design

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is built with Responsible AI Principles.

---

## 🙏 Acknowledgments

- **Google Gemini** - AI-powered content generation
- **Supabase** - Backend infrastructure
- **Lucide** - Beautiful icon system
- **TailwindCSS** - Styling framework

---

## 📧 Support

For issues, questions, or suggestions:

- Open an issue in the repository
- Check existing documentation
- Review the error handling guide in `ERROR_HANDLING_GUIDE.md`

---

<div align="center">

**Built with ❤️ for safer, more inclusive travel**

© 2024 SafePassage Network

</div>

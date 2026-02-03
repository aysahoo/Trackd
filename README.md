# Trackd

A simple, no-fuss app to track what you've watched and figure out what to watch next.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

Trackd is built for people who just want to remember what movies and TV shows they've watched—without the pressure to rate everything on a 10-point scale or write lengthy reviews.

- Mark movies and shows as watched
- Save things to watch later
- Search through your history
- Dark mode support
- PWA - works on mobile

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Database**: [Neon](https://neon.tech/) (Serverless Postgres)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Data**: [TMDB API](https://www.themoviedb.org/)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Neon database
- TMDB API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/aysahoo/Trackd.git
cd Trackd
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Fill in your database URL and TMDB API key.

4. Run database migrations:

```bash
npx drizzle-kit push
```

5. Start the development server:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Attribution

This product uses the [TMDB API](https://www.themoviedb.org/) but is not endorsed or certified by TMDB.

## Team

- **Ayush** - [@ayushfyi](https://x.com/ayushfyi) | [GitHub](https://github.com/aysahoo)
- **Adarsh** - [@adarshanatia](https://x.com/adarshanatia) | [GitHub](https://github.com/Adarsha2004)

## License

This project is open source and available under the [MIT License](LICENSE).

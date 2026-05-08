# HomeFood — Landing Page

A static, fully animated landing page for **HomeFood** — Malaysia's halal-first home cook marketplace.

Built as plain HTML / CSS / JS — **zero build step**, drop-and-go on Vercel, Netlify, GitHub Pages, or cPanel.

## Stack

- **HTML5** semantic markup
- **Custom CSS** (no Tailwind dep needed at runtime — fully self-contained)
- **Vanilla JS** with:
  - GSAP + ScrollTrigger — scroll parallax
  - Lenis — buttery smooth scroll
  - Lucide — icons
- Google Fonts: Fraunces, Inter, Caveat

All third-party libs are loaded via CDN. No npm, no bundler.

## File structure

```
HomeFood/
├── index.html
├── kitchen-standards.html
├── privacy-policy.html
├── support.html
├── terms-of-service.html
├── vercel.json
├── README.md
└── assets/
    ├── css/styles.css
    ├── js/intro.js          (cinematic intro animation)
    ├── js/main.js           (interactions, hero slider, etc.)
    └── img/logo.svg
```

## Deploy

### Vercel (recommended)
1. Push to GitHub
2. Go to vercel.com → Import Project
3. Select your repo → Deploy. Done.

### Netlify
1. Drag the folder to app.netlify.com/drop
2. Or push to GitHub and connect.

### cPanel
1. Log in to cPanel → File Manager
2. Upload all files into `public_html/`
3. Visit your domain.

## Sections

1. Cinematic Intro — 3.6s logo animation (auto-skips on repeat visits)
2. Hero Slider — Toggle between "Cook & Earn" / "Order Food" perspectives
3. 3D Showcase — scroll-driven phone with orbiting dishes
4. Marquee, Why, Process, Dishes, Kuih, Numbers, Stories, Coverage, Bonuses, Download CTA, FAQ, Footer

## Customization

- **Logo**: replace `assets/img/logo.svg`
- **Dish photos**: search `images.unsplash.com` in `index.html` and swap URLs
- **App store links**: edit `<a href="#download" class="store-btn">`
- **Contact email**: search `support@homefood.my`

## License

Internal — HomeFood Sdn Bhd © 2026.

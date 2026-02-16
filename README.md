# Student Finance Tracker (UI Prototype)

A modern, responsive, and accessible user interface for a Student Finance Tracker application. This project demonstrates semantic HTML5, modern CSS (Flexbox, Grid, Custom Properties), and a mobile-first design approach without the use of any external frameworks.

## Features

- **Responsive Design**:
  - **Mobile**: Card-based layouts, simplified navigation with toggle.
  - **Desktop/Tablet**: Full data tables, expanded dashboard, and sticky navigation.
- **Modern UI Components**:
  - Dashboard with summary cards and chart placeholders.
  - Transactions list that adapts from a table (desktop) to cards (mobile).
  - Add Transaction Modal (`<dialog>`).
  - Settings page with custom toggle switches.
- **Theming**:
  - Comprehensive CSS variable system for easy theming.
  - Dark/Light mode toggle hook (UI only).

## Setup & Usage

Since this is a vanilla HTML/CSS project, no build step is required.

1.  Clone the repository or download the files.
2.  Open `index.html` in any modern web browser.
    -   *Tip: Use "Open File" in your browser or drag-and-drop the file.*

## Accessibility

- **Semantic HTML**: Uses proper landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) for screen reader navigation.
- **Keyboard Navigation**:
  - Interactive elements (buttons, links, inputs) have visible focus states.
  - Skip links and proper heading hierarchy (h1-h3) are maintained.
- **Colors**: High contrast color palette (Deep Indigo & Text on White) ensures readability.

## Responsiveness

The layout is optimized for:
- **Mobile (360px+)**: Stacked layout, hidden nav menu (accessible via hamburger toggle).
- **Tablet (768px+)**: Two-column grids where appropriate, side-by-side form elements.
- **Desktop (1024px+)**: Full-width dashboard and data tables.

## Project Structure

```text
/
├── index.html            # Dashboard
├── transactions.html     # Transactions List & Add Modal
├── settings.html         # Settings (Theme, Currency)
├── about.html            # About & Contact Info
└── styles/
    ├── reset.css         # Modern CSS reset
    ├── variables.css     # Design tokens (colors, typography, spacing)
    ├── global.css        # Base styles and typography
    └── components.css    # UI components (Cards, Buttons, Forms, Modals)
```

## Credits

- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) and [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts.
- **Icons**: Uses standard unicode emojis for this prototype (can be replaced with SVG/FontAwesome).
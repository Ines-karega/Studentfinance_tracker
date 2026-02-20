A powerful, privacy-focused, and fully functional vanilla JavaScript application for students to manage their finances. This project features a modern responsive UI, real-time data visualization, and comprehensive data management, all without the need for external frameworks or a backend.


## Key Features

- **Personalized Dashboard**:
  - Real-time summary of total balance, monthly spending, and budget status.
  - **7-Day Spending Trend**: Dynamic bar chart showing your daily expense patterns.
- **Transaction Management**:
  - Full CRUD functionality: Add, view, edit, and delete transactions.
  - **Smart Filtering**: Live search and category-based filtering.
  - **Advanced Sorting**: Sort records by date, amount, or category.
- **User Preferences**:
  - **Dark Mode**: High-contrast theme that persists across sessions.
  - **Currency Conversion**: Support for USD, EUR, GBP, and RWF with estimated conversion rates.
  - **Budget Target**: Set a monthly spending goal and track your progress in real-time.
- **Data Portability**:
  - **JSON Export**: Backup your entire financial history to a local file.
  - **JSON Import**: Restore or merge data from previous backups with built-in validation.
- **Persistence**: All data is securely stored locally in your browser's `localStorage`.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewports.

## [LIVE DEMO (GitHub Pages)](https://ines-karega.github.io/Studentfinance_tracker/)
## [REPOSITORY URL](https://github.com/Ines-karega/Studentfinance_tracker)

## Regex Catalog

| Rule | Pattern | Example | Purpose |
| :--- | :--- | :--- | :--- |
| **Description** | `/^\S(?:.*\S)?$/` | "Cafe Lunch" | Forbids leading/trailing spaces. |
| **Amount** | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | "12.50" | Standard currency format (max 2 decimals). |
| **Date** | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | "2025-09-29" | Strict YYYY-MM-DD validation. |
| **Advanced (Duplicate)** | `/\b(\w+)\s+\1\b/i` | "Food Food" | Catches unintentional word repetition. |

## Keyboard Navigation Map

- **Tab**: Move focus forward through links, buttons, and form fields.
- **Shift + Tab**: Move focus backward.
- **Enter / Space**: Activate focused buttons or menu items.
- **Esc**: (If applicable) Close focused dialogs or menus.
- **Skip Link**: Press `Tab` once on refresh to show "Skip to Content".

## Accessibility Notes

- **ARIA Landmarks**: Uses `<header>`, `<main id="main-content">`, `<nav>`, and `<section>` for assistive navigation.
- **Focus Indicators**: High-contrast rings on all interactive elements.
- **Live Regions**: Budget status card uses `role="status"` to announce over-limit warnings immediately.
- **Contrast Check**: Colors meet WCAG AA standards for readability.

## Testing Instructions

1.  **Automated Regex Tests**: Open `tests.html` in any browser to see the unit test suite and regex assertions.
2.  **Manual A11y Audit**:
    - Refresh any page and press `Tab`. Verify "Skip to Content" appears.
    - Navigate to "Add Transaction" and try typing "Lunch Lunch". Verify the duplicate detector triggers.
3.  **Data Integrity**: Export your data via Settings, Clear it, and then Import it back to verify persistence logic.

## Setup & Usage

Since this is a vanilla HTML/CSS/JS project, no installation or build step is required.

1.  **Download**: Clone or download the project files.
2.  **Launch**: Open `index.html` in your web browser.
3.  **Start Tracking**: Add your first transaction to see the dashboard come to life.

## Accessibility & Design

- **Semantic HTML5**: Uses proper landmarks (`<header>`, `<main>`, `<section>`), accessible ARIA roles, and **Skip to Content** links for efficient screen reader navigation.
- **Strict Data Validation**:
  - Descriptions are validated against accidental leading/trailing whitespace.
  - **Duplicate Word Check**: Intelligent regex detects repeated words (e.g., "Food Food") to maintain data quality.
- **Design System**: Built on a robust CSS variable system for consistent spacing, typography (Inter & Outfit), and colors.
- **Dark Theme**: Specifically engineered for reduced eye strain and high readability.
- **Zero Frameworks**: 100% Vanilla JS, CSS, and HTML for maximum performance and compatibility.

## Project Structure

```text
/
├── index.html            # Dashboard & Spending Trends
├── transactions.html     # Transaction Management Interface
├── add-transaction.html  # Dedicated Add Transaction Form
├── settings.html         # User Preferences & Data Management
├── about.html            # Documentation & Developer Info
├── styles/
│   ├── variables.css     # Design tokens & Theme overrides
│   ├── components.css    # Centralized UI components & Responsive logic
│   ├── global.css        # Base layout & Typography
│   └── reset.css         # CSS Normalization
└── scripts/
    ├── utils.js          # Theme manager, Currency formatter, & Shared helpers
    ├── dashboard.js      # Aggregation logic & Chart rendering
    ├── transactions.js   # CRUD operations & Table management
    ├── settings.js       # Preference handling & Import/Export logic
    └── add-transaction.js # Form validation & Entry creation
```

## Credits

- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) and [Outfit](https://fonts.google.com/specimen/Outfit).
- **Icons**: Lean, CSS-based iconography (no external image assets or emoji dependencies).
- **Developed by**: Ines Uwase Karega

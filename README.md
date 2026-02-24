<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1f8acd2e-dccf-4b90-9b10-bea4ccfa7542

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Detailed
Key Features
JSON-Powered Backend: A custom Express server manages a data.json file, allowing you to persist your watchlist across sessions.
Real-time Market Data: Integrates with the CoinGecko API to provide live prices, 24h changes, and market capitalization for top cryptocurrencies.
Web3 Aesthetic: A "Hardware Specialist" design (Recipe 3) with a dark, technical interface, monospace data points, and emerald accents.
Interactive Dashboard:
Live Charts: Visualizes price trends using recharts.
Persistent Watchlist: Add or remove assets from your watchlist with instant synchronization to the JSON backend.
Wallet Simulation: A "Connect Wallet" feature that simulates blockchain authentication.
Security Insights: A dynamic security score widget to monitor wallet health.
Technical Stack
Frontend: React 19, Tailwind CSS, Lucide Icons, Motion (Framer Motion).
Data Fetching: TanStack Query (React Query) for robust API state management.
Backend: Node.js with Express, using fs/promises for JSON file manipulation.
Charts: Recharts for high-performance data visualization.

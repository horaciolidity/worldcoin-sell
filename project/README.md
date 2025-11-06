# WLD Exchange Hub

A modern web application for exchanging Worldcoin (WLD) tokens built with React, Vite, and TailwindCSS.

## Features

- **Beautiful Modern UI**: Glassmorphism design with soft gradients and smooth transitions
- **Complete Exchange Flow**: From landing page to transaction status tracking
- **Mock Authentication**: Email/password login and guest mode (no backend required)
- **Real-time Exchange Rates**: Display current WLD conversion rates for USD and ARS
- **Multiple Send Methods**: Manual wallet transfer or World App integration
- **Transaction Tracking**: Beautiful timeline view showing transaction status
- **Fully Responsive**: Mobile-first design that works on all devices

## Pages

1. **Home/Landing** - Hero section with call-to-action
2. **Login/Register** - Simple authentication UI with guest mode
3. **Dashboard** - Balance overview and exchange rate display
4. **Exchange** - WLD to fiat conversion form with multiple send methods
5. **Transaction Status** - Timeline view of transaction progress

## Installation

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── Layout.tsx           # Main layout with sidebar navigation
├── context/
│   └── AuthContext.tsx      # Authentication state management
├── pages/
│   ├── Home.tsx            # Landing page
│   ├── Login.tsx           # Authentication page
│   ├── Dashboard.tsx       # User dashboard
│   ├── Exchange.tsx        # Exchange form
│   └── Status.tsx          # Transaction status
├── App.tsx                 # Main app with routing
├── main.tsx               # App entry point
└── index.css              # Global styles
```

## Configuration

### Wallet Address for Manual Sending

To edit the wallet address displayed for manual WLD transfers, open `src/pages/Exchange.tsx` and modify the `walletAddress` constant:

```typescript
const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
```

### Exchange Rates

Exchange rates are currently hardcoded in the components. To modify them:

- **Dashboard**: Edit the `exchangeRate` state in `src/pages/Dashboard.tsx`
- **Exchange Form**: Edit the `exchangeRate` constant in `src/pages/Exchange.tsx`

### Mock Transaction Data

Sample transactions are displayed in the Status page. To modify them, edit the `transactions` array in `src/pages/Status.tsx`.

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Design Features

- Glassmorphism effects with backdrop blur
- Gradient backgrounds and buttons
- Smooth transitions and hover effects
- Mobile-responsive sidebar navigation
- Copy-to-clipboard functionality
- Status badges and timeline components
- Modal dialogs for confirmations

## Notes

- This is a frontend-only application with mock authentication
- No actual blockchain transactions are performed
- All transaction processing is simulated
- Exchange rates are placeholders and should be connected to a real API in production
- The wallet address shown is for demonstration purposes only

## License

MIT

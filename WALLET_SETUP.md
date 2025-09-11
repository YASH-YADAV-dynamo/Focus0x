# Wallet Connection Setup

## To make the wallet connection work properly:

### 1. Get a WalletConnect Project ID
1. Go to https://cloud.walletconnect.com/
2. Sign up/Login
3. Create a new project
4. Copy your Project ID

### 2. Create Environment File
Create a `.env.local` file in the root directory with:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

### 3. Restart the Development Server
```bash
npm run dev
```

## Current Setup
- ✅ RainbowKit configured with Focus0x branding
- ✅ Multiple wallet support (MetaMask, WalletConnect, etc.)
- ✅ Multiple chains enabled (Mainnet, Arbitrum, Testnets)
- ✅ Dark theme with Focus0x green accent color

## Testing
1. Disconnect your wallet (if connected)
2. Refresh the page
3. You should see the "Connect Your Wallet" screen
4. Click the connect button to test wallet connection

## Note
The app will work with a demo project ID for basic testing, but for production use, you should get a real WalletConnect Project ID.

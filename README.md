# Trip Expenses

Trip Expenses is an Ionic + Angular mobile app for planning trips, tracking expenses, and managing a traveler profile. Build as a demo app for learning purposes.

## Demo

https://github.com/user-attachments/assets/3536b178-24a5-45e4-9f0f-d63ab18c2931



## Tech Stack

- Ionic 8 + Angular 21 (standalone components)
- Capacitor 8 (Android + iOS)
- Firebase (Firestore + Storage)
- ESLint + Prettier

## Prerequisites

- Node.js 22+ (recommended for Angular 21 and Capacitor 8)
- npm
- Ionic CLI (`npm i -g @ionic/cli`) for `ionic serve`
- Android Studio / Xcode (for native builds and runs)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app locally:

   ```bash
   ionic serve
   ```

   You can also use:

   ```bash
   npm start
   ```

## Capacitor Workflows

After web changes or after adding new capacitor plugins, sync native projects:

```bash
npm run build
npx cap sync
```

Open native projects:

```bash
npx cap open android
npx cap open ios
```

Run directly on a device/emulator:

```bash
npx cap run android
npx cap run ios
```

## Firebase Configuration

Firebase app configuration is stored in:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Native Firebase config files (required for device builds):

- `android/app/google-services.json`
- `ios/App/App/GoogleService-Info.plist`

These native files are intentionally ignored by git, so each developer can use their own Firebase project configuration.

## Project Structure

- `src/app/features` - Main feature pages (trips, expenses, profile)
- `src/app/core` - Models, constants, repositories, shared services
- `src/app/shared` - Shared UI components and pipes
- `android` / `ios` - Native Capacitor projects

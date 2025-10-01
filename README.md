# KeyGo - Drive it without driving

A peer-to-peer car relocation app for Sweden, built with React Native and TypeScript.

## 🚗 Overview

KeyGo is a mobile application that connects car owners with verified drivers for car relocation services. Similar to Tiptapp but specifically for cars, it allows owners to post requests for moving their vehicles from one location to another, while drivers can accept these requests and get paid for the service.

## ✨ Features

### MVP Features (6 Weeks)
- **Clean Map Interface**: Apple Find My app-inspired design with car/request markers
- **Bottom Navigation**: 5-tab navigation (Home, Requests Nearby, Get Driver Now, My Requests, Account)
- **Request Management**: Post, accept, and track car relocation requests
- **Real-time Chat**: In-app messaging between car owners and drivers
- **GPS Tracking**: Live trip tracking with route recording
- **Payment Escrow**: Secure payment processing with Stripe/Swish integration
- **Rating System**: Reviews and ratings for completed trips
- **Authentication**: Firebase auth with BankID placeholder

### Design Principles
- **Apple-inspired UI**: Clean, minimal design with white backgrounds
- **Modern Typography**: Clean fonts with proper hierarchy
- **Color Scheme**: White background, black/blue text, green action buttons
- **Modular Architecture**: Scalable structure for future features

## 🛠 Tech Stack

- **Frontend**: React Native + TypeScript
- **Navigation**: React Navigation 7
- **Maps**: React Native Maps
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payments**: Stripe + Swish integration
- **State Management**: React Context (future: Redux Toolkit)
- **Styling**: StyleSheet with design system

## 📱 Screens

### Main Navigation Tabs
1. **Home**: Map view with nearby car requests
2. **Requests Nearby**: List of available requests in the area
3. **Get Driver Now**: Create new relocation requests (prominent green button)
4. **My Requests**: Manage your posted/accepted requests
5. **Account**: User profile, settings, and app preferences

### Additional Screens
- **Authentication**: Login/Register with BankID placeholder
- **Request Details**: Detailed view of specific requests
- **Chat**: Real-time messaging between users
- **Payment**: Secure escrow payment processing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KeyGo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (if developing for iOS)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start the Metro bundler**
   ```bash
   npm start
   ```

5. **Run the app**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/          # Design system (colors, typography, spacing)
├── navigation/         # Navigation configuration
├── screens/           # Screen components
├── services/          # API and external service integrations
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🎨 Design System

### Colors
- **Primary**: #007AFF (iOS Blue)
- **Secondary**: #34C759 (iOS Green)
- **Text**: #000000 (Black) / #6B7280 (Gray)
- **Background**: #FFFFFF (White)

### Typography
- **Font Family**: System fonts
- **Sizes**: 12px - 48px scale
- **Weights**: Regular, Medium, SemiBold, Bold

## 🔧 Development

### Available Scripts
- `npm start` - Start Metro bundler
- `npm run dev` - Start with cache reset
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent naming conventions

## 📋 Roadmap

### Phase 1: MVP (6 weeks) ✅
- [x] Project setup and navigation
- [x] Basic UI components and screens
- [x] Map integration
- [ ] Firebase setup
- [ ] Authentication flow
- [ ] Request management
- [ ] GPS tracking
- [ ] Chat system
- [ ] Payment integration
- [ ] Rating system

### Phase 2: Enhanced Features
- [ ] Push notifications
- [ ] Advanced filtering
- [ ] Insurance integration
- [ ] Key pickup logic
- [ ] Return cost calculations

### Phase 3: Scale & Optimize
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Advanced security features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support or questions, please contact the development team.

---

**KeyGo** - Making car relocation simple and secure in Sweden 🇸🇪
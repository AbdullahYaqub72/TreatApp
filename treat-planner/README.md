# Treat Planner

A beautiful, modern web application for planning group events, managing treats, splitting bills, and tracking RSVPs.

## 🌟 Features

- **Day Plans Management**: Create and organize day plans with multiple events
- **Event Tracking**: Add treats (food, cricket, movies, etc.) with dates, locations, and details
- **Bill Splitting**: Automatically split bills among attendees with payment tracking
- **RSVP System**: Track who's coming, maybe, or not coming to events
- **My Bills Dashboard**: See what you owe and to whom with payment details
- **Unscheduled Events**: Track events without specific dates
- **Google Maps Integration**: Add location links to events
- **Real-time Updates**: Firebase-powered real-time synchronization
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v3
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router v6
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd treat-planner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔥 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Google Authentication**
3. Create a **Firestore Database** (start in test mode, then apply security rules)
4. Add `localhost` and your deployed domain to **Authorized Domains**
5. Apply the Firestore security rules from `firestore.rules`
6. Create required Firestore indexes (check console for index links)

## 🔒 Security Rules

The app uses Firebase Security Rules to restrict create/update/delete operations to authorized emails. Update the rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.email == 'abdullahyaqub555@gmail.com' || 
         request.auth.token.email == '2020cs72@gmail.com');
    }
  }
}
```

## 📱 Pages

- **Dashboard**: Overview of all day plans with stats
- **Day Plan Details**: View and manage events for a specific plan
- **All Events**: List of all treats added by admins
- **My Bills**: Track what you owe with payment details
- **Unscheduled Events**: Events without specific dates

## 🎨 Key Features

### Bill Splitting
- Automatically calculates per-person amounts
- Tracks who paid and who owes money
- Shows payment details (bank account, JazzCash, etc.)
- Real-time debt calculations

### RSVP Management
- Three status options: Coming, Maybe, Not Coming
- See who's attending each event
- Summary view on dashboard

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## 🚀 Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically detect Vite and configure the build settings.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a private project. For authorized contributors only.

## 📄 License

Private - All Rights Reserved

## 👨‍💻 Author

Abdullah Yaqoob

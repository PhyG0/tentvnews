# tentvnews - Modern News Web Application

A scalable, modern news platform built with React, Firebase, and Azure, optimized for users in India.

## 🚀 Features

- **Multi-role Authentication**: Google OAuth and Email/OTP login
- **Role-based Access**: Viewer, Creator, and Admin roles
- **Smart Feed Algorithm**: Ranked articles based on recency and engagement
- **Rich Content**: Articles with images stored in Azure Blob Storage
- **Responsive Design**: Mobile-first premium UI with India-inspired colors
- **Search & Filter**: Category filtering and search functionality
- **Admin Dashboard**: User management and article moderation

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Storage**: Azure Blob Storage (images only)
- **Routing**: React Router v6
- **Styling**: Vanilla CSS with custom design system
- **Date Handling**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)
2. **Firebase Project** with:
   - Authentication (Google + Email/Link providers)
   - Firestore Database
   - Cloud Functions (Blaze plan required)
3. **Azure Storage Account** with:
   - Container named `images`
   - Blob public read access
   - Storage account name and key

## ⚙️ Setup Instructions

### 1. Clone and Install

```bash
cd tentvnews
npm install
cd functions
npm install
cd ..
```

### 2. Configure Firebase

Create `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
VITE_AZURE_STORAGE_CONTAINER=images
VITE_AZURE_STORAGE_BASE_URL=https://your_storage_account.blob.core.windows.net

VITE_CLOUD_FUNCTIONS_URL=http://localhost:5001/your_project_id/us-central1
```

### 3. Configure Cloud Functions

Create `functions/.env` file:

```env
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
AZURE_STORAGE_ACCOUNT_KEY=your_storage_key
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
```

### 4. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Deploy Cloud Functions

```bash
cd functions
npm install
firebase deploy --only functions
cd ..
```

Update `VITE_CLOUD_FUNCTIONS_URL` in `.env` with your production functions URL.

### 6. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🎨 Design System

The app uses a premium design system with:

- **India-inspired colors**: Saffron (#FF9933), Green (#138808), Navy Blue (#000080)
- **Typography**: Inter (UI), Merriweather (articles)
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first with breakpoints at 768px

## 👥 User Roles

### Viewer (Default)
- Read articles
- Browse categories
- Search news
- View profiles

### Creator
- All Viewer permissions
- Create/edit/delete own articles
- Upload images
- Save drafts
- View analytics

### Admin
- All Creator permissions
- Promote/revoke user roles
- Edit/delete any article
- Feature articles
- Moderate content

## 📂 Project Structure

```
tentvnews/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # Firebase, Azure, auth services
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main app component
│   └── index.css        # Design system
├── functions/           # Cloud Functions
│   └── src/
│       ├── index.js     # Functions entry point
│       ├── azure.js     # SAS token generation
│       ├── auth.js      # User profile creation
│       └── articles.js  # Article triggers
├── public/              # Static assets
└── firestore.rules      # Security rules
```

## 🔐 Security

- **Firestore Rules**: Role-based access control
- **SAS Tokens**: Short-lived (15min) for image uploads
- **Authentication**: Firebase Auth with rate limiting
- **Input Validation**: Client and server-side validation

## 🚀 Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Environment Variables

Update production `.env` with:
- Production Firebase config
- Production Cloud Functions URL
- Azure production credentials

## 📊 Feed Algorithm

Articles are ranked using:

1. **Featured** articles always appear first
2. **Recency score** with exponential decay (48-hour boost)
3. **Engagement score** based on view count (logarithmic)
4. **Weighted combination** (70% freshness, 30% engagement)

## 🎯 TODO / Future Enhancements

- [ ] Implement rich text editor (Lexical/Tiptap)
- [ ] Add inline image upload support
- [ ] Build article creation/editing UI
- [ ] Implement real-time notifications
- [ ] Add comment system
- [ ] Build analytics dashboard
- [ ] Add social sharing
- [ ] Implement PWA features
- [ ] Add dark mode
- [ ] Build mobile app (React Native)

## 💰 Cost Estimation

**Monthly costs for moderate traffic:**

- **Firebase**: Free tier (50K reads, 20K writes/day)
- **Cloud Functions**: Blaze plan (~₹100-300/month)
- **Azure Blob Storage**: Hot LRS (~₹150-500/month)

**Total**: ~₹250-800/month for MVP

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.

## 📧 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for India's digital news ecosystem**

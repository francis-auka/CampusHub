# Campus Hub - Student Freelance Marketplace

A modern, minimalistic freelance marketplace connecting students with MSMEs (Micro, Small, and Medium Enterprises) for tasks, internships, attachments, and project-based work.

## 🎯 Project Overview

Campus Hub is inspired by Upwork but tailored specifically for the student ecosystem. Students can browse tasks, apply for gigs, and get assigned internships or attachments. MSMEs can post tasks, review applicants, and assign work.

## ✨ Features

### Current Implementation (MVP Phase 1)
- ✅ **Landing Page** - Hero section, features, how-it-works, and CTAs
- ✅ **Authentication Pages** - Login and Register with role selection (Student/MSME)
- ✅ **Task Browsing** - Filter by category, type, budget; search functionality
- ✅ **Student Dashboard** - Stats, assigned tasks, applied tasks, recommendations
- ✅ **Design System** - Tailwind CSS with custom Campus Hub theme

### Planned Features (Future Phases)
- 🔄 MSME Dashboard
- 🔄 Task Details Page
- 🔄 Messaging System (Real-time with Socket.io)
- 🔄 User Profiles (Student & MSME)
- 🔄 Task Assignment & Notifications
- 🔄 Reviews & Ratings
- 🔄 Payment Integration (M-Pesa)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campus-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
campus-hub/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── TaskBrowsingPage.jsx
│   │   └── StudentDashboard.jsx
│   ├── contexts/       # React Context for state management
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component with routes
│   ├── index.css       # Global styles + Tailwind
│   └── main.jsx        # App entry point
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#10B981` (Emerald)
- **Neutral Grays**: `#F9FAFB` to `#111827`

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 24-48px
- **Body**: Regular, 14-16px

### Components
- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- **Cards**: `.card`, `.task-card`
- **Inputs**: `.input`
- **Tags/Badges**: `.tag`, `.badge-success`, `.badge-warning`, `.badge-error`

See `design_system.md` in the artifacts folder for complete specifications.

## 🛣️ Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Homepage with hero and features |
| `/login` | LoginPage | User login |
| `/register` | RegisterPage | User registration with role selection |
| `/tasks` | TaskBrowsingPage | Browse and filter available tasks |
| `/dashboard/student` | StudentDashboard | Student dashboard with stats and tasks |

## 🔧 Technologies Used

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server
- **Axios** - HTTP client (installed, ready for backend integration)

### Planned Backend
- **Node.js + Express** - Server
- **MongoDB** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time messaging
- **Multer** - File uploads

## 📝 Development Guidelines

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Use design system classes from `index.css`

### Styling
- Use Tailwind utility classes
- Follow the design system color palette
- Use predefined component classes (`.btn-primary`, `.card`, etc.)

### State Management
- Currently using local component state
- Context API ready in `src/contexts/` for global state
- Consider Redux for complex state needs

## 🎯 Next Steps

### Immediate Tasks
1. **Backend Setup**
   - Initialize Node.js/Express server
   - Set up MongoDB connection
   - Create API routes for authentication

2. **Complete Core Pages**
   - MSME Dashboard
   - Task Details Page
   - User Profile Pages

3. **Authentication Integration**
   - Connect login/register forms to backend
   - Implement JWT token management
   - Add protected routes

4. **Task System**
   - Task posting functionality
   - Application submission
   - Task assignment workflow

### Phase 2 Features
- Real-time messaging
- File uploads
- Reviews and ratings
- Advanced search and filters

### Phase 3 Features
- Payment integration
- Analytics dashboard
- AI-based task matching
- Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For questions or support, please contact:
- Email: support@campushub.com
- Website: https://campushub.com

---

**Built with ❤️ for students and MSMEs**

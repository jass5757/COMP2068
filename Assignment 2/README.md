# To-Do List Web Application

A full-stack task management application built with Node.js, Express, MongoDB, and Handlebars.

## 🌐 Live Demo
[Your Live Site URL Here - Update after deployment]

## 📋 Description

This application helps users organize their daily tasks efficiently. Users can create, read, update, and delete tasks with features like priority levels, due dates, and completion tracking. The app includes authentication via local registration and GitHub OAuth, allowing users to securely manage their personal task lists.

## ✨ Features

### Core Features
- **User Authentication**
  - Local registration and login with email/password
  - GitHub OAuth integration
  - Secure session management with passport.js
  
- **Task Management (CRUD)**
  - Create new tasks with title, description, priority, and due date
  - View all personal tasks in an organized list
  - Edit existing tasks
  - Delete tasks with confirmation
  - Mark tasks as completed/incomplete
  
- **Public Task Viewing**
  - Browse all tasks from the community (read-only)
  - See task creator names and details

### Additional Feature: Real-Time Notifications System 🔔

**Implementation:**
The application includes an intelligent notification system that helps users stay on top of their tasks:

1. **Automatic Task Monitoring**: The system checks for overdue and due-today tasks every minute
2. **Visual Notifications**: A warning badge appears on the My Tasks page when tasks need attention
3. **Browser Notifications**: Native browser notifications alert users about pending tasks
4. **Smart Detection**: 
   - Identifies tasks past their due date (overdue)
   - Flags tasks due on the current day
   - Provides real-time count of pending tasks

**Technologies Used:**
- Client-side JavaScript with fetch API for asynchronous notifications
- Server-side route (`/tasks/api/notifications`) that queries MongoDB
- Browser Notification API for native desktop alerts
- setInterval for periodic checking (every 60 seconds)

This feature enhances user productivity by ensuring important tasks are never forgotten.

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Local Strategy & GitHub OAuth)
- **Templating**: Handlebars (HBS)
- **Frontend**: Bootstrap 5, Font Awesome, JavaScript
- **Session Management**: express-session with connect-mongo
- **Security**: bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- GitHub OAuth App (for GitHub login)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   Create a `.env` file in the root directory with the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key_here
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
   PORT=3000
   ```

4. **Setup GitHub OAuth**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Homepage URL: `http://localhost:3000`
   - Set Callback URL: `http://localhost:3000/auth/github/callback`
   - Copy Client ID and Secret to .env

5. **Setup MongoDB**
   - Create a MongoDB Atlas account at mongodb.com
   - Create a new cluster
   - Get your connection string and add it to .env

6. **Run the application**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

7. **Access the app**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
todo-app/
├── config/
│   ├── database.js          # MongoDB connection
│   └── passport.js           # Passport authentication strategies
├── models/
│   ├── Task.js              # Task schema
│   └── User.js              # User schema
├── public/
│   ├── stylesheets/
│   │   └── style.css        # Custom CSS
│   └── javascripts/
│       └── client.js        # Client-side JavaScript
├── routes/
│   ├── index.js             # Home and public routes
│   ├── auth.js              # Authentication routes
│   └── tasks.js             # Task CRUD routes
├── views/
│   ├── layouts/
│   │   └── main.hbs         # Main layout template
│   ├── partials/
│   │   ├── header.hbs       # Navigation header
│   │   └── footer.hbs       # Footer
│   ├── tasks/
│   │   ├── index.hbs        # Task list view
│   │   ├── add.hbs          # Add task form
│   │   ├── edit.hbs         # Edit task form
│   │   └── delete.hbs       # Delete confirmation
│   ├── index.hbs            # Home page
│   ├── login.hbs            # Login page
│   ├── register.hbs         # Registration page
│   └── public-tasks.hbs     # Public task viewing
├── app.js                   # Express app configuration
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## 🚀 Deployment

This application is ready to be deployed on cloud platforms like:
- Render (Recommended)
- Heroku
- Railway
- Vercel
- AWS

**Before deployment:**
1. Update the GITHUB_CALLBACK_URL in .env to your production URL
2. Update GitHub OAuth app settings with production URLs
3. Whitelist your hosting IP in MongoDB Atlas
4. Set all environment variables in your hosting platform

## 👤 Author

[Your Name]
COMP 2068 - Assignment 2

## 📝 License

This project was created for educational purposes as part of the COMP 2068 course.

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- Font Awesome for icons
- MongoDB Atlas for cloud database hosting
- GitHub for OAuth integration
- Course instructor for project guidance

## 📸 Screenshots

[Add screenshots of your application here after deployment]

---

**Note**: This application was built as a learning project for COMP 2068. All code is original unless cited in comments.
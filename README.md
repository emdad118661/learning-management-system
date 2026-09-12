# 🎓 LMS Platform - Learning Management System

A full-featured **Learning Management System (LMS)** built with the **MERN Stack** (MongoDB, Express.js, Next.js/React, Node.js). This platform allows teachers to create and manage courses, while students can enroll, track their progress, and view class schedules.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login with JWT authentication
* Role-based access control (Student / Teacher)
* Secure password hashing with bcrypt (10 salt rounds)
* Session management with cookies

### 👨‍🏫 Teacher Features

* Create, update, and delete courses
* Upload video lessons via Cloudinary
* Add text content for each lesson
* Create and manage calendar events
* View all created courses in the dashboard
* Delete own calendar events

### 👨‍🎓 Student Features

* Browse all available courses
* View course details with a video player
* Mark lessons as complete (Green Tick system)
* Track progress with a percentage bar
* View a personal learning dashboard
* Read-only calendar access for class schedules

### 📅 Calendar System

* Teachers can add events by clicking any date
* Students can view events (read-only)
* Teachers can delete their own events
* Monthly calendar view with navigation
* Timezone-aware date handling

### 📊 Progress Tracking

* Per-lesson completion tracking
* Course-wise progress percentage
* Student dashboard with statistics
* Visual progress bars
* Green tick indicator for completed lessons

### 🎨 UI/UX

* Responsive design with Tailwind CSS
* Clean and modern interface
* Password show/hide toggle
* Loading states and error handling
* Success and error notifications

---

## 🛠️ Tech Stack

| Layer                 | Technology                                   |
| --------------------- | -------------------------------------------- |
| **Frontend**          | Next.js 14 (App Router), React, Tailwind CSS |
| **Backend**           | Node.js, Express.js                          |
| **Database**          | MongoDB Atlas                                |
| **Authentication**    | JWT (JSON Web Tokens)                        |
| **File Upload**       | Cloudinary, Multer                           |
| **State Management**  | React Context API                            |
| **HTTP Client**       | Axios                                        |
| **Password Security** | bcryptjs                                     |

---

## 📁 Project Structure

```text
lms-project/
├── server/                     # Backend (Express)
│   ├── config/                 # Database configuration
│   ├── middleware/             # Authentication middleware
│   │   └── authMiddleware.js
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Progress.js
│   │   └── CalendarEvent.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── courseRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── calendarRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   └── cloudinary.js
│   ├── .env
│   └── index.js
│
└── client/                     # Frontend (Next.js)
    ├── app/
    │   ├── login/
    │   ├── register/
    │   ├── courses/
    │   │   └── [id]/
    │   ├── calendar/
    │   ├── teacher/
    │   │   └── dashboard/
    │   ├── student/
    │   │   └── dashboard/
    │   ├── layout.js
    │   └── page.js
    ├── components/
    │   └── Navbar.js
    ├── context/
    │   └── AuthContext.js
    ├── .env.local
    └── package.json
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description         | Auth |
| ------ | -------------------- | ------------------- | ---- |
| POST   | `/api/auth/register` | Register a new user | ❌    |
| POST   | `/api/auth/login`    | Login user          | ❌    |

### Courses

| Method | Endpoint           | Description         | Auth      |
| ------ | ------------------ | ------------------- | --------- |
| GET    | `/api/courses`     | Get all courses     | ❌         |
| GET    | `/api/courses/:id` | Get a single course | ❌         |
| POST   | `/api/courses`     | Create a course     | ✅ Teacher |
| PUT    | `/api/courses/:id` | Update a course     | ✅ Teacher |
| DELETE | `/api/courses/:id` | Delete a course     | ✅ Teacher |

### Progress

| Method | Endpoint                  | Description             | Auth      |
| ------ | ------------------------- | ----------------------- | --------- |
| POST   | `/api/progress/complete`  | Mark lesson as complete | ✅         |
| GET    | `/api/progress/:courseId` | Get course progress     | ✅         |
| GET    | `/api/progress/all`       | Get all progress        | ✅ Student |

### Calendar

| Method | Endpoint            | Description     | Auth      |
| ------ | ------------------- | --------------- | --------- |
| GET    | `/api/calendar`     | Get all events  | ❌         |
| POST   | `/api/calendar`     | Create an event | ✅ Teacher |
| DELETE | `/api/calendar/:id` | Delete an event | ✅ Teacher |

### Upload

| Method | Endpoint      | Description               | Auth |
| ------ | ------------- | ------------------------- | ---- |
| POST   | `/api/upload` | Upload file to Cloudinary | ❌    |

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js (v14 or higher)
* MongoDB Atlas account
* Cloudinary account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd lms-project
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend server.

```bash
npm run dev

# or

nodemon index.js
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env.local` file inside the `client/` folder.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend.

```bash
npm run dev
```

### 4. Access the Application

* **Frontend:** `http://localhost:3000`
* **Backend:** `http://localhost:5000`

---

## 🔒 Security Features

* [x] Password hashing with bcrypt (10 salt rounds)
* [x] JWT authentication with a 7-day expiration
* [x] Role-based access control (Teacher/Student)
* [x] Protected API routes with middleware
* [x] CORS enabled for cross-origin requests
* [x] Environment variables for sensitive data
* [x] No plain-text passwords stored

---

## 📸 Screenshots

### Login Page

* Email & Password input
* Show/Hide password toggle
* Registration link

### Teacher Dashboard

* Create course form
* Upload thumbnails and videos
* Manage calendar events
* View all created courses

### Student Dashboard

* Progress statistics
* Course-wise completion percentage
* Visual progress bars
* Continue learning section

### Calendar

* Monthly calendar view
* Click to add events (Teachers)
* Delete events (Teachers)
* Read-only access (Students)

### Course Detail

* Video player
* Lesson list with green ticks
* Mark Complete button
* Text content for each lesson

## 🤝 Contributing

1. Fork the repository.

2. Create a feature branch.

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. Commit your changes.

   ```bash
   git commit -m "Add some AmazingFeature"
   ```

4. Push to the branch.

   ```bash
   git push origin feature/AmazingFeature
   ```

5. Open a Pull Request.

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 👨‍💻 Developer

Built with ❤️ using the MERN Stack.

### Tech Stack Highlights

* Next.js 14 for an SEO-friendly frontend
* Express.js for a robust backend API
* MongoDB Atlas for a cloud database
* Cloudinary for video and image hosting
* Tailwind CSS for a modern UI

---

## 📞 Support

If you encounter any issues or have questions, please create an issue in the repository or contact the developer.

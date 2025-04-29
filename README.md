# BugTracker Pro

A web application for tracking bugs with user authentication, roles (admin/developer/tester), email verification, file uploads, and real-time statistics.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React Native (Expo + TypeScript)
- **Authentication:** JWT, bcryptjs, nodemailer
- **File Uploads:** Multer
- **Configuration:** dotenv, CORS

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vprojects2/BugTracker.git
   cd BugTracker
   ```

2. **Create `.env`** in the project root with:
   ```env
   PORT=5000
   MONGO_URI=<your_mongo_uri>
   JWT_SECRET=<your_jwt_secret>
   EMAIL_USER=<your_email>
   EMAIL_PASS=<your_email_app_password>
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Run the application**
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # In a separate terminal, start frontend
   cd ../frontend
   npm start
   ```

## 📄 API Endpoints

### Authentication

| Method | Route                       | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/api/auth/register`        | Register new user        |
| POST   | `/api/auth/login`           | Login & receive JWT      |
| GET    | `/api/auth/verify/:token`   | Verify email address     |

### Bugs

| Method | Route                       | Access Roles             | Description            |
| ------ | --------------------------- | ------------------------ | ---------------------- |
| POST   | `/api/bugs`                 | tester, admin            | Create a new bug       |
| GET    | `/api/bugs`                 | any authenticated user   | List bugs (filterable) |
| PUT    | `/api/bugs/:id`             | admin, developer         | Update a bug           |
| DELETE | `/api/bugs/:id`             | admin                    | Delete a bug           |
| GET    | `/api/bugs/my-created`      | any authenticated user   | Bugs you created       |
| GET    | `/api/bugs/my-assigned`     | developer                | Bugs assigned to you   |
| POST   | `/api/bugs/:id/comments`    | any authenticated user   | Add a comment          |
| POST   | `/api/bugs/:id/upload`      | any authenticated user   | Upload screenshot      |
| GET    | `/api/bugs/stats`           | any authenticated user   | Bug statistics         |
| PUT    | `/api/bugs/:id/assign`      | admin                    | Assign a bug to dev    |

## ⭐ Contributing

Feel free to open issues or submit pull requests to improve the project.

## 📄 License

This project is licensed under the [MIT License](LICENSE).


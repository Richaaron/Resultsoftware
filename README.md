# Folusho Victory School Result Portal

A full-stack web application for managing student results, attendance, and academic records at Folusho Victory School. Built with Node.js/Express backend, React frontend, and PostgreSQL (Supabase) database.

## 🎯 Features

- **Authentication**: Role-based access (Admin, Teacher, Parent)
- **Student Management**: Add, edit, delete students with academic background
- **Result Tracking**: Record and manage student results by subject
- **Attendance**: Track student attendance
- **Teachers**: Manage teacher information
- **Broadsheet Reports**: Generate and view results in spreadsheet format
- **PDF Export**: Export results as PDF documents
- **Settings**: Configure system settings

## 📋 System Requirements

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL 12+ (or Supabase)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### Option 1: Local Development (with Docker)

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Backend setup
cd backend
npm install
# Configure .env.local with DATABASE_URL=postgresql://postgres:postgres@localhost:5432/result_software
npm run dev

# Frontend setup (new terminal)
cd frontend-react
npm install
npm run dev

# Access the app at http://localhost:5173
# pgAdmin at http://localhost:5050 (admin@example.com / admin)
```

### Option 2: Local Development (Supabase)

```bash
# Configure environment variables
cp backend/.env.example backend/.env.local
cp frontend-react/.env.example frontend-react/.env.local

# Edit backend/.env.local with your Supabase DATABASE_URL

# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend-react
npm install
npm run dev
```

### Option 3: Production (Vercel + Supabase)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
.
├── backend/                    # Express.js server
│   ├── models/                 # Sequelize models (User, Student, Result, etc.)
│   ├── routes/                 # API routes
│   ├── middleware/             # Authentication & authorization
│   ├── utils/                  # Database setup
│   ├── server.js               # Entry point
│   └── package.json
├── frontend-react/             # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── api.js              # Axios configuration
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── vercel.json                 # Vercel deployment config
├── docker-compose.yml          # Docker compose for local PostgreSQL
├── SETUP.md                    # Setup instructions
└── DEPLOYMENT.md               # Deployment guide
```

## 🔧 Configuration

### Backend Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_secure_random_string
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Endpoints

All endpoints require JWT authentication (except login).

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Results
- `GET /api/results` - List all results
- `POST /api/results` - Create result
- `PUT /api/results/:id` - Update result
- `DELETE /api/results/:id` - Delete result

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance` - Record attendance
- `DELETE /api/attendance/:id` - Delete attendance record

### Teachers
- `GET /api/teachers` - List teachers
- `POST /api/teachers` - Create teacher

### Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update settings

### Dashboard
- `GET /api/stats` - Get dashboard statistics

## 👤 Default Credentials

After database initialization:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Teacher | `teacher` | `teacher123` |

**⚠️ Important**: Change these credentials in production!

## 🗄️ Database Schema

### Users
- id, username, password (hashed), fullName, role (ADMIN, TEACHER, PARENT)

### Students
- id, firstName, middleName, lastName, admissionNumber, class, dateOfBirth, dateAdmitted

### Results
- id, studentId, subjectId, score, term, academicYear, gradeId

### Attendance
- id, studentId, date, status (PRESENT, ABSENT, LATE)

### Subjects
- name, category, level (Nigerian Curriculum)

### Teachers
- id, firstName, lastName, email, phone, subjects

## 🛠️ Development

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run linting (if configured)
npm run lint

# Build for production
npm run build
```

### Frontend Development

```bash
cd frontend-react

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🧪 Testing

Run verification script:

```bash
# Linux/Mac
bash verify-setup.sh

# Windows PowerShell
.\Verify-Setup.ps1
```

## 📦 Technologies Used

### Backend
- **Express.js** 5.x - Web framework
- **Sequelize** 6.x - ORM for database
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

### Frontend
- **React** 19.x - UI library
- **Vite** 6.x - Build tool
- **React Router** 7.x - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** 4.x - Styling
- **jsPDF** - PDF generation
- **Lucide React** - Icon library

### Infrastructure
- **Vercel** - Deployment & hosting
- **Supabase** - PostgreSQL database
- **Docker** - Local development (optional)

## 🚢 Deployment

### To Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables (see DEPLOYMENT.md)
4. Deploy automatically on push

### Docker Deployment

```bash
# Build Docker image
docker build -t result-software .

# Run container
docker run -p 5000:5000 -e DATABASE_URL=... result-software
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase project is active
- For Direct Connection, verify IP whitelist

### CORS Errors
- Update FRONTEND_URL environment variable
- Restart backend server

### Port Already in Use
- Change PORT in .env.local
- Or kill process: `lsof -ti:5000 | xargs kill -9` (Linux/Mac)

### Frontend Won't Connect to Backend
- Check VITE_API_URL in frontend .env
- Ensure backend is running on correct port
- Check firewall settings

## 📖 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to Vercel + Supabase

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and logs

## 🎓 Credits

Nigerian Curriculum subjects are integrated for primary and secondary education levels.

---

**Last Updated**: April 2026


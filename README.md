# Projects Manager

A full-stack task management application that allows users to create projects, add tasks, and track progress.

![Status](https://img.shields.io/badge/Status-Complete-green)
![.NET](https://img.shields.io/badge/.NET-10.0-purple)
![React](https://img.shields.io/badge/React-18-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-orange)

## Demo Video

[Watch the Demo Video](https://drive.google.com/file/d/1qRsLpIuH8x4BLmrfzQFTcE4GtDQZvOp6/view?usp=sharing)

## Tech Stack

### Backend
- **.NET 10** - Web API with Controllers
- **Entity Framework Core** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **BCrypt** - Password hashing

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **React Router DOM** - Routing
- **Axios** - HTTP client

## Features

- User authentication (Register/Login)
- Create and manage projects
- Add, complete, and delete tasks
- Search and filter tasks (by status & keyword)
- Track project progress with visual progress bars
- Modern, responsive UI (shadcn-inspired design)

## Project Structure
```
projects-manager/
├── client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # Auth context
│   │   ├── hooks/                   # Custom hooks (TanStack Query)
│   │   ├── pages/                   # Page components
│   │   ├── api.ts                # API service
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── queryClient.ts             
│   │   └── types.ts
│   ├── .env
│   └── package.json
│
├── server/
│   └── ProjectsManager.Api/         # Backend (.NET)
│       ├── Controllers/             # API endpoints
│       ├── Data/                    # DbContext
│       ├── DTOs/                    # Data transfer objects
│       ├── Middleware/              # Error handling
│       ├── Models/                  # Database entities
│       ├── Services/                # Business logic
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       └── Program.cs
│
├── .gitignore
├── ProjectsManager.sln
└── README.md
```

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)

---

### 1. Start Backend
```bash
cd server/ProjectsManager.Api

# Restore packages
dotnet restore

# Run migrations (creates database)
dotnet ef database update

# Start the server
dotnet run
```

Backend runs at: `http://localhost:5207`

---

### 2. Start Frontend
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Testing the App

1. Open the app at `http://localhost:5173`
2. Click **"Create account"** to register
3. Start creating projects and tasks

Example credentials you can use:
- Email: `demoaddress@example.com`
- Password: `demo123`

---

## Database Setup

The application uses **SQLite** - no additional database setup required!

- Database file is created automatically on first run
- Location: `server/ProjectsManager.Api/projectsmanager.db`

---

## API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Projects (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List user's projects |
| GET | `/api/projects/:id` | Get project with progress |
| POST | `/api/projects` | Create project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:id/tasks` | List tasks (supports `?status=` & `?search=`) |
| POST | `/api/projects/:id/tasks` | Create task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task completion |
| DELETE | `/api/tasks/:id` | Delete task |

---

## Configuration

### Backend (`appsettings.Development.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=projectsmanager.db"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "ProjectsManager",
    "Audience": "ProjectsManagerUsers"
  }
}
```

### Frontend (`.env`)
```env
API_URL=http://localhost:5207/api
```

---

## Technical Decisions

| Decision | Reasoning |
|----------|-----------|
| **SQLite** | Zero-configuration, perfect for demo projects |
| **TanStack Query** | Efficient caching, automatic background refetching |
| **React Hook Form** | Better performance than controlled inputs |
| **JWT in localStorage** | Simple for demo; production would use httpOnly cookies |
| **Primary Constructors** | Modern C# 12 syntax, cleaner code |
| **String GUIDs for IDs** | Non-predictable, URL-friendly |

---

## Author

**Houda Boussaid**

- GitHub: [@houdaspace28](https://github.com/houdaspace28)

---
# GhadeerFit Backend API

Backend API for the GhadeerFit video streaming application. Built with Express.js, TypeScript, PostgreSQL, and Prisma ORM.

## Features

- **RESTful API**: Full CRUD operations for videos, notifications, categories, and banners
- **Authentication**: Session-based authentication for admin panel
- **File Upload**: Image upload support for banners using Multer
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Type Safety**: Full TypeScript support throughout the backend
- **Error Handling**: Comprehensive error handling and validation
- **CORS**: Enabled for frontend communication
- **Admin Panel**: Built-in admin interface for content management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **File Upload**: Multer
- **Authentication**: Express Session with bcrypt
- **Validation**: Express Validator

## Prerequisites

Before you begin, ensure you have the following installed:

### For Docker (Recommended)
- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

### For Local Development
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## Quick Start with Docker 🐳 (Recommended)

The easiest way to run the backend is using Docker:

```bash
# Start services (PostgreSQL + Backend)
docker-compose up --build

# Or using Make
make dev-build
```

Access the application:
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **Admin Panel**: http://localhost:5001/admin
- **Login**: http://localhost:5001/login
- **Database**: localhost:5432

## Installation & Setup

### 1. Clone the Repository

```bash
git clone git@github.com:muhammadfayyaz3/ghadeerfit-backend.git
cd ghadeerfit-backend
```

### 2. Install Dependencies

```bash
npm install
```

Or use the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

### 3. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE videostream;

# Exit PostgreSQL
\q
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/videostream?schema=public"
PORT=5000
NODE_ENV=development
SESSION_SECRET="your-secret-key-here-change-in-production"
FRONTEND_URL="http://localhost:3000"
```

Replace `username` and `password` with your PostgreSQL credentials.

### 5. Initialize Database with Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database
npm run prisma:seed

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 6. Start the Development Server

```bash
npm run dev
```

The API will be available at http://localhost:5000

## Docker Deployment 🐳

### Quick Start

```bash
# Development mode with hot reload
docker-compose up --build

# Production mode
docker-compose -f docker-compose.prod.yml up --build -d
```

### Using Makefile Commands

```bash
make help              # Show all available commands
make dev              # Start development environment
make dev-build        # Build and start development
make dev-detached     # Start in detached mode
make prod             # Start production environment
make prod-build       # Build and start production
make prod-detached    # Start production in detached mode
make stop             # Stop all containers
make stop-volumes     # Stop and remove volumes
make clean            # Remove all containers, volumes, and images
make logs             # View logs
make logs-backend     # View backend logs
make logs-db          # View database logs
make db-migrate       # Run database migrations
make db-studio        # Open Prisma Studio
make shell-backend    # Open shell in backend container
make shell-db         # Open PostgreSQL shell
make restart          # Restart all services
make ps               # Show running containers
make build            # Build all images
make build-backend    # Build backend image only
```

### Docker Services

- **postgres**: PostgreSQL 15 database
- **backend**: Express API with auto-migrations

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Access backend shell
docker-compose exec backend sh

# Access database
docker-compose exec postgres psql -U postgres -d videostream

# Restart a service
docker-compose restart backend

# Stop and remove everything
docker-compose down -v
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login | No |
| POST | `/api/auth/logout` | Admin logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Videos

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/videos` | Get all videos | No |
| GET | `/api/videos/:id` | Get video by ID | No |
| POST | `/api/videos` | Create new video | Yes |
| PUT | `/api/videos/:id` | Update video | Yes |
| DELETE | `/api/videos/:id` | Delete video | Yes |

**Request Body (POST/PUT)**:
```json
{
  "title": "Video Title",
  "video_link": "https://www.youtube.com/watch?v=VIDEO_ID",
  "description": "Video description (optional)",
  "categoryIds": ["category-id-1", "category-id-2"]
}
```

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |
| GET | `/api/categories/:id` | Get category by ID | No |
| POST | `/api/categories` | Create new category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

**Request Body (POST/PUT)**:
```json
{
  "name": "Category Name",
  "description": "Category description (optional)"
}
```

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get all notifications | No |
| GET | `/api/notifications/:id` | Get notification by ID | No |
| POST | `/api/notifications` | Create new notification | Yes |
| PUT | `/api/notifications/:id` | Update notification | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |

**Request Body (POST/PUT)**:
```json
{
  "title": "Notification Title",
  "description": "Notification content with HTML support"
}
```

### Banners

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/banners` | Get all active banners | No |
| GET | `/api/banners/all` | Get all banners (including inactive) | Yes |
| POST | `/api/banners` | Create new banner | Yes |
| PUT | `/api/banners/:id` | Update banner | Yes |
| DELETE | `/api/banners/:id` | Delete banner | Yes |

**Request Body (POST/PUT)** - Form Data:
- `image`: Image file (required)
- `title`: Banner title (optional)
- `link_url`: URL to link to (optional)
- `is_active`: Boolean (default: true)
- `order`: Number (default: 0)

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

## Database Schema

### Video Model
```prisma
model Video {
  id          Int             @id @default(autoincrement())
  title       String
  video_link  String
  description String?         @db.Text
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  categories  VideoCategory[]
}
```

### Category Model
```prisma
model Category {
  id          String          @id @default(uuid())
  name        String          @unique
  slug        String          @unique
  description String?         @db.Text
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  videos      VideoCategory[]
}
```

### Notification Model
```prisma
model Notification {
  id          Int      @id @default(autoincrement())
  title       String
  description String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### BannerImage Model
```prisma
model BannerImage {
  id          Int      @id @default(autoincrement())
  title       String?
  image_url   String
  link_url    String?
  is_active   Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── video.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── category.controller.ts
│   │   └── banner.controller.ts
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   ├── video.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── category.routes.ts
│   │   └── banner.routes.ts
│   ├── utils/            # Utility functions
│   │   ├── fileUpload.ts
│   │   └── slugify.ts
│   └── index.ts          # Server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.ts           # Database seed script
├── public/               # Static files
│   ├── admin.html        # Admin panel
│   ├── login.html        # Login page
│   └── images/           # Uploaded images
├── docker-compose.yml    # Docker development setup
├── docker-compose.prod.yml # Docker production setup
├── Dockerfile            # Docker image configuration
├── Makefile              # Make commands
├── setup.sh              # Setup script
└── package.json
```

## Development Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm run start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prisma:seed      # Seed the database
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `SESSION_SECRET` | Secret key for sessions | Required |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm run start
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use
- Change port in `.env` file: `PORT=5001`
- Update frontend API URL accordingly

### Prisma Migration Errors
```bash
# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev

# Deploy migrations in production
npx prisma migrate deploy
```

### Module Not Found Errors
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npm run prisma:generate
```

## Admin Panel

The backend includes a built-in admin panel for managing content:

1. Access the login page: http://localhost:5001/login
2. Login with admin credentials (set up via seed script)
3. Manage videos, categories, notifications, and banners

## API Documentation

### Authentication Flow

1. **Login**: POST `/api/auth/login` with `username` and `password`
2. **Session**: Server creates a session cookie
3. **Protected Routes**: Include session cookie in subsequent requests
4. **Logout**: POST `/api/auth/logout` to destroy session

### File Upload

Banner images are uploaded using multipart/form-data:

```bash
curl -X POST http://localhost:5001/api/banners \
  -H "Cookie: connect.sid=YOUR_SESSION_ID" \
  -F "image=@/path/to/image.jpg" \
  -F "title=Banner Title" \
  -F "link_url=https://example.com"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using Express.js, TypeScript, and PostgreSQL**


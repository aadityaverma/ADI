# React Three.js Admin App

A modern full-stack web application built with React Three.js, featuring 3D visualizations, user authentication, admin dashboard, and containerized deployment with Docker.

## 🚀 Features

### Frontend
- **React 18** with modern hooks and functional components
- **Three.js + React Three Fiber** for stunning 3D graphics and animations
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS** for responsive and modern UI design
- **React Router** for client-side routing
- **Zustand** for lightweight state management
- **React Hook Form** for form validation
- **Lucide React** for beautiful icons

### Backend
- **Node.js + Express** RESTful API server
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with role-based access control
- **bcrypt** for secure password hashing
- **Express Validator** for input validation
- **Rate limiting** and security middleware
- **Comprehensive error handling**

### DevOps & Deployment
- **Docker** with multi-stage builds
- **Docker Compose** for development and production
- **Nginx** reverse proxy with load balancing
- **Health checks** and monitoring
- **Environment-based configuration**

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Security headers (CORS, XSS protection, etc.)
- Role-based access control (User/Admin)

## 🛠️ Tech Stack

### Frontend
- React 18
- Three.js & React Three Fiber
- Vite
- Tailwind CSS
- TypeScript support
- React Router
- Zustand
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Express Validator

### Infrastructure
- Docker & Docker Compose
- Nginx
- MongoDB

## 📁 Project Structure

```
react-threejs-admin-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS styles
│   ├── public/             # Static assets
│   └── Dockerfile          # Frontend production build
├── backend/                 # Node.js backend API
│   ├── models/             # MongoDB models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── controllers/        # Business logic
│   └── utils/              # Utility functions
├── docker-compose.yml       # Production Docker setup
├── docker-compose.dev.yml   # Development Docker setup
├── nginx.conf              # Nginx configuration
└── mongo-init.js           # MongoDB initialization
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- MongoDB (for local development)

### Option 1: Docker Development (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-threejs-admin-app
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development environment**
   ```bash
   # Start all services with hot reload
   npm run docker:dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

3. **Start development servers**
   ```bash
   # In separate terminals
   npm run dev:backend
   npm run dev:frontend
   ```

### Option 3: Production Deployment

1. **Build and start production environment**
   ```bash
   npm run docker:build
   npm run docker:up
   ```

2. **Access through Nginx reverse proxy**
   - Application: http://localhost
   - API: http://localhost/api

## 🔑 Default Credentials

The application comes with pre-configured demo accounts:

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Administrator with full access

### User Account
- **Email**: `user@example.com`
- **Password**: `user123`
- **Role**: Regular user with limited access

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update user profile
POST /api/auth/logout      # User logout
```

### User Management (Protected)
```
GET    /api/users          # Get all users
GET    /api/users/:id      # Get user by ID
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

### Admin Endpoints (Admin Only)
```
GET  /api/admin/stats      # System statistics
GET  /api/admin/users      # Get all users (admin view)
PUT  /api/admin/users/:id/role   # Update user role
POST /api/admin/users      # Create new user
```

## 🎨 UI Components

### Three.js Components
- **Interactive 3D Scene**: Animated sphere with mouse controls
- **Particle Systems**: Beautiful starfield backgrounds
- **Material Effects**: Distortion materials and lighting
- **Responsive Design**: Adapts to different screen sizes

### UI Features
- **Dark Theme**: Modern dark color scheme
- **Responsive Layout**: Mobile-first design
- **Loading States**: Smooth loading animations
- **Toast Notifications**: User feedback system
- **Form Validation**: Real-time validation

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/react-threejs-app?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
CLIENT_URL=http://localhost:3000

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### Docker Configuration

#### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

#### Production
```bash
# Build and start production
docker-compose up -d

# Scale services
docker-compose up -d --scale backend=3
```

## 🚀 Deployment

### Development
1. Hot reload enabled for both frontend and backend
2. Volume mounts for real-time code changes
3. Debug mode enabled

### Production
1. Optimized builds with multi-stage Docker
2. Nginx reverse proxy with load balancing
3. Security headers and rate limiting
4. Health checks and monitoring

## 🧪 Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test

# Run all tests
npm run test
```

## 📊 Monitoring

### Health Checks
- **Frontend**: `/health`
- **Backend**: `/api/health`
- **Nginx**: `/nginx-health`

### Logging
- Application logs available in Docker containers
- Nginx access and error logs
- MongoDB logs

## 🔒 Security

- **Authentication**: JWT tokens with secure expiration
- **Authorization**: Role-based access control
- **Password Security**: bcrypt hashing with salt rounds
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Server-side validation
- **Security Headers**: XSS, CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 5000, and 27017 are available
2. **Docker permissions**: Run Docker commands with appropriate permissions
3. **MongoDB connection**: Check MongoDB is running and accessible
4. **Environment variables**: Verify all required env vars are set

### Docker Issues
```bash
# Reset Docker environment
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### Database Issues
```bash
# Reset MongoDB data
docker-compose down -v
docker volume rm $(docker volume ls -q)
docker-compose up
```

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review the troubleshooting section

## 🗺️ Roadmap

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] File upload capabilities
- [ ] Real-time notifications
- [ ] Advanced 3D scenes
- [ ] Mobile app version
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline

---

**Built with ❤️ using React, Three.js, Node.js, and Docker**

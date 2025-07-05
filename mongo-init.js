// MongoDB initialization script
// This script runs when the container starts for the first time

// Switch to the application database
db = db.getSiblingDB('react-threejs-app');

// Create collections
db.createCollection('users');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "createdAt": -1 });

// Insert default admin user
// Password: admin123 (hashed with bcrypt, cost 12)
db.users.insertOne({
  name: "System Administrator",
  email: "admin@example.com",
  password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewcYr5EaEaUrBHau", // admin123
  role: "admin",
  status: "active",
  emailVerified: true,
  loginCount: 0,
  preferences: {
    theme: "dark",
    notifications: true,
    language: "en"
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert default regular user
// Password: user123 (hashed with bcrypt, cost 12)
db.users.insertOne({
  name: "Demo User",
  email: "user@example.com",
  password: "$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // user123
  role: "user",
  status: "active",
  emailVerified: true,
  loginCount: 0,
  preferences: {
    theme: "dark",
    notifications: true,
    language: "en"
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Database initialized successfully!");
print("Default admin user: admin@example.com / admin123");
print("Default regular user: user@example.com / user123");
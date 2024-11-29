VRV Assignment - Backend Service
A backend service for managing user registration, user data, and associated functionalities.

Features
User registration and management
Cloudinary integration for profile photo uploads
Secure authentication using JWT
API-based architecture with modular controllers and routes.

Technologies Used: 

Node.js: Backend runtime, 
Express: Web framework, 
MongoDB: Database, 
Multer: File upload middleware, 
JWT: JSON Web Token for authentication, 
Cloudinary: Image storage and management, 

Folder Structure: 

/controllers       - Contains logic for handling API requests

/routes            - Defines API routes

/models            - MongoDB models

/middleware        - Middleware functions for authentication and validation

/utils             - Helper functions

API Endpoints:

User Controllers
registerUser: Handles user registration, including avatar upload via Cloudinary.

loginUser: Authenticates users and generates JWT tokens.

logOutUser: Clears refresh tokens and logs out users.

getCurrentUser: Fetches details of the currently authenticated user.
Image Controllers

uploadAvatar: Uploads user profile photos to Cloudinary.

updateProfilePhoto: Replaces the user's avatar with a new upload.

Setup Instructions

Clone the repository:
git clone https://github.com/Anshul2122/vrv-assignment.git

Navigate to the project directory:

cd vrv-assignment

Install dependencies:

npm install

Add a .env file:

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_cloudinary_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Start the server:

npm start

Feel free to reach out for any queries or suggestions! 😊


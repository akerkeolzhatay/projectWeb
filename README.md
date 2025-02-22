```markdown
# Registration and Login System with Node.js and MongoDB

## Overview
This is a simple web application that provides user registration and login functionality. It is built using Node.js, MongoDB, and EJS templating. Passwords are securely hashed using `bcrypt`.

### Features:
- User Registration with unique usernames
- Secure Password Hashing
- Login authentication
- Simple Home Page
- Logout functionality
- User-friendly design with CSS styling

## Prerequisites
Before running the application, make sure you have the following installed on your system:
1. [Node.js] (version 14 or later)
2. [MongoDB]

## Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Set up MongoDB:
- Start your MongoDB server (or use MongoDB Atlas).
- Ensure your database name is `myApp` (or update the connection string in `config.js`).

### 3. Run the application:
```bash
node app.js
```
The server will start on `http://localhost:4000`.

## File Structure
project-folder/
├── public/
│   ├── style.css        # Stylesheet for the application
│   ├── cat.jpg          # Sample image for the home page
├── views/
│   ├── login.ejs        # Login page template
│   ├── signup.ejs       # Signup page template
│   ├── home.ejs         # Home page template
├── src/
│   ├── index.js         # Main server file
│   ├── config.js        # MongoDB schema and connection setup
├── package.json         # Project dependencies and scripts
├── README.md            # Project documentation

## How It Works
### User Registration:
1. Navigate to the signup page at `/signup`.
2. Enter a unique username and password.
3. Passwords are hashed using `bcrypt` before storing them in the database.
4. If the username already exists, an error message is displayed.

### User Login:
1. Navigate to the login page at `/`.
2. Enter your registered username and password.
3. Passwords are validated securely using `bcrypt.compare()`.
4. On successful login, the home page is rendered.

### Logout:
- A "Log Out" button is displayed on the home page. Clicking it will redirect to the login page.

## Additional Notes
- Passwords are hashed with `bcrypt` to ensure security.
- Make sure the `public` directory contains your stylesheets and assets.

## Future Enhancements
- Add session management for better security.
- Implement email verification for user registration.
- Add a password recovery feature.

## Contact
If you have any questions or issues, feel free to reach out at [230196@astanait.edu.kz].
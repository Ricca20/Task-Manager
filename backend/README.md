# Task Manager API

A RESTful API for managing tasks, built with Node.js, Express, and PostgreSQL.

## Features

-   **Authentication**: User registration and login with JWT.
-   **Task Management**: Create, read, update, and delete tasks.
-   **Validation**: Request data validation using Joi.
-   **Security**: Password hashing with bcrypt.

## Prerequisites

-   Node.js (v14 or higher)
-   PostgreSQL
-   npm

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    DB_USER=your_db_user
    DB_HOST=localhost
    DB_NAME=task_manager_db
    DB_PASSWORD=your_db_password
    DB_PORT=5432
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Database Setup:**
    Ensure your PostgreSQL server is running and create the database and tables. You can use the schema provided in `src/models` (or run provided SQL scripts if available).

## Running the Server

-   **Development Mode:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

-   **Production Mode:**
    ```bash
    npm start
    ```

## Running Tests

Run the unit tests using Jest:
```bash
npm test
```

## API Documentation

A Postman collection is included in this repository: `TaskManager.postman_collection.json`.

1.  Open Postman.
2.  Import the `TaskManager.postman_collection.json` file.
3.  Use the collection to test the API endpoints.

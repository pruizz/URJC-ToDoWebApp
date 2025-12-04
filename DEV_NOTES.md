# Project Structure and Development Guide

## Overview

This is a To-Do web application built with Node.js and Express. It follows a layered architecture pattern to separate concerns, making the codebase cleaner and easier to maintain.

- **Backend**: Node.js, Express.js
- **Frontend**: Mustache (for server-side templating), vanilla JavaScript
- **Database**: MongoDB

---

## Directory Structure

Here is a breakdown of the key directories and their purpose:

-   `src/`: Contains all the backend source code.
    -   `adapters/`: Handles the direct communication with the database (e.g., `mongo.adapter.js`).
    -   `middlewares/`: Contains Express middleware, such as the `auth.middleware.js` for handling user authentication.
    -   `repos/`: Acts as a data modeling layer. These files (`task.repo.js`, `user.repo.js`) are responsible for creating standardized objects for our entities.
    -   `routes/`: Defines all the application's API endpoints and view-rendering routes.
    -   `services/`: Contains the core business logic of the application.
    -   `utils/`: Holds utility functions that can be reused across the project (e.g., `uuid.js`).
    -   `views/`: Contains all the Mustache `.html` templates for the user interface.
-   `public/`: Contains all the static assets that are served to the client.
    -   `style/`: Holds all the CSS and image files.
    -   `*.script.js`: Frontend JavaScript files, separated by their functionality (e.g., `auth.script.js`, `tasks.script.js`).

---

## Backend Architecture Flow

The backend follows a clear data flow to handle requests. Understanding this flow is key to making changes.

**Request Flow:** `Route` -> `Middleware` -> `Service` -> `Adapter`/`Repo`

1.  **Routes (`src/routes/`)**
    -   This is the entry point for any incoming HTTP request.
    -   **`base.route.js`**: Renders the HTML pages. If you want to create a new page, you should add a route here.
    -   **`users.route.js`**: Handles all **API endpoints** related to user management and authentication (e.g., login, register).
    -   **`tasks.route.js`**: Handles all **API endpoints** for creating, updating, and deleting tasks.

2.  **Middleware (`src/middlewares/`)**
    -   Functions that run *before* the route handler.
    -   `auth.middleware.js` is used to protect routes by checking for a valid user cookie. It attaches the user data to the `req` object.

3.  **Services (`src/services/`)**
    -   This is where the main business logic lives. Routes should call service functions to perform actions.
    -   **`user.service.js`**: Handles logic like finding a user, checking if a username is available, etc.
    -   **`todo.service.js`**: Manages the logic for adding, removing, and updating tasks for a user.

4.  **Repositories (`src/repos/`)**
    -   These files are simple "builders" or "factories."
    -   They ensure that whenever we create a new user or a new task, it has a consistent structure. For example, `createTask(...)` returns a new task object with a generated UUID and default values.

5.  **Adapters (`src/adapters/`)**
    -   This layer is responsible for communicating with the database.
    -   `mongo.adapter.js` contains the functions to connect to MongoDB and perform basic CRUD operations (Create, Read, Update, Delete).

---

## How to Make Changes

-   **To Add a New Page:**
    1.  Create the `.html` template in `src/views/`.
    2.  Add a new `GET` route in `src/routes/base.route.js` to render your new page.

-   **To Add a New API Endpoint for Tasks:**
    1.  Add the new route (e.g., `tasksRouter.post(...)`) in `src/routes/tasks.route.js`.
    2.  Implement the required business logic in `src/services/todo.service.js`.
    3.  Call the service function from your new route.

-   **To Modify Frontend Behavior:**
    -   Identify which script is responsible (`auth.script.js`, `tasks.script.js`, or `ui.script.js`) in the `public/` directory and make your changes there.
    -   Ensure any `fetch` calls are pointing to the correct `/api/...` endpoints defined in the routes.

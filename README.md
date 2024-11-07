
# Fullstack Ordering System

This is a full-featured ordering system designed for small businesses to facilitate the tracking and management of orders, particularly for social media-based businesses. The system allows business owners to manage orders, assign couriers, and communicate with customers. The application includes:

- **Backend**: Developed in Go (Golang), handling API endpoints, authentication, and data storage.
- **Frontend**: Developed in React with Vite for a fast and responsive user interface.
- **Deployment**: Designed to be deployable on OpenShift, making it scalable and containerized.

## Features

- **User Registration & Login**: Customers and business owners can register and login with secure authentication.
- **Order Management**: Business owners can create, assign, and track orders.
- **Courier Assignment**: Assign couriers to specific orders for fulfillment.
- **Customer Notification**: Couriers can contact customers for delivery updates.

---

## Project Structure

```plaintext
fullstack-ordering-system/
├── backend/       # Go (Golang) backend
├── frontend/      # React frontend
└── README.md
```

## Requirements

- **Node.js** (v14 or higher)
- **Golang** (v1.16 or higher)
- **MySQL** for database
- **OpenShift CLI** (if deploying on OpenShift)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ahmedbakry024/fullstack-ordering-system.git
cd fullstack-ordering-system
```

### 2. Backend Setup (Go)

#### Navigate to the backend directory

```bash
cd backend
```

#### Install dependencies

```bash
go mod init ordering-system
go get -u github.com/gin-gonic/gin gorm.io/gorm gorm.io/driver/mysql github.com/joho/godotenv
```

#### Environment Variables

Create a `.env` file in the `backend` directory with the following details:

```plaintext
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ordering_system
```

#### Database Setup

In MySQL, create a new database for the project:

```sql
CREATE DATABASE ordering_system;
```

#### Run the Backend Server

```bash
go run main.go
```

The backend server should now be running on `http://localhost:8080`.

### 3. Frontend Setup (React with Vite)

#### Navigate to the frontend directory

```bash
cd ../frontend
```

#### Install dependencies

```bash
npm install
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend should now be accessible at `http://localhost:5173`.

### 4. Testing the Application

- **Frontend**: Open your browser and go to `http://localhost:5173` to access the user interface.
- **Backend**: Test API endpoints via Postman or directly through the frontend UI.

---

## Deployment on OpenShift

1. **Login to OpenShift**:

   ```bash
   oc login
   ```

2. **Create a New Project**:

   ```bash
   oc new-project fullstack-ordering-system
   ```

3. **Deploy Backend and Frontend**:
   - Use `oc new-app` with Dockerfile or source code for automatic container creation.
   - **Backend**: Deploy the Golang backend.

     ```bash
     oc new-app --name=backend go:1.16~https://github.com/your-username/fullstack-ordering-system.git --context-dir=/backend
     ```

   - **Frontend**: Deploy the React frontend.

     ```bash
     oc new-app --name=frontend nodejs:14~https://github.com/your-username/fullstack-ordering-system.git --context-dir=/frontend
     ```

4. **Expose Services**:
   - Expose each application as a service for external access.

   ```bash
   oc expose svc/backend
   oc expose svc/frontend
   ```

5. **Access Application**:
   - Use the OpenShift routes generated to access both frontend and backend.

---

## API Documentation

The backend API uses the following main routes:

- **POST** `/users`: Register a new user.
- **GET** `/users/login`: User login.
- **GET** `/users/:id`: Retrieve user details.
- **POST** `/orders`: Create a new order.
- **GET** `/orders/:id`: Retrieve order details.
- **PATCH** `/orders/:id`: Update order status.

---

## Technology Stack

- **Frontend**: React, Vite, Axios
- **Backend**: Golang, Gin, GORM
- **Database**: MySQL
- **Deployment**: OpenShift

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

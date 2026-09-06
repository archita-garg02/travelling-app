# TravelMate

TravelMate is a full-stack mobile travel application built with React Native, FastAPI, and MySQL. It combines ride booking, maps, route guidance, weather information, and café discovery in one application.

## Features

- Customer and service-provider registration
- Secure login using JWT authentication
- Password hashing using Argon2
- Customer and provider role-based authorization
- Providers can add and view vehicle services
- Customers can search for available bikes, autos, and cabs
- Customers can create ride bookings
- Customers can view their booking history
- Address search using OpenStreetMap
- Reverse geocoding using OpenStreetMap
- Route distance, duration, and directions using OSRM
- Weather information for selected locations
- Map, café, ride, weather, home, and profile screens
- Database version management using Alembic migrations

## Technology Stack

### Mobile Application

- React Native
- JavaScript
- React Navigation
- AsyncStorage
- React Native Maps

### Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- JWT authentication
- Argon2 password hashing

### Database and APIs

- MySQL
- OpenStreetMap Nominatim API
- OSRM Routing API

## Application Workflow

1. A user registers as a customer or provider.
2. FastAPI hashes the password and stores the user in MySQL.
3. The user logs in and receives a JWT access token.
4. React Native stores the token using AsyncStorage.
5. A provider adds their vehicle and fare details.
6. A customer searches for available bikes, autos, or cabs.
7. The customer selects a vehicle and creates a booking.
8. The booking is stored with a `PENDING` status.
9. The customer can view the booking in My Bookings.

## Project Structure

```text
TravelMate/
├── android/
├── assets/
├── src/
│   └── screens/
│       ├── LoginScreen.jsx
│       ├── SignupScreen.jsx
│       ├── HomeScreen.jsx
│       ├── WeatherScreen.jsx
│       ├── MapScreen.jsx
│       ├── CafesScreen.jsx
│       ├── RideScreen.jsx
│       ├── AddServiceScreen.jsx
│       ├── MyBookingsScreen.jsx
│       └── ProfileScreen.jsx
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── provider_service.py
│   │   │   └── booking.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── services.py
│   │   │   └── bookings.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── service.py
│   │   │   └── booking.py
│   │   ├── database.py
│   │   └── dependencies.py
│   ├── migrations/
│   ├── alembic.ini
│   ├── main.py
│   └── requirements.txt
├── App.jsx
├── package.json
└── README.md
```

## Database Tables

| Table | Purpose |
|---|---|
| `users` | Stores customer and provider accounts |
| `provider_services` | Stores provider vehicles and fare details |
| `bookings` | Stores customer ride requests |
| `alembic_version` | Tracks the current database migration |

## Security

TravelMate applies the following security rules:

- Passwords are stored as secure hashes, not plain text.
- Protected endpoints require a valid JWT.
- The backend identifies the current user from the JWT.
- Customers cannot create provider vehicle services.
- Providers cannot create customer bookings.
- A provider cannot book their own vehicle.
- Users can access only their own protected information.
- Database and JWT secrets are stored in `.env`.
- The `.env` file is excluded from Git.

## Backend Setup

### 1. Create the MySQL database

```sql
CREATE DATABASE travelmate
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 2. Open the backend directory

```powershell
cd backend
```

### 3. Create a virtual environment

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Install the dependencies

```powershell
pip install -r requirements.txt
```

### 5. Configure environment variables

Create a file named `.env` inside the `backend` directory:

```env
DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@localhost:3306/travelmate
JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Never commit your real `.env` file.

### 6. Apply database migrations

```powershell
alembic upgrade head
```

### 7. Start FastAPI

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Swagger API documentation will be available at:

```text
http://127.0.0.1:8000/docs
```

## React Native Setup

Open the project root:

```powershell
cd C:\reactproject\TravelMate
```

Install packages:

```powershell
npm install
```

Start Metro:

```powershell
npm start
```

In another terminal, start the Android application:

```powershell
npx react-native run-android
```

The Android emulator accesses the local FastAPI backend through:

```text
http://10.0.2.2:8000
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a customer or provider |
| POST | `/auth/login` | Log in and receive a JWT |
| GET | `/auth/me` | Return the logged-in user |

### Provider Services

| Method | Endpoint | Description |
|---|---|---|
| POST | `/services` | Add a provider vehicle |
| GET | `/services/my-services` | Return the provider's vehicles |
| GET | `/services/available` | Search available vehicles |

Available vehicles can be filtered by type:

```text
GET /services/available?service_type=CAB
```

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/bookings` | Create a pending booking |
| GET | `/bookings/my-bookings` | Return the customer's bookings |

### Location and Routing

| Method | Endpoint | Description |
|---|---|---|
| GET | `/geocode` | Convert an address into coordinates |
| GET | `/reverse-geocode` | Convert coordinates into an address |
| GET | `/route` | Calculate a driving route |

## Example Booking Request

```json
{
  "service_id": 1,
  "pickup_address": "Model Town, Yamunanagar",
  "destination_address": "Jagadhri Bus Stand"
}
```

Example response:

```json
{
  "id": 1,
  "customer_id": 2,
  "service_id": 1,
  "pickup_address": "Model Town, Yamunanagar",
  "destination_address": "Jagadhri Bus Stand",
  "estimated_fare": null,
  "status": "PENDING",
  "created_at": "2026-09-06T10:00:00"
}
```

## Future Improvements

- Calculate the estimated fare using route distance
- Provider booking acceptance and rejection
- Customer booking cancellation
- Reviews and provider ratings
- Push notifications
- Cloud deployment
- Automated testing
- AI-powered travel recommendations

## What I Learned

While building TravelMate, I learned how to:

- Connect a React Native application to FastAPI
- Design REST APIs
- Store application data in MySQL
- Use SQLAlchemy models and relationships
- Manage database changes using Alembic
- Implement JWT authentication
- Apply role-based authorization
- Integrate third-party mapping and routing APIs
- Build an end-to-end customer and provider workflow

## Author

**Archita Garg**

- GitHub: [archita-garg02](https://github.com/archita-garg02)
- Repository: [travelling-app](https://github.com/archita-garg02/travelling-app)

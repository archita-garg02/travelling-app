# TravelMate

TravelMate is a full-stack mobile travel application built with **React Native, FastAPI, and MySQL**. It combines weather information, map-based destination search, route calculation, and role-based ride booking in one Android application.

## Features

- Customer and service-provider registration
- Secure login using JWT authentication
- Password hashing using Argon2
- Customer and provider role-based authorization
- User profile and logout functionality
- Providers can add and view vehicle services
- Provider dashboard with service and availability summaries
- Customers can search for available bikes, autos, and cabs
- Customers can create ride bookings
- Customers and providers can view relevant bookings
- Current location using device GPS
- Address search and reverse geocoding using OpenStreetMap Nominatim
- Driving route, distance, and duration using OSRM
- Route display using React Native Maps
- Current weather and five-day forecasts using Open-Meteo
- Weather search for different cities and locations
- Database version management using Alembic migrations

## Technology Stack

### Mobile Application

- React Native
- JavaScript
- React Navigation
- AsyncStorage
- React Native Maps
- React Native Geolocation

### Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PyMySQL
- JWT authentication
- Argon2 password hashing

### Database and External Services

- MySQL
- OpenStreetMap Nominatim
- OSRM Routing API
- Open-Meteo Weather API

## Architecture

```text
React Native Android App
        |
        | HTTP/JSON requests
        v
FastAPI Backend
   |          |
   |          +---- Nominatim and OSRM
   v
MySQL Database

React Native App ---- Open-Meteo Weather API
```

## Application Workflow

1. A user registers as a customer or service provider.
2. FastAPI validates the request, hashes the password, and stores the user in MySQL.
3. The user logs in and receives a JWT access token.
4. React Native stores the token and user information using AsyncStorage.
5. The Ride screen displays a different interface according to the user's role.
6. A provider adds a vehicle with its type, seats, city, and fare details.
7. A customer searches for available bikes, autos, or cabs.
8. The customer selects a vehicle and creates a booking.
9. The backend stores the booking with a `PENDING` status.
10. The user can view the booking through the My Bookings screen.

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
├── metro.config.js
├── package.json
└── README.md
```

## Main Screens

| Screen | Purpose |
|---|---|
| `LoginScreen` | Authenticates an existing user |
| `SignupScreen` | Registers a customer or provider |
| `HomeScreen` | Provides access to the main travel features |
| `WeatherScreen` | Shows current weather and a five-day forecast |
| `MapScreen` | Searches destinations and displays driving routes |
| `RideScreen` | Displays customer booking or provider dashboard UI |
| `AddServiceScreen` | Allows providers to register a vehicle service |
| `MyBookingsScreen` | Displays the authenticated user's bookings |
| `ProfileScreen` | Displays account details and provides logout |

## Database Tables

| Table | Purpose |
|---|---|
| `users` | Stores customer and provider accounts |
| `provider_services` | Stores provider vehicles, fares, cities, and availability |
| `bookings` | Stores customer ride requests |
| `alembic_version` | Tracks the applied database migration |

## Security

TravelMate applies the following security rules:

- Passwords are stored as secure hashes, not plain text.
- Protected endpoints require a valid JWT access token.
- The backend identifies the current user from the JWT.
- Customers cannot create provider vehicle services.
- Providers cannot create customer bookings.
- Providers can access only their own vehicle services.
- Users can access only authorized booking information.
- Database credentials and JWT secrets are stored in `.env`.
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
cd C:\reactproject\TravelMate\backend
```

### 3. Create and activate a virtual environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 4. Install the dependencies

```powershell
pip install -r requirements.txt
```

### 5. Configure environment variables

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@localhost:3306/travelmate
JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Replace `USERNAME`, `PASSWORD`, and the JWT secret with your own values.

Never commit the real `.env` file to GitHub.

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

### 1. Open the project root

```powershell
cd C:\reactproject\TravelMate
```

### 2. Install JavaScript packages

```powershell
npm install
```

### 3. Start an Android emulator

Open Android Studio and start an emulator from Device Manager.

### 4. Start Metro

```powershell
npx react-native start
```

If Metro has stale cache data, use:

```powershell
npx react-native start --reset-cache
```

### 5. Build and run the Android application

Open another terminal and run:

```powershell
npx react-native run-android --active-arch-only
```

The Android emulator accesses the FastAPI backend using:

```text
http://10.0.2.2:8000
```

`10.0.2.2` is the Android emulator's special address for accessing the host computer.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a customer or provider |
| POST | `/auth/login` | Log in and receive a JWT |
| GET | `/auth/me` | Return the authenticated user |

### Provider Services

| Method | Endpoint | Description |
|---|---|---|
| POST | `/services` | Add a provider vehicle service |
| GET | `/services/my-services` | Return the provider's vehicle services |
| GET | `/services/available` | Search available vehicle services |

Available services can be filtered by type:

```http
GET /services/available?service_type=CAB
```

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/bookings` | Create a pending booking |
| GET | `/bookings/my-bookings` | Return bookings available to the authenticated user |

### Location and Routing

| Method | Endpoint | Description |
|---|---|---|
| GET | `/geocode` | Convert an address into coordinates |
| GET | `/reverse-geocode` | Convert coordinates into an address |
| GET | `/route` | Calculate a driving route, distance, and duration |

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

## Map and Routing Flow

1. React Native requests location permission.
2. Device GPS provides the user's coordinates.
3. Nominatim converts coordinates into a readable address.
4. The user searches for a destination.
5. Nominatim converts the destination into coordinates.
6. FastAPI sends the coordinates to OSRM.
7. OSRM returns route coordinates, distance, and duration.
8. React Native Maps displays the route using a polyline.

The public OSRM service does not include real-time traffic conditions.

## Weather Flow

1. The application reads the user's GPS coordinates or a searched city.
2. The coordinates are sent to Open-Meteo.
3. Open-Meteo returns current conditions and a five-day forecast.
4. The application displays temperature, feels-like temperature, humidity, wind speed, rain probability, and forecast data.

## Future Improvements

- Calculate estimated fares using actual route distance
- Provider booking acceptance and rejection
- Customer booking cancellation
- Reviews and provider ratings
- Push notifications
- Automated backend and frontend tests
- Cloud deployment
- AI-powered travel recommendations

## What I Learned

While building TravelMate, I learned how to:

- Build a mobile application using React Native
- Connect React Native to a FastAPI backend
- Design and consume REST APIs
- Store relational application data in MySQL
- Use SQLAlchemy models and relationships
- Manage database changes using Alembic migrations
- Implement JWT authentication and password hashing
- Apply role-based authorization
- Store mobile session data using AsyncStorage
- Integrate device geolocation
- Integrate mapping, geocoding, routing, and weather services
- Build an end-to-end customer and provider booking workflow

## Author

**Archita Garg**

- GitHub: [archita-garg02](https://github.com/archita-garg02)
- Repository: [travelling-app](https://github.com/archita-garg02/travelling-app)

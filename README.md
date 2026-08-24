# 🌍 TravelMate

TravelMate is an all-in-one travel companion mobile application built using **React Native** and **FastAPI**. It helps users check real-time weather, explore maps, calculate the shortest driving route, view distance and estimated travel time, and start live navigation using Google Maps.

## ✨ Features

- User Login and Signup
- Current GPS location detection
- Search destinations by name
- Select a destination by tapping the map
- Display current and destination markers
- Calculate the shortest driving route
- Show route distance and estimated time
- Draw a road-following route on the map
- Start live navigation in Google Maps
- Voice-guided navigation and automatic rerouting
- Real-time local weather
- Temperature and feels-like temperature
- Humidity, wind speed and rain probability
- Five-day weather forecast
- Loading, permission and network error handling

## 🚧 Upcoming Features

- Nearby cafes and restaurants
- Ride-booking integration
- Hotel discovery and booking
- AI-based itinerary planner
- Saved destinations
- Travel history
- User profile and preferences
- Emergency contacts and safety features

## 🛠️ Tech Stack

### Mobile Application

- React Native CLI
- JavaScript and JSX
- React Navigation
- React Native Maps
- React Native Community Geolocation
- React Native Safe Area Context

### Backend

- Python
- FastAPI
- Uvicorn
- HTTPX

### APIs and Services

- **OpenStreetMap Nominatim** – Geocoding and reverse geocoding
- **OSRM** – Shortest driving-route calculation
- **Open-Meteo** – Current weather and five-day forecast
- **Google Maps** – Live navigation, traffic and voice guidance

## 📁 Project Structure

```text
TravelMate/
├── android/
├── ios/
├── src/
│   ├── navigation/
│   └── screens/
│       ├── LoginScreen.jsx
│       ├── SignupScreen.jsx
│       ├── HomeScreen.jsx
│       ├── MapScreen.jsx
│       ├── WeatherScreen.jsx
│       ├── CafesScreen.jsx
│       ├── RideScreen.jsx
│       └── ProfileScreen.jsx
├── backend/
│   └── main.py
├── App.jsx
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Java Development Kit 17
- Android Studio
- Android SDK
- Python 3.10 or later
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/archita-garg02/travelling-app.git
cd travelling-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Metro

```bash
npm start
```

### 4. Run the Android Application

Open another terminal:

```bash
npm run android
```

Make sure an Android emulator is running or a physical device is connected with USB debugging enabled.

## 🖥️ Backend Setup

Move into the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it in Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install fastapi uvicorn httpx
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open the API documentation:

```text
http://127.0.0.1:8000/docs
```

## 📱 Backend URL Configuration

For the Android emulator, use:

```javascript
const API_BASE_URL = 'http://10.0.2.2:8000';
```

For a physical Android device, use your computer’s local IP address:

```javascript
const API_BASE_URL = 'http://192.168.1.5:8000';
```

The phone and computer must be connected to the same Wi-Fi network.

## 📍 Location Permission

Add the following permission inside:

```text
android/app/src/main/AndroidManifest.xml
```

Place it before the `<application>` element:

```xml
<uses-permission
    android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## 🔗 Backend Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Check backend status |
| `GET` | `/geocode` | Convert a destination into coordinates |
| `GET` | `/reverse-geocode` | Convert coordinates into an address |
| `GET` | `/route` | Calculate route, distance and duration |

## 🗺️ How the Map Feature Works

1. TravelMate requests location permission.
2. The device GPS provides the current coordinates.
3. OpenStreetMap converts the coordinates into a readable address.
4. The user searches for or selects a destination.
5. FastAPI requests the shortest driving route from OSRM.
6. TravelMate draws the route on the map.
7. Distance and estimated travel time are displayed.
8. The **Start Navigation** button opens Google Maps.
9. Google Maps provides live traffic, voice guidance and rerouting.

## 🌦️ How the Weather Feature Works

1. TravelMate obtains the user’s GPS coordinates.
2. It requests current weather data from Open-Meteo.
3. It displays temperature, humidity, wind and rain probability.
4. It also displays a five-day forecast.

Open-Meteo does not require an API key.

## 🚀 Future Improvements

- Share location between screens using Context API
- Add destination autocomplete
- Add driving, walking and cycling route modes
- Cache weather and route information
- Add unit and integration tests
- Add authentication and persistent user data
- Add AI-based travel recommendations
- Deploy the FastAPI backend

## 👩‍💻 Author

**Archita Garg**

- GitHub: [archita-garg02](https://github.com/archita-garg02)

## 🤝 Contributing

Contributions and suggestions are welcome.

```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "Add new feature"
git push origin feature/your-feature-name
```

Then open a pull request on GitHub.

---

⭐ If you find TravelMate useful, consider giving the repository a star.

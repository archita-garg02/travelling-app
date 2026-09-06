import httpx
from fastapi import FastAPI, HTTPException, Query

from app.routers.auth import router as auth_router
from app.routers.services import router as services_router
from app.routers.bookings import router as bookings_router


NOMINATIM_SEARCH_URL = (
    "https://nominatim.openstreetmap.org/search"
)

NOMINATIM_REVERSE_URL = (
    "https://nominatim.openstreetmap.org/reverse"
)

OSRM_ROUTE_URL = (
    "https://router.project-osrm.org/route/v1/driving"
)

REQUEST_HEADERS = {
    "User-Agent": (
        "TravelMate/1.0 "
        "(https://github.com/archita-garg02/travelling-app)"
    ),
    "Accept-Language": "en",
}


app = FastAPI(
    title="TravelMate API",
    description="Backend services for the TravelMate application",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(services_router)
app.include_router(bookings_router)


@app.get("/")
def home():
    return {
        "message": "TravelMate backend is running",
    }


@app.get("/geocode")
async def geocode_address(
    address: str = Query(
        ...,
        min_length=2,
        description="Destination name or address",
    ),
):
    parameters = {
        "q": address,
        "format": "jsonv2",
        "limit": 1,
        "addressdetails": 1,
    }

    try:
        async with httpx.AsyncClient(
            timeout=15.0,
        ) as client:
            response = await client.get(
                NOMINATIM_SEARCH_URL,
                params=parameters,
                headers=REQUEST_HEADERS,
            )

            response.raise_for_status()
            results = response.json()

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Location search timed out",
        )

    except httpx.HTTPStatusError as http_error:
        print("OpenStreetMap HTTP error:", http_error)

        raise HTTPException(
            status_code=502,
            detail=(
                "OpenStreetMap rejected the "
                "location request"
            ),
        )

    except httpx.RequestError as request_error:
        print(
            "OpenStreetMap request error:",
            request_error,
        )

        raise HTTPException(
            status_code=502,
            detail="Unable to connect to OpenStreetMap",
        )

    if not results:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )

    first_result = results[0]

    return {
        "address": first_result["display_name"],
        "latitude": float(first_result["lat"]),
        "longitude": float(first_result["lon"]),
        "source": "OpenStreetMap",
    }


@app.get("/reverse-geocode")
async def reverse_geocode(
    latitude: float = Query(
        ...,
        ge=-90,
        le=90,
        description="Location latitude",
    ),
    longitude: float = Query(
        ...,
        ge=-180,
        le=180,
        description="Location longitude",
    ),
):
    parameters = {
        "lat": latitude,
        "lon": longitude,
        "format": "jsonv2",
        "addressdetails": 1,
        "zoom": 18,
    }

    try:
        async with httpx.AsyncClient(
            timeout=15.0,
        ) as client:
            response = await client.get(
                NOMINATIM_REVERSE_URL,
                params=parameters,
                headers=REQUEST_HEADERS,
            )

            response.raise_for_status()
            result = response.json()

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Address lookup timed out",
        )

    except httpx.HTTPStatusError as http_error:
        print("OpenStreetMap HTTP error:", http_error)

        raise HTTPException(
            status_code=502,
            detail=(
                "OpenStreetMap rejected the "
                "address request"
            ),
        )

    except httpx.RequestError as request_error:
        print(
            "OpenStreetMap request error:",
            request_error,
        )

        raise HTTPException(
            status_code=502,
            detail="Unable to connect to OpenStreetMap",
        )

    if result.get("error"):
        raise HTTPException(
            status_code=404,
            detail="Address not found for this location",
        )

    return {
        "address": result.get(
            "display_name",
            "Current location",
        ),
        "latitude": latitude,
        "longitude": longitude,
        "source": "OpenStreetMap",
    }


def create_direction_instruction(step):
    maneuver = step.get("maneuver", {})

    maneuver_type = maneuver.get(
        "type",
        "continue",
    )

    modifier = maneuver.get(
        "modifier",
        "",
    )

    road_name = step.get("name") or "the road"

    if maneuver_type == "depart":
        return f"Start on {road_name}"

    if maneuver_type == "arrive":
        return "Arrive at your destination"

    if maneuver_type in {
        "roundabout",
        "rotary",
        "roundabout turn",
    }:
        exit_number = maneuver.get("exit")

        if exit_number:
            return (
                f"Enter the roundabout and take "
                f"exit {exit_number} onto {road_name}"
            )

        return (
            f"Enter the roundabout onto {road_name}"
        )

    if maneuver_type == "turn":
        return f"Turn {modifier} onto {road_name}"

    if maneuver_type == "merge":
        return f"Merge {modifier} onto {road_name}"

    if maneuver_type == "fork":
        return f"Keep {modifier} onto {road_name}"

    if maneuver_type == "end of road":
        return (
            f"At the end of the road, turn "
            f"{modifier} onto {road_name}"
        )

    if maneuver_type in {
        "continue",
        "new name",
        "notification",
    }:
        direction = modifier or "straight"

        return (
            f"Continue {direction} on {road_name}"
        )

    readable_type = maneuver_type.replace(
        "_",
        " ",
    ).title()

    instruction = f"{readable_type}"

    if modifier:
        instruction += f" {modifier}"

    instruction += f" onto {road_name}"

    return instruction


@app.get("/route")
async def calculate_route(
    start_latitude: float = Query(
        ...,
        ge=-90,
        le=90,
    ),
    start_longitude: float = Query(
        ...,
        ge=-180,
        le=180,
    ),
    destination_latitude: float = Query(
        ...,
        ge=-90,
        le=90,
    ),
    destination_longitude: float = Query(
        ...,
        ge=-180,
        le=180,
    ),
):
    # OSRM requires longitude,latitude.
    coordinates = (
        f"{start_longitude},{start_latitude};"
        f"{destination_longitude},"
        f"{destination_latitude}"
    )

    url = f"{OSRM_ROUTE_URL}/{coordinates}"

    parameters = {
        "overview": "full",
        "geometries": "geojson",
        "steps": "true",
    }

    try:
        async with httpx.AsyncClient(
            timeout=20.0,
        ) as client:
            response = await client.get(
                url,
                params=parameters,
            )

            response.raise_for_status()
            data = response.json()

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Route calculation timed out",
        )

    except httpx.HTTPStatusError as http_error:
        print("OSRM HTTP error:", http_error)

        raise HTTPException(
            status_code=502,
            detail=(
                "Routing service rejected the request"
            ),
        )

    except httpx.RequestError as request_error:
        print("OSRM request error:", request_error)

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to connect to routing service"
            ),
        )

    if data.get("code") != "Ok":
        raise HTTPException(
            status_code=404,
            detail="No driving route was found",
        )

    route = data["routes"][0]

    geojson_coordinates = (
        route["geometry"]["coordinates"]
    )

    route_coordinates = [
        {
            "latitude": coordinate[1],
            "longitude": coordinate[0],
        }
        for coordinate in geojson_coordinates
    ]

    directions = []

    for leg in route.get("legs", []):
        for step in leg.get("steps", []):
            directions.append(
                {
                    "instruction": (
                        create_direction_instruction(
                            step
                        )
                    ),
                    "distance_meters": round(
                        step.get("distance", 0)
                    ),
                    "duration_seconds": round(
                        step.get("duration", 0)
                    ),
                    "road_name": (
                        step.get("name")
                        or "Unnamed road"
                    ),
                }
            )

    return {
        "distance_km": round(
            route["distance"] / 1000,
            2,
        ),
        "duration_minutes": round(
            route["duration"] / 60,
        ),
        "route_coordinates": route_coordinates,
        "directions": directions,
        "source": "OSRM and OpenStreetMap",
    }
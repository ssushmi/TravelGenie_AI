import math
from app.models.schemas import DistanceResult

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on Earth.
    Returns distance in kilometers.
    """
    R = 6371.0  # Earth's radius in km

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def calculate_travel_info(
    user_lat: float, user_lon: float,
    dest_lat: float, dest_lon: float
) -> DistanceResult:
    dist_km = haversine(user_lat, user_lon, dest_lat, dest_lon)
    dist_miles = dist_km * 0.621371

    # Flight time: avg 900 km/h cruise + 2h airport overhead
    flight_hours = (dist_km / 900) + 2.0 if dist_km > 500 else None
    flight_hours_display = round((dist_km / 900) + 2.0, 1)

    # Drive time: avg 80 km/h
    drive_hours = round(dist_km / 80, 1) if dist_km < 2000 else None

    # Rough flight cost (very approximate)
    if dist_km < 500:
        flight_cost = "$80–$200"
        budget = "$500–$1,000"
    elif dist_km < 2000:
        flight_cost = "$150–$500"
        budget = "$1,000–$2,500"
    elif dist_km < 8000:
        flight_cost = "$400–$1,200"
        budget = "$2,000–$5,000"
    else:
        flight_cost = "$800–$2,500"
        budget = "$3,000–$8,000"

    return DistanceResult(
        distance_km=round(dist_km, 2),
        distance_miles=round(dist_miles, 2),
        estimated_drive_hours=drive_hours,
        estimated_flight_hours=flight_hours_display,
        approximate_flight_cost_usd=flight_cost,
        approximate_budget_usd=budget,
    )

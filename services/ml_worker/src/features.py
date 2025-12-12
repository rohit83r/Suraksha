# features.py
from math import radians, sin, cos, sqrt, asin
from typing import List, Dict,Tuple

def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return distance in meters between two lat/lon points."""
    R = 6371000.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return R * c

def compute_window_features(window: List[Dict]) -> Tuple[List, Dict]:
    """
    Simple, deterministic feature vector for a window of pings.
    Returns (feature_vector, meta)
    Feature vector order: [mean_speed, std_speed, total_disp, max_disp, mean_accuracy, last_accuracy]
    """
    if len(window) < 3:
        return None, {}

    # ensure order by ts ascending (worker sorts earlier, but we accept any order)
    window_sorted = sorted(window, key=lambda x: x.get('ts'))
    speeds = [float(x.get('speed') or 0.0) for x in window_sorted]
    accuracies = [float(x.get('accuracy') or 0.0) for x in window_sorted]

    dists = []
    for i in range(1, len(window_sorted)):
        a = window_sorted[i-1]
        b = window_sorted[i]
        try:
            d = haversine_meters(a['lat'], a['lng'], b['lat'], b['lng'])
        except Exception:
            d = 0.0
        dists.append(d)

    import statistics
    mean_speed = statistics.mean(speeds) if speeds else 0.0
    std_speed = statistics.pstdev(speeds) if len(speeds) > 1 else 0.0
    total_disp = sum(dists) if dists else 0.0
    max_disp = max(dists) if dists else 0.0
    mean_accuracy = statistics.mean(accuracies) if accuracies else 0.0
    last_accuracy = accuracies[-1] if accuracies else 0.0

    feat = [mean_speed, std_speed, total_disp, max_disp, mean_accuracy, last_accuracy]
    meta = {'n': len(window_sorted)}
    return feat, meta

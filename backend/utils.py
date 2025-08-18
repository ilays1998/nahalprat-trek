import requests
from typing import Optional, Dict

def get_ip_info(ip_address: str) -> Optional[Dict]:
    """
    Get geolocation information for an IP address using ipapi.co
    Returns None if the request fails
    """
    try:
        response = requests.get(f'https://ipapi.co/{ip_address}/json/')
        if response.status_code == 200:
            data = response.json()
            return {
                'region': data.get('region'),
                'country': data.get('country_code'),
                'city': data.get('city')
            }
    except Exception as e:
        print(f"Error getting IP info: {e}")
    return None

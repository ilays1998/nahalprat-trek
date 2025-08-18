import requests
from typing import Optional, Dict
from config import Config

def get_ip_info(ip_address: str) -> Optional[Dict]:
    """
    Get geolocation information for an IP address using ipgeolocation.io
    Returns None if the request fails
    """
    if not Config.IPGEOLOCATION_API_KEY:
        print("IPGEOLOCATION_API_KEY not configured")
        return None
        
    try:
        url = "https://api.ipgeolocation.io/ipgeo"
        params = {
            'apiKey': Config.IPGEOLOCATION_API_KEY,
            'ip': ip_address
        }
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return {
                'region': data.get('state_prov'),  # State/Province
                'country': data.get('country_code2'),  # 2-letter country code
                'city': data.get('city')
            }
        else:
            print(f"IPGEOLOCATION error: {response.status_code} - {response.text}")
            
    except requests.exceptions.Timeout:
        print(f"Timeout while getting IP info for {ip_address}")
    except requests.exceptions.RequestException as e:
        print(f"Request error getting IP info: {e}")
    except Exception as e:
        print(f"Error getting IP info: {e}")
    return None

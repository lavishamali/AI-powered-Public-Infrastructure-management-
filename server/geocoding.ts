// Approximate bounding box for India
export function isWithinIndia(lat: number, lng: number): boolean {
  return lat >= 6.5 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
}

// Known Indian cities for proximity fallback if Nominatim is unreachable or rate-limited
const INDIAN_CITIES = [
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Chandigarh', state: 'Punjab & Haryana', lat: 30.7333, lng: 76.7794 },
  { name: 'Patna', state: 'Bihar', lat: 25.6127, lng: 85.1444 }
];

function getClosestIndianCity(lat: number, lng: number) {
  let closest = INDIAN_CITIES[0];
  let minDistance = Infinity;

  for (const city of INDIAN_CITIES) {
    const d = Math.hypot(lat - city.lat, lng - city.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = city;
    }
  }

  return { closest, distanceDeg: minDistance };
}

export interface ReverseGeocodeResult {
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
  address: string;
  isIndia: boolean;
}

export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  const insideIndia = isWithinIndia(lat, lng);

  // Attempt Nominatim reverse geocoding with 4-second timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CivicVision-AI-Triage-System/2.6 (civicvision-ai@infrastructure.in)'
      }
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const country = addr.country || (insideIndia ? 'India' : 'Unknown');
        const state = addr.state || addr.region || (insideIndia ? 'Madhya Pradesh' : '');
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.suburb ||
          addr.municipality ||
          addr.county ||
          addr.state_district ||
          (insideIndia ? 'Indore' : 'Local Area');

        const roadPart = [addr.road, addr.neighbourhood || addr.suburb].filter(Boolean).join(', ');
        const displayAddress = roadPart
          ? `${roadPart}, ${city}, ${state}`
          : data.display_name?.split(',').slice(0, 3).join(', ') || `${city}, ${state}`;

        const isCountryIndia =
          country.toLowerCase() === 'india' ||
          addr.country_code?.toLowerCase() === 'in' ||
          insideIndia;

        return {
          lat,
          lng,
          city,
          state,
          country,
          address: displayAddress,
          isIndia: isCountryIndia
        };
      }
    }
  } catch (err: any) {
    console.warn('[Geocoding] Nominatim fetch error or timeout, falling back:', err.message);
  }

  // Fallback for Indian coordinates
  if (insideIndia) {
    const { closest, distanceDeg } = getClosestIndianCity(lat, lng);
    const approximateRoad = `Sector/Ward Near ${closest.name} Center`;

    return {
      lat,
      lng,
      city: closest.name,
      state: closest.state,
      country: 'India',
      address: distanceDeg < 0.15 ? `${approximateRoad}, ${closest.name}` : `Near ${closest.name}, ${closest.state}, India`,
      isIndia: true
    };
  }

  // Fallback for non-Indian coordinates
  return {
    lat,
    lng,
    city: 'International Location',
    state: '',
    country: 'Outside India',
    address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    isIndia: false
  };
}

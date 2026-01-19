export interface WeatherData {
  current: {
    temp: number;
    code: number;
    isDay: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
}

// Hong Kong Coordinates
const LAT = 22.3193;
const LON = 114.1694;

export const fetchHKWeather = async (): Promise<WeatherData> => {
  try {
    // We use the 'current' parameter which returns a 'current' object in the JSON
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=2`
    );
    
    if (!response.ok) throw new Error('Weather API failed');
    
    const data = await response.json();

    // Map the API response (snake_case) to our internal interface (camelCase-ish where needed)
    return {
      current: {
        temp: data.current.temperature_2m,
        code: data.current.weather_code,
        isDay: data.current.is_day
      },
      hourly: {
        time: data.hourly.time,
        temperature_2m: data.hourly.temperature_2m,
        weather_code: data.hourly.weather_code
      }
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    throw error;
  }
};

export const getWeatherDescription = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
};

export const getWeatherIconType = (code: number): 'sun' | 'cloud' | 'rain' | 'storm' | 'snow' => {
  if (code === 0 || code === 1) return 'sun';
  if (code === 2 || code === 3 || (code >= 45 && code <= 48)) return 'cloud';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloud';
};
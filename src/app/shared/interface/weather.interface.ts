import { Success } from "./success.interface";

export interface IWeatherResponse extends Success {
  metaData: TWeatherData;
}

export type TWeatherData = {
  _id: string;
  store: Tstore;
  hourly: THourly;
  createdAt: Date;
  updatedAt: Date;
}

export type Tstore = {
  name: string;
  lat: number;
  lon: number;
};

type TWeather = {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export type THourly = {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: TWeather[];
  pop: number;
  rain?: { "1h": number };
};
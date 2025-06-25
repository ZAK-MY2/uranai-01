import { EnvironmentData } from '../divination/base-engine';

export const mockEnvironmentData: EnvironmentData = {
  weather: {
    temperature: 22,
    humidity: 65,
    pressure: 1013,
    windSpeed: 3,
    windDirection: 'SW',
    condition: 'partly_cloudy',
    cloudCover: 35
  },
  lunar: {
    phase: 0.25,
    phaseName: '上弦の月',
    illumination: 50,
    moonSign: '蟹座',
    isVoidOfCourse: false,
    eclipseNearby: false
  },
  planetary: {
    sunSign: '山羊座',
    moonSign: '蟹座',
    risingSign: '獅子座',
    retrogradeПlanets: ['Mercury'],
    dayRuler: 'Mars',
    hourRuler: 'Jupiter',
    planetaryHour: 3
  },
  timestamp: new Date()
};
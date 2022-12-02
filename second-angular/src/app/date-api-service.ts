import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { _YAxis } from '@angular/cdk/scrolling';
import { map, Observable } from 'rxjs';
import { WeatherData } from './weather-forecaster/weather-forecaster.component';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {

  constructor(private http: HttpClient) {
  }

  getWeather(startDate: Date, endDate: Date): Observable<WeatherData[]> {
    console.log(startDate)
    const rawStartDay = (startDate.getDate().toString().length > 1) ? startDate.getDate() : `0${startDate.getDate()}`;
    const rawStartMonth = startDate.getMonth();
    const rawStartYear = startDate.getFullYear();
    const rawEndDay = (endDate.getDate().toString().length > 1) ? endDate.getDate() : `0${endDate.getDate()}`;
    const rawEndMonth = endDate.getMonth();
    const rawEndYear = endDate.getFullYear();
    const sDate: String = `${rawStartYear}-0${rawStartMonth + 1}-${rawStartDay}`;
    const eDate: String = `${rawEndYear}-0${rawEndMonth + 1}-${rawEndDay}`;

    return this.http.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=46.25&longitude=20.15&daily=weathercode,temperature_2m_max,apparent_temperature_max,precipitation_sum,rain_sum,windspeed_10m_max&timezone=Europe%2FBerlin&start_date=${sDate}&end_date=${eDate}`).pipe(
      map((rawWeatherData) => {
        const result: WeatherData[] = []
        console.log(rawWeatherData)
        rawWeatherData.daily.apparent_temperature_max.forEach((rawTemperature: number, index: number) => {
          const temperatureResult: WeatherData = {
            temperature: rawTemperature,
            maxTemperature: rawWeatherData.daily.temperature_2m_max[index],
            date: rawWeatherData.daily.time[index],
            wind: rawWeatherData.daily.windspeed_10m_max[index],
            precip: rawWeatherData.daily.precipitation_sum[index],

          }
          result.push(temperatureResult)
        });
        return result
      })
    )
  }

}

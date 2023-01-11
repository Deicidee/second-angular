import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { debounceTime, filter, map, merge, Observable } from 'rxjs';
import { InMemoryDataService } from '../date-api-service';

export interface WeatherData {
  temperature: number
  maxTemperature: number
  date: string
  wind: number
  precip: number
}
enum WeatherType {
  Sunny,
  PartlyCloudy,
  Cloudy,
  Rainy
}

@Component({
  selector: 'app-weather-forecaster',
  templateUrl: './weather-forecaster.component.html',
  styleUrls: ['./weather-forecaster.component.scss']
})
export class WeatherForecasterComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  weatherDatePicker = new FormGroup({
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date()),
  })

  weatherDatas: Observable<WeatherData[]> = this.inMemoryData.getWeather(this.getWeatherForcasterFormValue('startDate'), this.getWeatherForcasterFormValue('endDate'));

  constructor(private inMemoryData: InMemoryDataService) {
    const n = []
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minDate = new Date(currentYear, currentMonth - 4, currentDay - 24);
    this.maxDate = new Date(currentYear, currentMonth + 1, currentDay + 12);
  }

  ngOnInit(): void {
    merge(
      this.getWeatherForcasterFormControl('startDate').valueChanges,
      this.getWeatherForcasterFormControl('endDate').valueChanges,
    ).pipe(
      filter(x => {
        return !!(this.getWeatherForcasterFormControl('startDate').value && this.getWeatherForcasterFormControl('endDate').value) 
      })
    ).subscribe((dateDatas) => {
      this.weatherDatas = this.inMemoryData.getWeather(this.getWeatherForcasterFormValue('startDate'), this.getWeatherForcasterFormValue('endDate'))
    })
  }

  getImgUrl(weatherData: WeatherData): string {
    switch (this.getWeatherType(weatherData)) {
      case WeatherType.Sunny:
        return "assets/images/weather_icon_full_sun.svg"

      case WeatherType.PartlyCloudy:
        return "assets/images/weather_icon_partly_cloudy.svg"

      case WeatherType.Cloudy:
        return "assets/images/weather_icon_full_clouds.svg"

      case WeatherType.Rainy:
        return "assets/images/weather_icon_cloud_slight_rain.svg"

      default:
        return "assets/images/weather_icon_full_sun.svg"
    }

  };
  getImgText(weatherData: WeatherData): string {
    switch (this.getWeatherType(weatherData)) {
      case WeatherType.Sunny:
        return 'Sunny'

      case WeatherType.PartlyCloudy:
        return 'Partly Cloudy'

      case WeatherType.Cloudy:
        return 'Cloudy'

      case WeatherType.Rainy:
        return 'Rainy'

      default:
        return 'Sunny'
    }
  }
  private getWeatherType(weatherData: WeatherData): WeatherType {
    if (weatherData.precip < 1 && weatherData.wind < 10 && weatherData.temperature > 10) {
      return WeatherType.Sunny
    } else if (weatherData.precip < 1 && weatherData.wind > 10 && weatherData.temperature > 10) {
      return WeatherType.PartlyCloudy
    } else if (weatherData.precip < 1 && weatherData.wind > 10 && weatherData.temperature < 10) {
      return WeatherType.Cloudy
    } else {
      return WeatherType.Rainy
    };

  }
  private getWeatherForcasterFormValue(controlName: string): Date {
    const weatherDateControl = this.getWeatherForcasterFormControl(controlName)
    return weatherDateControl ? weatherDateControl.value : new Date()
  }

  private getWeatherForcasterFormControl(controlName: string): AbstractControl<Date> {
    return this.weatherDatePicker.get(controlName) as AbstractControl<Date>
  }
}

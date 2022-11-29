import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, merge, Observable } from 'rxjs';
import { InMemoryDataService } from '../in-memory-data.service';

export interface WeatherData {
  temperature: number
  maxTemperature: number
  date: string
  wind: string
  precip: string
}

@Component({
  selector: 'app-weather-forecaster',
  templateUrl: './weather-forecaster.component.html',
  styleUrls: ['./weather-forecaster.component.css']
})
export class WeatherForecasterComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  weatherDatePicker = new FormGroup({
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date())
  })

  weatherDatas: Observable<WeatherData[]> = this.inMemoryData.getWeather(this.getWeatherForcasterFormValue('startDate'), this.getWeatherForcasterFormValue('endDate'));

  constructor(private inMemoryData: InMemoryDataService) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minDate = new Date(currentYear, currentMonth - 4, currentDay - 24);
    this.maxDate = new Date(currentYear, currentMonth + 1, currentDay + 12);
  }


  ngOnInit(): void {
    merge(
      this.getWeatherForcasterFormControl('startDate').valueChanges,
      this.getWeatherForcasterFormControl('endDate').valueChanges
    ).pipe(
      debounceTime(500)
    ).subscribe((dateDatas) => {
      this.weatherDatas = this.inMemoryData.getWeather(this.getWeatherForcasterFormValue('startDate'), this.getWeatherForcasterFormValue('endDate'))
    })
  }
  dateRangeDisable() {

  };
  private getWeatherForcasterFormValue(controlName: string): Date {
    const weatherDateControl = this.getWeatherForcasterFormControl(controlName)
    return weatherDateControl ? weatherDateControl.value : new Date()
  }

  private getWeatherForcasterFormControl(controlName: string): AbstractControl<Date> {
    return this.weatherDatePicker.get(controlName) as AbstractControl<Date>
  }

}

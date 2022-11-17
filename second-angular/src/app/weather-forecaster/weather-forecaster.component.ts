import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-weather-forecaster',
  templateUrl: './weather-forecaster.component.html',
  styleUrls: ['./weather-forecaster.component.css']



})
export class WeatherForecasterComponent implements OnInit {

  kutyaFlag = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl('')
  })


  constructor() { }

  ngOnInit(): void {
    this.kutyaFlag.get('startDate')?.valueChanges.subscribe((x) => {
      console.log(x)
    })
    this.kutyaFlag.get('endDate')?.valueChanges.subscribe((y) => {
      console.log(y)
    })
  }
  
}

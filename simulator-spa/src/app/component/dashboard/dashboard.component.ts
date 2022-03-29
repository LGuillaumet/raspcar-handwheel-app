import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SimulatorService } from 'src/app/core/simulator/simulator.service';
import { CarData } from 'src/app/core/simulator/simulator.types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public data: CarData = {
    turnSignalRight: false,
    turnSignalLeft: false,
    positionLight: false,
    cruiseLight: false,
    fullheadLight: false,
    motor: false,
    battery:  false,
    handbrake: false,
    airConditioner: false,
    airSpeedFan: 0,
    airTemperature: 10,
    carTemperature: 0
  };

  public connectionState = false;
  public connectionUrl = '';

  get connectionLabel(): string {
    return this.connectionState ? 'Connected' : 'Disconnected';
  }

  constructor(private service: SimulatorService) { }

  ngOnInit(): void {
    this.service.carData
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: CarData) => this.data = data)

    this.service.connection
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: boolean) => this.connectionState = data)

    this.service.connectionUrl
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((url: string) => this.connectionUrl = url)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public onClickTurnSignal(event: any): void{
    let value = event.target.htmlFor;
    this.data.turnSignalLeft = value === 'left' || value === 'warning';
    this.data.turnSignalRight = value === 'right' || value === 'warning';
    this.service.setCarData(this.data)
  }

  public onClickLight(event: any): void{
    let value = event.target.htmlFor;
    this.data.positionLight = value === 'position';
    this.data.cruiseLight = value === 'cruise';
    this.data.fullheadLight = value === 'fullhead';
    this.service.setCarData(this.data)
  }

  public onChangeSwitch(event: any): void{
    let value = event.target.checked;
    let id : string= event.target.id as string;
    if(id === 'motor') this.data.motor = value;
    else if (id === 'battery') this.data.battery = value;
    else if (id === 'handbrake') this.data.handbrake = value;
    else if (id === 'airConditioner') this.data.airConditioner = value;
    this.service.setCarData(this.data)
  }

  public onChangeRange(event: any): void{
    let value : number = Number(event.target.value);
    console.log(value)
    let id : string= event.target.id as string;
    if(id === 'airSpeedFan') this.data.airSpeedFan = value;
    else if (id === 'airTemperature') this.data.airTemperature = value;
    else if (id === 'carTemperature') this.data.carTemperature = value;
    this.service.setCarData(this.data)
  }

  public connectionChange(event: any): void {
    this.connectionUrl = event.target.value as string;
  }

  public connect(): void {
    this.service.connect(this.connectionUrl)
  }


}

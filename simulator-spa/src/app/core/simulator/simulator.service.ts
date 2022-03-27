import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CarData } from './simulator.types';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

const WS_URL = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  private store: {
    carData: CarData;
  } = {
    carData: {
      positionLight: false,
      cruiseLight: false,
      fullheadLight: false,
      motor: false,
      battery:  false,
      handbrake: false,
      turnSignalRight: false,
      turnSignalLeft: false,
      airConditioner: false,
      airSpeedFan: 0,
      airTemperature: 10,
      carTemperature: 0
    }
  }

  private socket$: WebSocketSubject<CarData>;
  private _carData = new BehaviorSubject<CarData>(this.store.carData);
  readonly carData = this._carData.asObservable();

  constructor() {
    this.socket$ = webSocket(WS_URL);
    this.socket$.subscribe({
      next: this.onMessage.bind(this),
      error: this.onError.bind(this),
      complete: this.onComplete.bind(this)
    })
  }

  public setCarData(data: CarData): void {
    this.store.carData = data
    this._carData.next(Object.assign({}, data));
    this.sendCarData();
  }

  private sendCarData(): void {
    this.socket$.next(this.store.carData)
  }

  private onMessage(data: CarData): void {
    console.log(this)
    console.log(data)
    console.log(this.store.carData)
    this.store.carData = data
    this._carData.next(Object.assign({}, data));
  }

  private onError(err: any): void {
    console.log(err)
  }

  private onComplete(): void {
    console.log('complete')
  }
}

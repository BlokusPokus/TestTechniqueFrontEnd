import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string): void {
    if (!environment.production) {
      console.log(message);
    }
  }

  error(message: string, error?: any): void {
    if (!environment.production) {
      console.error(message, error);
    }
  }

}

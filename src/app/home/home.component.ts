import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CONSTANTS } from './constants';
import {LoggerService} from "../services/logger.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  fullName = "Ian Le Blanc";
  buttonText = "GET";
  constructor(
    private router: Router,
    private userService: UserService,
    private logger: LoggerService
  ) {}
  getUsers(): void {
    this.userService.fetchUsers().subscribe({
      next: (users) => {
        this.userService.setUsers(users); // Store fetched users
        this.router.navigate([CONSTANTS.ROUTES.USERS]).then(success => {
          if (success) {
            this.logger.log(CONSTANTS.LOG_MESSAGES.NAVIGATION_SUCCESS);
          } else {
            this.logger.log(CONSTANTS.LOG_MESSAGES.NAVIGATION_FAILED);
          }
        }).catch(error => {
          this.logger.error(CONSTANTS.LOG_MESSAGES.FETCH_USERS_ERROR, error);
        });
      },
      error: (error) => {
        this.logger.error(CONSTANTS.LOG_MESSAGES.FETCH_USERS_ERROR, error);
      }
    });
  }
}

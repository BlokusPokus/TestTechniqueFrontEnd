import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from "../services/user.service";
import { LoggerService } from "../services/logger.service";
import { User } from '../models/user.model';
import { CONSTANTS } from './constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'gender', 'status'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private userService: UserService, private logger: LoggerService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.sort = this.sort;
        this.logger.log(CONSTANTS.LOG_MESSAGES.USERS_LOAD_SUCCESS);
      },
      error: (error) => {
        this.logger.error(CONSTANTS.LOG_MESSAGES.USERS_LOAD_ERROR, error);
      }
    });
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UserService } from '../services/user.service';
import { LoggerService } from '../services/logger.service';
import { Observable, of, throwError} from 'rxjs';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUserService: { getUsers: { and: { returnValue: (arg0: Observable<{ id: number; name: string; email: string; gender: string; status: string; }[]>) => void; }; }; };
  let mockLoggerService: { error: any; };

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);
    mockLoggerService = jasmine.createSpyObj('LoggerService', ['log', 'error']);

    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should load users on init', () => {
    const users = [{ id: 1, name: 'Test User', email: 'test@example.com', gender: 'Female', status: 'Active' }];
    mockUserService.getUsers.and.returnValue(of(users));

    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(users);
    expect(mockUserService.getUsers).toHaveBeenCalled();
  });

  it('should handle error when users cannot be loaded', () => {
    mockUserService.getUsers.and.returnValue(throwError({ status: 404 }));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(mockLoggerService.error).toHaveBeenCalled();

  });
});

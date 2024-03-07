import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoggerService } from '../services/logger.service';
import { of, throwError } from 'rxjs';
import {CONSTANTS} from "./constants";


class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
}

class MockUserService {
  fetchUsers = jasmine.createSpy('fetchUsers').and.returnValue(of([{ name: 'Test User' }]));
  setUsers = jasmine.createSpy('setUsers');
}

class MockLoggerService {
  log = jasmine.createSpy('log');
  error = jasmine.createSpy('error');
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter: MockRouter;
  let mockUserService: MockUserService;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockUserService = new MockUserService();
    mockLoggerService = new MockLoggerService();

    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial fullName and buttonText', () => {
    expect(component.fullName).toBe('Ian Le Blanc');
    expect(component.buttonText).toBe('GET');
  });

  it('should handle users fetch successfully and navigate', (done: DoneFn) => {
    component.getUsers();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockUserService.setUsers).toHaveBeenCalledWith([{ name: 'Test User' }]);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
      expect(mockLoggerService.log).toHaveBeenCalledWith(CONSTANTS.LOG_MESSAGES.NAVIGATION_SUCCESS);
      done();
    });
  });

  it('should log navigation failure when navigation fails', (done: DoneFn) => {
    mockRouter.navigate.and.returnValue(Promise.resolve(false));
    component.getUsers();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockLoggerService.log).toHaveBeenCalledWith(CONSTANTS.LOG_MESSAGES.NAVIGATION_FAILED);
      done();
    });
  });

  it('should handle error on fetch users failure', (done: DoneFn) => {
    mockUserService.fetchUsers.and.returnValue(throwError(() => new Error('Error fetching users')));
    component.getUsers();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockLoggerService.error).toHaveBeenCalledWith(CONSTANTS.LOG_MESSAGES.FETCH_USERS_ERROR, jasmine.any(Error));
      done();
    });
  });
});

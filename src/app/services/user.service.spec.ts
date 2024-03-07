import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetchUsers should return expected users', () => {
    const expectedUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' },

    ];

    service.fetchUsers().subscribe(users => {
      expect(users.length).toBe(expectedUsers.length);
      expect(users).toEqual(expectedUsers);
    });

    const req = httpTestingController.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedUsers);
  });

  it('setUsers should update the users BehaviorSubject', (done: DoneFn) => {
    const testUsers: User[] = [{ id: 2, name: 'Jane Doe', email: 'jane@example.com', gender: 'female', status: 'inactive' }];
    service.setUsers(testUsers);

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(testUsers.length);
      expect(users).toEqual(testUsers);
      done();
    });
  });

});

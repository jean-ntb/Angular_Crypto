import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should login with correct credentials', () => {
    const result = service.login('user@test.com', 'password');
    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should not login with incorrect credentials', () => {
    const result = service.login('wrong@test.com', 'wrong');
    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should logout correctly', () => {
    service.login('user@test.com', 'password');
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
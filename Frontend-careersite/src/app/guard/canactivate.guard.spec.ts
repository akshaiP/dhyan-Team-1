import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { canActivateGuard } from './canactivate.guard';

// Mocking the Router class
class MockRouter {
  navigateByUrl(url: string) {
    return Promise.resolve(true);
  }
}

// Mocking ActivatedRouteSnapshot and RouterStateSnapshot
const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

describe('canActivateGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useClass: MockRouter }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(canActivateGuard).toBeTruthy();
  });

  it('should return true if token is present in localStorage', () => {
    localStorage.setItem('angular18Token', 'some-token');
    const result = canActivateGuard(mockRoute, mockState);
    expect(result).toBe(true);
  });

  it('should navigate to login if token is not present in localStorage', () => {
    localStorage.removeItem('angular18Token');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    const result = canActivateGuard(mockRoute, mockState);
    expect(result).toBe(false);
    expect(navigateByUrlSpy).toHaveBeenCalledWith('login');
  });
});

import {TestBed} from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import {AuthService} from './auth.service';
import {adminGuard, authGuard} from './auth.guard';

describe('AuthService',()=>{
  beforeEach(()=>{localStorage.clear();TestBed.configureTestingModule({providers:[provideRouter([])]});});

  it('starts signed out',()=>{
    const auth=TestBed.inject(AuthService);
    expect(auth.signedIn()).toBe(false);
    expect(auth.isAdmin()).toBe(false);
  });

  it('rejects short passwords for members',()=>{
    const auth=TestBed.inject(AuthService);
    expect(auth.signIn('a@b.co','123')).toBe(false);
    expect(auth.signedIn()).toBe(false);
  });

  it('signs a member in and persists the session',()=>{
    const auth=TestBed.inject(AuthService);
    expect(auth.signIn('sam@example.com','secret1')).toBe(true);
    expect(auth.user()?.role).toBe('member');
    expect(JSON.parse(localStorage.getItem('eathealthy-session')||'null').email).toBe('sam@example.com');
  });

  it('requires onboarding after registration',()=>{
    const auth=TestBed.inject(AuthService);
    auth.register('Sam','sam@example.com');
    expect(auth.user()?.onboarded).toBe(false);
    auth.completeOnboarding('Sam R');
    expect(auth.user()).toMatchObject({name:'Sam R',onboarded:true});
  });

  it('signs out and clears storage',()=>{
    const auth=TestBed.inject(AuthService);
    vi.spyOn(TestBed.inject(Router),'navigateByUrl').mockResolvedValue(true);
    auth.signIn('sam@example.com','secret1');
    auth.signOut();
    expect(auth.signedIn()).toBe(false);
    expect(localStorage.getItem('eathealthy-session')).toBeNull();
  });
});

describe('route guards',()=>{
  beforeEach(()=>{localStorage.clear();TestBed.configureTestingModule({providers:[provideRouter([])]});});
  const run=(guard:typeof authGuard)=>TestBed.runInInjectionContext(()=>guard({} as never,{} as never));

  it('redirects signed-out visitors to /login',()=>{
    expect(String(run(authGuard))).toBe('/login');
  });

  it('lets signed-in members through but keeps them out of admin',()=>{
    TestBed.inject(AuthService).signIn('sam@example.com','secret1');
    expect(run(authGuard)).toBe(true);
    expect(String(run(adminGuard))).toBe('/home');
  });

  it('admits the admin account',()=>{
    TestBed.inject(AuthService).signIn('admin@eathealthy.co.za','Password1!');
    expect(run(adminGuard)).toBe(true);
  });
});

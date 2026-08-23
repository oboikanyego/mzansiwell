import {computed,Injectable,signal} from '@angular/core';
import {Router} from '@angular/router';

export interface SessionUser{name:string;email:string;role:'member'|'admin';onboarded:boolean}

@Injectable({providedIn:'root'})
export class AuthService{
  private readonly storageKey='eathealthy-session';
  private readonly state=signal<SessionUser|null>(this.restore());
  readonly user=this.state.asReadonly();
  readonly signedIn=computed(()=>this.state()!==null);
  readonly isAdmin=computed(()=>this.state()?.role==='admin');

  constructor(private router:Router){}

  signIn(email:string,password:string){
    const admin=email.toLowerCase()==='admin@eathealthy.co.za'&&password==='Password1!';
    const member=password.length>=6;
    if(!admin&&!member)return false;
    this.save(admin?{name:'EatHealthy Admin',email,role:'admin',onboarded:true}:{name:email.split('@')[0]||'Member',email,role:'member',onboarded:true});
    return true;
  }

  register(name:string,email:string){this.save({name,email,role:'member',onboarded:false});}
  completeOnboarding(name:string){const current=this.state();if(current)this.save({...current,name,onboarded:true});}
  signOut(){localStorage.removeItem(this.storageKey);this.state.set(null);this.router.navigateByUrl('/');}

  private save(user:SessionUser){localStorage.setItem(this.storageKey,JSON.stringify(user));this.state.set(user);}
  private restore():SessionUser|null{try{return JSON.parse(localStorage.getItem(this.storageKey)||'null')}catch{return null}}
}

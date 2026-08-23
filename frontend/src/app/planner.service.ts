import {inject,Injectable} from '@angular/core'; import {HttpClient} from '@angular/common/http'; import {MemberProfile,NotificationPreferences,Plan,Profile,ReportSummary,ScheduleEventInput,Subscription} from './models';
@Injectable({providedIn:'root'}) export class PlannerService{
 private http=inject(HttpClient);
 private api=(window as Window & {__EATHEALTHY_CONFIG__?:{apiBaseUrl?:string}}).__EATHEALTHY_CONFIG__?.apiBaseUrl?.replace(/\/$/,'')||'';
 private url(path:string){return `${this.api}${path}`}
 generate(p:Profile){return this.http.post<Plan>(this.url('/api/plans/generate'),p)}
 import(file:File){const body=new FormData();body.append('file',file);return this.http.post<{fileName:string;rows:Record<string,unknown>[]}>(this.url('/api/import/excel'),body)}
 getMemberProfile(){return this.http.get<MemberProfile>(this.url('/api/member/profile'))}
 updateMemberProfile(profile:Omit<MemberProfile,'id'>){return this.http.put<MemberProfile>(this.url('/api/member/profile'),profile)}
 getSubscription(){return this.http.get<Subscription>(this.url('/api/member/subscription'))}
 getNotifications(){return this.http.get<{items:unknown[];preferences:NotificationPreferences}>(this.url('/api/member/notifications'))}
 updateNotificationPreferences(value:NotificationPreferences){return this.http.put<NotificationPreferences>(this.url('/api/member/notification-preferences'),value)}
 recordScheduleOutcome(value:ScheduleEventInput){return this.http.post(this.url('/api/member/schedule-events'),value)}
 getReportSummary(){return this.http.get<ReportSummary>(this.url('/api/member/reports/summary'))}
}

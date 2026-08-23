import {inject,Injectable} from '@angular/core'; import {HttpClient} from '@angular/common/http'; import {MemberProfile,NotificationPreferences,Plan,Profile,ReportSummary,ScheduleEventInput,Subscription} from './models';
@Injectable({providedIn:'root'}) export class PlannerService{
 private http=inject(HttpClient);
 generate(p:Profile){return this.http.post<Plan>('/api/plans/generate',p)}
 import(file:File){const body=new FormData();body.append('file',file);return this.http.post<{fileName:string;rows:Record<string,unknown>[]}>('/api/import/excel',body)}
 getMemberProfile(){return this.http.get<MemberProfile>('/api/member/profile')}
 updateMemberProfile(profile:Omit<MemberProfile,'id'>){return this.http.put<MemberProfile>('/api/member/profile',profile)}
 getSubscription(){return this.http.get<Subscription>('/api/member/subscription')}
 getNotifications(){return this.http.get<{items:unknown[];preferences:NotificationPreferences}>('/api/member/notifications')}
 updateNotificationPreferences(value:NotificationPreferences){return this.http.put<NotificationPreferences>('/api/member/notification-preferences',value)}
 recordScheduleOutcome(value:ScheduleEventInput){return this.http.post('/api/member/schedule-events',value)}
 getReportSummary(){return this.http.get<ReportSummary>('/api/member/reports/summary')}
}

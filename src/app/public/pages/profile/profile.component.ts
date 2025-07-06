import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width: 400px; margin: 2rem auto; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); background: #fff;">
      <h2 style="text-align:center; margin-bottom: 1.5rem;">User Profile</h2>
      <div *ngIf="user">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Roles:</strong> <span *ngFor="let role of user.roles; let last = last">{{ role }}<span *ngIf="!last">, </span></span></p>
      </div>
      <div *ngIf="!user" style="text-align:center; color: #888;">Loading...</div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;
  private http = inject(HttpClient);

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any>(`/api/v1/users/${userId}`, { headers })
      .subscribe({
        next: data => this.user = data,
        error: () => this.user = null
      });
  }
}

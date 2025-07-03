import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-authentication-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
  ],
  templateUrl: './authentication-section.component.html',
  styleUrl: './authentication-section.component.css',
})
export class AuthenticationSectionComponent implements OnInit {
  isSignedIn$: Observable<boolean>;
  currentUsername$: Observable<string>;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.isSignedIn$ = this.authService.isSignedIn;
    this.currentUsername$ = this.authService.currentUsername;
  }

  ngOnInit() {
    // Component initialization logic if needed
  }

  onSignOut() {
    this.authService.signOut();
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}

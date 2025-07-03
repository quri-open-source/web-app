import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SignUpRequest } from '../model/sign-up.request';
import { SignUpResponse } from '../model/sign-up.response';
import { SignInRequest } from '../model/sign-in.request';
import { SignInResponse } from '../model/sign-in.response';

/**
 * Service for handling authentication operations.
 * @summary
 * This service is responsible for handling authentication operations like sign-up, sign-in, and sign-out.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  basePath: string = `${environment.serverBaseUrl}`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private signedInUserId: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private signedInUsername: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  /**
   * Constructor for the AuthenticationService.
   * @param router The router service.
   * @param http The HttpClient service.
   */
  constructor(private router: Router, private http: HttpClient) {
    console.log('🔧 AuthenticationService initialized');
    console.log('🌐 Base URL:', this.basePath);
    console.log('🌐 Sign-up URL:', `${this.basePath}/auth/sign-up`);
    console.log('🌐 Sign-in URL:', `${this.basePath}/auth/sign-in`);
    this.checkCurrentSession();
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUsername() {
    return this.signedInUsername.asObservable();
  }

  /**
   * Check if user has a valid session from localStorage
   */
  private checkCurrentSession() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && userId && username) {
      this.signedIn.next(true);
      this.signedInUserId.next(userId);
      this.signedInUsername.next(username);
    }
  }

  /**
   * Sign up a new user.
   * @summary
   * This method sends a POST request to the server with the user's username and password.
   * If the request is successful, the user's id and username are logged and the user is navigated to the sign-in page.
   * If the request fails, an error message is logged and the user is navigated to the sign-up page.
   * @param signUpRequest The {@link SignUpRequest} object containing the user's username and password.
   * @returns The {@link SignUpResponse} object containing the user's id and username.
   */
  signUp(signUpRequest: SignUpRequest) {
    return this.http
      .post<SignUpResponse>(
        `${this.basePath}/auth/sign-up`,
        signUpRequest,
        this.httpOptions
      )
      .subscribe({
        next: (response) => {
          console.log(
            `Signed up as ${response.username} with id ${response.id}`
          );
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['/sign-up']).then();
        },
      });
  }

  /**
   * Sign up a new user with callback handling.
   * @summary
   * This method sends a POST request to the server and returns the observable for manual subscription.
   * @param signUpRequest The {@link SignUpRequest} object containing the user's username, password, and roles.
   * @returns Observable of {@link SignUpResponse}
   */
  signUpWithCallback(signUpRequest: SignUpRequest) {
    console.log('🚀 SignUp Request:', signUpRequest);
    console.log('📡 Sending POST to:', `${this.basePath}/auth/sign-up`);
    console.log('📝 Request body:', JSON.stringify(signUpRequest));
    console.log('🔧 HTTP Options:', this.httpOptions);

    return this.http.post<SignUpResponse>(
      `${this.basePath}/auth/sign-up`,
      signUpRequest,
      this.httpOptions
    );
  }

  /**
   * Sign in a user.
   * @summary
   * This method sends a POST request to the server with the user's username and password.
   * If the request is successful, the signedIn, signedInUserId, and signedInUsername are set to true,
   * the user's id, and the user's username respectively.
   * The token is stored in the local storage and the user is navigated to the home page.
   * If the request fails, the signedIn, signedInUserId, and signedInUsername are set to false, 0, and
   * an empty string respectively.
   * An error message is logged and the user is navigated to the sign-in page.
   * @param signInRequest The {@link SignInRequest} object containing the user's username and password.
   * @returns The {@link SignInResponse} object containing the user's id, username, and token.
   */
  signIn(signInRequest: SignInRequest) {
    console.log(signInRequest);
    return this.http
      .post<SignInResponse>(
        `${this.basePath}/auth/sign-in`,
        signInRequest,
        this.httpOptions
      )
      .subscribe({
        next: (response) => {
          this.updateAuthenticationState(response);
          console.log(
            `Signed in as ${response.username} with token ${response.token}`
          );
          this.router.navigate(['/home']).then();
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next('');
          this.signedInUsername.next('');
          console.error(`Error while signing in: ${error}`);
          this.router.navigate(['/sign-in']).then();
        },
      });
  }

  /**
   * Sign in a user with callback handling.
   * @summary
   * This method sends a POST request to the server and returns the observable for manual subscription.
   * @param signInRequest The {@link SignInRequest} object containing the user's username and password.
   * @returns Observable of {@link SignInResponse}
   */
  signInWithCallback(signInRequest: SignInRequest) {
    console.log('🚀 SignIn Request:', signInRequest);
    console.log('📡 Sending POST to:', `${this.basePath}/auth/sign-in`);
    console.log('📝 Request body:', JSON.stringify(signInRequest));
    console.log('🔧 HTTP Options:', this.httpOptions);

    return this.http.post<SignInResponse>(
      `${this.basePath}/auth/sign-in`,
      signInRequest,
      this.httpOptions
    );
  }

  /**
   * Update authentication state with response data
   * @param response The sign-in response containing user data and token
   */
  updateAuthenticationState(response: SignInResponse) {
    this.signedIn.next(true);
    this.signedInUserId.next(response.id);
    this.signedInUsername.next(response.username);
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.id);
    localStorage.setItem('username', response.username);
  }

  /**
   * Sign out the user.
   * @summary
   * This method sets the signedIn, signedInUserId, and signedInUsername to their default values,
   * removes the token from the local storage, and navigates to the sign-in page.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next('');
    this.signedInUsername.next('');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    this.router.navigate(['/sign-in']).then();
  }
}

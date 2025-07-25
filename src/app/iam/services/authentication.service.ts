import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import { CartService } from '../../shared/services/cart.service';
import {SignUpRequest} from "../model/sign-up.request";
import {SignUpResponse} from "../model/sign-up.response";
import {SignInRequest} from "../model/sign-in.request";
import {SignInResponse} from "../model/sign-in.response";

/**
 * Service for handling authentication operations.
 * @summary
 * This service is responsible for handling authentication operations like sign-up, sign-in, and sign-out.
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  basePath: string = `${environment.serverBaseUrl}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private signedInUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Constructor for the AuthenticationService.
    * @param router The router service.
   * @param http The HttpClient service.
   */
  constructor(private router: Router, private http: HttpClient, private cartService: CartService) {
    this.checkStoredAuthentication();
  }

  /**
   * Check if there's a stored authentication token and user data in localStorage
   * @summary
   * This method checks localStorage for authentication data and restores the user's session if valid.
   */
  checkStoredAuthentication(): boolean {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && userId && username) {
      // Always update the state to ensure it's current
      this.signedIn.next(true);
      this.signedInUserId.next(userId);
      this.signedInUsername.next(username);
      return true;
    }

    // Clear the state if no valid data
    this.signedIn.next(false);
    this.signedInUserId.next('');
    this.signedInUsername.next('');
    return false;
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
   * Sign up a new user.
   * @summary
   * This method sends a POST request to the server with the user's username and password.
   * If the request is successful, the user's id and username are logged and the user is navigated to the sign-in page.
   * If the request fails, an error message is logged and the user is navigated to the sign-up page.
   * @param signUpRequest The {@link SignUpRequest} object containing the user's username and password.
   * @returns The {@link SignUpResponse} object containing the user's id and username.
   */
  signUp(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/api/v1/auth/sign-up`, signUpRequest, this.httpOptions);
  }

  /**
   * Sign in a user.
   * @summary
   * This method sends a POST request to the server with the user's username and password.
   * If the request is successful, the signedIn, signedInUserId, and signedInUsername are set to true,
   * the user's id, and the user's username respectively.
   * The token is stored in the local storage and the user is navigated to the home page.
   * If the request fails, the signedIn, signedInUserId, and signedInUsername are set to false, empty string, and
   * an empty string respectively.
   * An error message is logged and the user is navigated to the sign-in page.
   * @param signInRequest The {@link SignInRequest} object containing the user's username and password.
   * @returns The {@link SignInResponse} object containing the user's id, username, and token.
   */
  signIn(signInRequest: SignInRequest) {

    console.log(`Signing in with request:`, `${this.basePath}/api/v1/auth/sign-in`);
    return this.http.post<SignInResponse>(`${this.basePath}/api/v1/auth/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInUsername.next(response.username);
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.id.toString());
          localStorage.setItem('username', response.username);
          // Obtener roles del usuario
          this.http.get<any>(`${this.basePath}/api/v1/users/${response.id}`, this.httpOptions)
            .subscribe({
              next: (userDetails) => {
                if (userDetails.roles) {
                  localStorage.setItem('roles', JSON.stringify(userDetails.roles));
                }
                this.router.navigate(['/home']).then();
              },
              error: (err) => {
                // Si falla, limpiar roles y continuar
                localStorage.removeItem('roles');
                this.router.navigate(['/home']).then();
              }
            });
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next('');
          this.signedInUsername.next('');
          console.error(`Error while signing in:`, error);

          // Show more specific error messages
          if (error.status === 401) {
            alert('Invalid username or password. Please check your credentials.');
          } else if (error.status === 403) {
            alert('Access forbidden. Please contact support.');
          } else {
            alert('Sign in failed. Please try again.');
          }

          this.router.navigate(['/sign-in']).then();
        }
      });
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
    this.cartService.clearCart();
    localStorage.clear();
    this.router.navigate(['/sign-in']).then();
  }

  /**
   * Check if the current user has a valid token
   * @summary
   * This method checks if there's a valid token in localStorage
   * @returns boolean indicating if the user has a valid token
   */
  hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== '';
  }

  /**
   * Get the current token from localStorage
   * @summary
   * This method retrieves the authentication token from localStorage
   * @returns The authentication token or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Comprehensive authentication check
   * @summary
   * This method performs a comprehensive check of the user's authentication state
   * @returns boolean indicating if the user is fully authenticated
   */
  isAuthenticated(): boolean {
    // Check localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    // Check service state
    const serviceSignedIn = this.signedIn.value;
    const serviceUserId = this.signedInUserId.value;
    const serviceUsername = this.signedInUsername.value;

    // Simple check: if localStorage has all data, consider authenticated
    const hasLocalStorageData = !!(token && userId && username);
    const hasServiceData = !!(serviceSignedIn && serviceUserId && serviceUsername);

    // If both localStorage and service have data, return true
    if (hasLocalStorageData && hasServiceData) {
      return true;
    }

    // If only localStorage has data, sync with service (but don't log to avoid spam)
    if (hasLocalStorageData && !hasServiceData) {
      this.signedIn.next(true);
      this.signedInUserId.next(userId);
      this.signedInUsername.next(username);
      return true;
    }

    // If only service has data but no localStorage, clear service state
    if (!hasLocalStorageData && hasServiceData) {
      this.signedIn.next(false);
      this.signedInUserId.next('');
      this.signedInUsername.next('');
      return false;
    }

    // Neither has data
    return false;
  }

}

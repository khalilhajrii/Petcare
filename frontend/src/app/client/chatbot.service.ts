import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../shared/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private modelApiUrl = 'http://localhost:3005'; // Model API URL

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  /**
   * Send a message to the reservation chatbot
   * @param message The user's message/query
   * @returns Observable with the chatbot response
   */
  sendMessage(message: string): Observable<any> {
    return new Observable<any>(observer => {
      // First try to get the email from storage
      this.storage.get('email').then(email => {
        if (!email) {
          console.warn('Email not found in storage, trying to get from user object');
          // Try to get the email from the user object in storage as fallback
          this.storage.get('user').then(user => {
            if (user && user.email) {
              this.processMessage(user.email, message, observer);
              // Also store the email for future use
              this.storage.set('email', user.email);
            } else {
              console.error('User email not found in storage or user object');
              observer.error('User email not found. Please log out and log in again.');
            }
          });
        } else {
          this.processMessage(email, message, observer);
        }
      }).catch(error => {
        console.error('Error accessing storage:', error);
        observer.error('Could not access user data. Please try again later.');
      });
    });
  }

  /**
   * Helper method to process the message once we have the email
   */
  private processMessage(email: string, message: string, observer: any): void {
    // Prepare the request body
    const body = {
      query: message
    };
    
    console.log('Using email for chatbot:', email);
    
    // Configure headers - only set content type, the server handles CORS
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Make the API call with headers
    this.http.post(`${this.modelApiUrl}/api/reservation/${email}`, body, { headers })
      .subscribe({
        next: (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('Error sending message to chatbot:', error);
          observer.error(error);
        }
      });
  }
}
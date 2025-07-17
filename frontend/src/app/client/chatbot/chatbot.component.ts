import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../chatbot.service';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  messages: ChatMessage[] = [];
  newMessage = '';
  isLoading = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Add welcome message
    this.messages.push({
      content: 'Bonjour! Je suis votre assistant de réservation. Comment puis-je vous aider aujourd\'hui?',
      isUser: false,
      timestamp: new Date()
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // Add user message to chat
    this.messages.push({
      content: this.newMessage,
      isUser: true,
      timestamp: new Date()
    });

    const userQuery = this.newMessage;
    this.newMessage = ''; // Clear input field
    
    // Show loading indicator
    this.isLoading = true;
    
    // Add temporary thinking message
    const thinkingIndex = this.messages.length;
    this.messages.push({
      content: 'En train de réfléchir...',
      isUser: false,
      timestamp: new Date()
    });

    // Send message to chatbot service
    this.chatbotService.sendMessage(userQuery).subscribe({
      next: (response) => {
        // Remove thinking message
        this.messages.splice(thinkingIndex, 1);
        
        // Add bot response
        this.messages.push({
          content: response.result || response.message || 'Je n\'ai pas pu traiter votre demande. Veuillez réessayer.',
          isUser: false,
          timestamp: new Date()
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error getting response from chatbot:', error);
        
        // Remove thinking message
        this.messages.splice(thinkingIndex, 1);
        
        // Create appropriate error message based on the error
        let errorContent = 'Désolé, j\'ai rencontré un problème. Veuillez réessayer plus tard.';
        
        // Check if it's the email not found error
        if (typeof error === 'string' && error.includes('User email not found')) {
          errorContent = 'Je ne peux pas accéder à vos informations de compte. Veuillez vous déconnecter et vous reconnecter pour continuer à utiliser le chatbot.';
        } else if (error?.status === 0) {
          errorContent = 'Impossible de se connecter au service de chatbot. Veuillez vérifier votre connexion internet et réessayer.';
        } else if (error?.status >= 500) {
          errorContent = 'Le service de chatbot est actuellement indisponible. Veuillez réessayer plus tard.';
        }
        
        // Add error message
        this.messages.push({
          content: errorContent,
          isUser: false,
          timestamp: new Date()
        });
        
        this.isLoading = false;
      }
    });
  }
}
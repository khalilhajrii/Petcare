import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ChatbotComponent } from './chatbot.component';
import { ChatbotService } from '../chatbot.service';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;
  let chatbotServiceSpy: jasmine.SpyObj<ChatbotService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ChatbotService', ['sendMessage']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule, ChatbotComponent],
      providers: [
        { provide: ChatbotService, useValue: spy }
      ]
    }).compileComponents();

    chatbotServiceSpy = TestBed.inject(ChatbotService) as jasmine.SpyObj<ChatbotService>;
    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle chat visibility when toggleChat is called', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleChat();
    expect(component.isOpen).toBeTrue();
    component.toggleChat();
    expect(component.isOpen).toBeFalse();
  });

  it('should add welcome message on init', () => {
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].isUser).toBeFalse();
    expect(component.messages[0].content).toContain('Bonjour');
  });

  it('should not send empty messages', () => {
    component.newMessage = '   ';
    component.sendMessage();
    expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
  });

  it('should add user message and call service when sending message', () => {
    chatbotServiceSpy.sendMessage.and.returnValue(of({ result: 'Test response' }));
    
    component.newMessage = 'Test message';
    component.sendMessage();
    
    expect(component.messages.length).toBe(3); // Welcome + user message + bot response
    expect(component.messages[1].content).toBe('Test message');
    expect(component.messages[1].isUser).toBeTrue();
    expect(component.messages[2].content).toBe('Test response');
    expect(component.messages[2].isUser).toBeFalse();
    expect(component.newMessage).toBe('');
    expect(chatbotServiceSpy.sendMessage).toHaveBeenCalledWith('Test message');
  });

  it('should handle errors from the chatbot service', () => {
    chatbotServiceSpy.sendMessage.and.returnValue(throwError(() => new Error('Test error')));
    
    component.newMessage = 'Test message';
    component.sendMessage();
    
    expect(component.messages.length).toBe(3); // Welcome + user message + error message
    expect(component.messages[2].content).toContain('Désolé');
    expect(component.isLoading).toBeFalse();
  });
});
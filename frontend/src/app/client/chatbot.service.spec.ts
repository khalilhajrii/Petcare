import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage-angular';

import { ChatbotService } from './chatbot.service';
import { StorageService } from '../shared/storage.service';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', ['get']);
    spy.get.and.returnValue(Promise.resolve('test@example.com'));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        IonicStorageModule.forRoot()
      ],
      providers: [
        ChatbotService,
        { provide: StorageService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ChatbotService);
    httpMock = TestBed.inject(HttpTestingController);
    storageSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send message to the reservation API', (done) => {
    const testMessage = 'I want to make a reservation';
    const mockResponse = { result: 'Reservation created successfully' };

    service.sendMessage(testMessage).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });

    // Check that the email was retrieved from storage
    expect(storageSpy.get).toHaveBeenCalledWith('email');

    // Expect a request to the correct URL with the right data
    const req = httpMock.expectOne('http://localhost:5000/api/reservation/test@example.com');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ query: testMessage });

    // Respond with mock data
    req.flush(mockResponse);
  });

  it('should handle error when email is not found', (done) => {
    storageSpy.get.and.returnValue(Promise.resolve(null));
    
    service.sendMessage('test message').subscribe({
      next: () => {
        fail('Expected an error, not a successful response');
      },
      error: (error) => {
        expect(error).toBe('User email not found');
        done();
      }
    });
  });
});
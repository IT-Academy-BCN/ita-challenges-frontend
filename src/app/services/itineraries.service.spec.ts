import { TestBed } from '@angular/core/testing';
import { ItinerariesService } from './itineraries.service';



describe('ItinerariesService', () => {
  let service: ItinerariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItinerariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

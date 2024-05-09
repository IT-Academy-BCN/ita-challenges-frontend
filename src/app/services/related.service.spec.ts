import { RelatedService } from "./related.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { TestBed } from "@angular/core/testing";

describe('RelatedService', () => {

  let service: RelatedService;
  let httpClient: HttpClient;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpClientMock = TestBed.inject(HttpTestingController);
    service = new RelatedService(httpClient);
  });

  it('Should return null when related challenges are NOT FOUND', (done) => {
    httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/challengeId/related`).flush(null);

    const challenges = service.getRelatedChallenges('challengeId');

    expect(challenges).toBeDefined();
    expect(challenges).toBe(null);

    done();
  });

  it('Should return the related challenges when they ARE FOUND', (done) => {
    const mockChallenges = [
      { challengeId: '2bfc1a9e-30e3-40b2-9e97-8db7c5a4e9e4', name: 'mockName1' },
    ];

    httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${challengeId}/related`).flush(mockChallenges);

    const challenges = service.getRelatedChallenges('2bfc1a9e-30e3-40b2-9e97-8db7c5a4e9e4');

    expect(challenges).toBeDefined();
    expect(challenges).toBe(mockChallenges);

    done();
  });

});
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BookmarkComponent } from './bookmark.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services/auth.service';
import { Challenge } from 'src/app/models/challenge.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BookmarkComponent', () => {
  let component: BookmarkComponent;
  let fixture: ComponentFixture<BookmarkComponent>;
  let challengeService: jest.Mocked<ChallengeService>;
  let authService: jest.Mocked<AuthService>;
  let toastrService: jest.Mocked<ToastrService>;
  let translateService: jest.Mocked<TranslateService>;

  const mockChallenge = new Challenge({
    id_challenge: '1',
    challenge_title: 'Test Challenge',
    level: 'Easy',
    creation_date: '2023-01-01',
    detail: {
      description: 'Test Description',
      examples: [],
      notes: ''
    },
    languages: [],
    solutions: [],
    tags: [],
    related_challenges: []
  });

  beforeEach(async () => {
    const challengeServiceMock = {
      getUserBookmarks: jest.fn(),
      getChallengeById: jest.fn(),
    };

    const authServiceMock = {
      getUserId: jest.fn(),
    };

    const toastrServiceMock = {
      error: jest.fn(),
      info: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [BookmarkComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ChallengeService, useValue: challengeServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkComponent);
    component = fixture.componentInstance;
    challengeService = TestBed.inject(ChallengeService) as jest.Mocked<ChallengeService>;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
    translateService = TestBed.inject(TranslateService) as jest.Mocked<TranslateService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load bookmarked challenges on init', () => {
      const spy = jest.spyOn(component as any, 'loadBookmarkedChallenges').mockImplementation(() => {});
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('loadBookmarkedChallenges', () => {
    it('should load challenges when user is authenticated and has bookmarks', fakeAsync(() => {
      const userId = 'user123';
      const bookmarkIds = ['1', '2'];
      authService.getUserId.mockReturnValue(of(userId));
      challengeService.getUserBookmarks.mockReturnValue(of(bookmarkIds));
      challengeService.getChallengeById.mockImplementation(id => of(new Challenge({ ...mockChallenge, id_challenge: id })));

      fixture.detectChanges();
      tick();

      expect(authService.getUserId).toHaveBeenCalled();
      expect(challengeService.getUserBookmarks).toHaveBeenCalledWith(userId);
      expect(challengeService.getChallengeById).toHaveBeenCalledTimes(2);
      expect(component.bookmarkedChallenges.length).toBe(2);
      expect(component.isLoading).toBe(false);
    }));

    it('should show error if user is not authenticated', fakeAsync(() => {
      authService.getUserId.mockReturnValue(of(null));
      
      fixture.detectChanges();
      tick();

      expect(toastrService.error).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    }));

    it('should show error if getUserBookmarks fails', fakeAsync(() => {
      authService.getUserId.mockReturnValue(of('user123'));
      challengeService.getUserBookmarks.mockReturnValue(throwError(() => new Error('Failed')));

      fixture.detectChanges();
      tick();

      expect(toastrService.error).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    }));
    
    it('should handle empty bookmarks array', fakeAsync(() => {
        authService.getUserId.mockReturnValue(of('user123'));
        challengeService.getUserBookmarks.mockReturnValue(of([]));

        fixture.detectChanges();
        tick();

        expect(toastrService.info).toHaveBeenCalled();
        expect(component.bookmarkedChallenges.length).toBe(0);
        expect(component.isLoading).toBe(false);
    }));

  });

  describe('loadChallengesByBookmarkId', () => {
    it('should show error if getChallengeById fails for a challenge', fakeAsync(() => {
        const bookmarkIds = ['1', '2'];
        challengeService.getChallengeById.mockImplementation(id => {
            if (id === '1') {
                return throwError(() => new Error('Failed to load'));
            }
            return of(new Challenge({ ...mockChallenge, id_challenge: id }));
        });

        (component as any).loadChallengesByBookmarkId(bookmarkIds);
        tick();

        expect(toastrService.error).toHaveBeenCalled();
        expect(component.bookmarkedChallenges.length).toBe(1);
        expect(component.bookmarkedChallenges[0].id_challenge).toBe('2');
        expect(component.isLoading).toBe(false);
    }));

    it('should show info message if no valid bookmarks are found', fakeAsync(() => {
        const bookmarkIds = ['1'];
        challengeService.getChallengeById.mockReturnValue(throwError(() => new Error('Failed')));

        (component as any).loadChallengesByBookmarkId(bookmarkIds);
        tick();
        
        expect(toastrService.info).toHaveBeenCalled();
        expect(component.bookmarkedChallenges.length).toBe(0);
    }));

    it('should handle forkJoin error', fakeAsync(() => {
        const bookmarkIds = ['1'];
        challengeService.getChallengeById.mockReturnValue(throwError(() => new Error('Global fail')));
        
        (component as any).loadChallengesByBookmarkId(bookmarkIds);
        tick();
        
        expect(toastrService.error).toHaveBeenCalled();
        expect(component.isLoading).toBe(false);
    }));
  });

  describe('getValidUniqueChallenges', () => {
    it('should remove null and duplicate challenges', () => {
        const challenge1 = new Challenge({ ...mockChallenge, id_challenge: '1' });
        const challenge2 = new Challenge({ ...mockChallenge, id_challenge: '2' });
        const results = [challenge1, null, challenge2, challenge1];
        
        const validChallenges = (component as any).getValidUniqueChallenges(results);
        
        expect(validChallenges.length).toBe(2);
        expect(validChallenges.map((c: Challenge) => c.id_challenge)).toEqual(['1', '2']);
    });
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});

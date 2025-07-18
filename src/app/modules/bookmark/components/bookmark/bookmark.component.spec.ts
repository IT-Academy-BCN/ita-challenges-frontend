import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookmarkComponent } from './bookmark.component';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';
import { Challenge } from 'src/app/models/challenge.model';

describe('BookmarkComponent (Jest)', () => {
  let component: BookmarkComponent;
  let fixture: ComponentFixture<BookmarkComponent>;

  let authServiceMock: Partial<AuthService>;
  let challengeServiceMock: Partial<ChallengeService>;

  const mockChallengeData = {
    id_challenge: '123',
    title: 'Test Challenge',
    description: 'Some description',
    languages: [], 
  };

  const mockChallenge = new Challenge(mockChallengeData);

  beforeEach(async () => {
    authServiceMock = {
      getUserId: jest.fn()
    };

    challengeServiceMock = {
      getUserBookmarks: jest.fn(),
      getChallengeById: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [BookmarkComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ChallengeService, useValue: challengeServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load bookmarks and challenges successfully', () => {
    (authServiceMock.getUserId as jest.Mock).mockReturnValue(of('user123'));
    (challengeServiceMock.getUserBookmarks as jest.Mock).mockReturnValue(of(['123']));
    (challengeServiceMock.getChallengeById as jest.Mock).mockReturnValue(of(mockChallenge));

    fixture.detectChanges();

    expect(authServiceMock.getUserId).toHaveBeenCalled();
    expect(challengeServiceMock.getUserBookmarks).toHaveBeenCalledWith('user123');
    expect(challengeServiceMock.getChallengeById).toHaveBeenCalledWith('123');

    expect(component.bookmarkedChallenges.length).toBe(1);
    expect(component.bookmarkedChallenges[0].id_challenge).toBe('123');
  });

  it('should handle null userId by not loading bookmarks', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (authServiceMock.getUserId as jest.Mock).mockReturnValue(of(null));

    fixture.detectChanges();

    expect(warnSpy).toHaveBeenCalledWith('No user ID found');
    expect(challengeServiceMock.getUserBookmarks).not.toHaveBeenCalled();
  });

  it('should handle error when getUserId fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (authServiceMock.getUserId as jest.Mock).mockReturnValue(throwError(() => new Error('User ID error')));

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith('Error getting user ID', expect.any(Error));
  });

  it('should handle error when getUserBookmarks fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (authServiceMock.getUserId as jest.Mock).mockReturnValue(of('user123'));
    (challengeServiceMock.getUserBookmarks as jest.Mock).mockReturnValue(throwError(() => new Error('Bookmarks error')));

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith('Error loading bookmarks', expect.any(Error));
  });

  it('should handle error when getChallengeById fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (authServiceMock.getUserId as jest.Mock).mockReturnValue(of('user123'));
    (challengeServiceMock.getUserBookmarks as jest.Mock).mockReturnValue(of(['123', '456']));
    (challengeServiceMock.getChallengeById as jest.Mock).mockImplementation(id => {
      if (id === '123') return of(mockChallenge);
      return throwError(() => new Error('Challenge load error'));
    });

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith('Error loading challenge with ID 456', expect.any(Error));
    expect(component.bookmarkedChallenges.length).toBe(1);
    expect(component.bookmarkedChallenges[0].id_challenge).toBe('123');
  });
});

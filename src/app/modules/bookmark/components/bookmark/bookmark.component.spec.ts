import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookmarkComponent } from './bookmark.component';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';


describe('BookmarkComponent (Jest)', () => {
  let component: BookmarkComponent;
  let fixture: ComponentFixture<BookmarkComponent>;

  let authServiceMock: Partial<AuthService>;
  let challengeServiceMock: Partial<ChallengeService>;

  const mockChallengeRaw = {
    id_challenge: '123',
    challenge_title: 'Test Challenge',
    level: 'Easy',
    creation_date: new Date(),
    popularity: 10,
    favorites_count: 5,
    saved_count: 3,
    timesFavorite: 2,
    timesSolved: 1,
    bookmarked: true,
    detail: {
      id_detail: 'd1',
      challenge_description: 'Description',
      input_format: 'input',
      output_format: 'output',
      constraints: 'constraints',
      example: 'example'
    },
    languages: [],
    solutions: []
  };

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
    (challengeServiceMock.getChallengeById as jest.Mock).mockReturnValue(of(mockChallengeRaw));

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

    expect(warnSpy).toHaveBeenCalledWith('User ID is null or undefined.');
    expect(challengeServiceMock.getUserBookmarks).not.toHaveBeenCalled();
  });

  it('should handle error when getUserId fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (authServiceMock.getUserId as jest.Mock).mockReturnValue(throwError(() => new Error('User ID error')));

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith('Failed to retrieve user ID', expect.any(Error));
  });

  it('should handle error when getUserBookmarks fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (authServiceMock.getUserId as jest.Mock).mockReturnValue(of('user123'));
    (challengeServiceMock.getUserBookmarks as jest.Mock).mockReturnValue(throwError(() => new Error('Bookmarks error')));

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith('Failed to retrieve user bookmarks', expect.any(Error));
  });

  it('should handle error when getChallengeById fails for one of multiple challenges', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (authServiceMock.getUserId as jest.Mock).mockReturnValue(of('user123'));
    (challengeServiceMock.getUserBookmarks as jest.Mock).mockReturnValue(of(['123', '456']));
    (challengeServiceMock.getChallengeById as jest.Mock).mockImplementation((id) => {
      if (id === '123') return of(mockChallengeRaw);
      return throwError(() => new Error('Challenge load error'));
    });

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith('Failed to load challenge with ID 456', expect.any(Error));
    expect(component.bookmarkedChallenges.length).toBe(1);
    expect(component.bookmarkedChallenges[0].id_challenge).toBe('123');
  });
});

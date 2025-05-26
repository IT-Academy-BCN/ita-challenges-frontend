import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeHeaderComponent } from './challenge-header.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum';
import { EventEmitter } from '@angular/core';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services/auth.service';

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;
  let modalService: NgbModal;
  let router: Router;
  let challengeService: jest.Mocked<ChallengeService>;
  let authService: jest.Mocked<AuthService>;


  beforeEach(async () => {
    const mockRouter = { navigate: jest.fn() } as any;
    challengeService = {
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      addBookmark: jest.fn(),
      removeBookmark: jest.fn(),
    } as any;
    authService = {
      isUserLoggedIn: jest.fn().mockReturnValue(true),
      getUserId: jest.fn().mockReturnValue(of('user1')),
      getUserRole: jest.fn().mockReturnValue(of('ROLE_USER')),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ChallengeHeaderComponent],
      imports: [I18nModule, DynamicTranslatePipe],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { 
          provide: ActivatedRoute, 
          useValue: { params: of({ idChallenge: 'testChallengeId' }) }
        },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        { provide: ChallengeService, useValue: challengeService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges(); 
    expect(component).toBeTruthy();
  });

  it('should initialize input correctly', () => {
    component.title = 'Test Title';
    component.creation_date = new Date();
    component.level = 'Easy';
    component.activeId = ChallengeTab.DETAILS;

    expect(component.title).toEqual('Test Title');
    expect(component.creation_date).toBeDefined();
    expect(component.level).toEqual('Easy');
    expect(component.activeId).toEqual(ChallengeTab.DETAILS);
  });

  it('should open send solution modal', () => {

    const timesSolvedSubject = new Subject<number>();
    const mockModalRef = {
       componentInstance: {
        idChallenge: '',
        userId: '',
        solutionAccepted: new EventEmitter<void>(),
        timesSolvedUpdated: timesSolvedSubject
     } 
    };
    jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef as any);
    component.idChallenge = 'testChallengeId';
    component.openSendSolutionModal();

    expect(mockModalRef.componentInstance.idChallenge).toBe('testChallengeId');

    timesSolvedSubject.next(5)
    expect(component.timesSolved).toBe(5)
  });

  it('should start challenge and navigate', async () => {
    component.idChallenge = '123';
    await component.onStartChallenge();

    expect(component.challengeStarted).toBe(true);
    expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
    expect(localStorage.getItem('challengeStarted')).toContain('123');
    expect(router.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges/123/start']);
  });
  it('toggleFavorite: when not favorite should call addToFavorites and emit update', done => {
    component.idChallenge = 'ABC';
    component.favorites_count = 1;
    component.isFavorite = false;
    challengeService.addToFavorites.mockReturnValue(of({ favorite: true, timesFavorited: 2 }));
    component.favoritesUpdated.subscribe(count => {
      expect(count).toBe(2);
      expect(component.isFavorite).toBe(true);
      expect(component.favorites_count).toBe(2);
      done();
    });
    component.toggleFavorite();
  });

  it('toggleFavorite: when favorite should call removeFromFavorites', done => {
    component.idChallenge = 'ABC';
    component.favorites_count = 2;
    component.isFavorite = true;
    challengeService.removeFromFavorites.mockReturnValue(of({ favorite: false, timesFavorited: 1 }));
    component.favoritesUpdated.subscribe(count => {
      expect(count).toBe(1);
      expect(component.isFavorite).toBe(false);
      expect(component.favorites_count).toBe(1);
      done();
    });
    component.toggleFavorite();
  });

  it('toggleBookmark: add bookmark when not bookmarked', done => {
    component.idChallenge = 'B1';
    component.isBookmarked = false;
    challengeService.addBookmark.mockReturnValue(of({ bookmarked: true, timesBookmarked: 1 }));
    component.toggleBookmark(new MouseEvent('click'));
    setTimeout(() => {
      expect(component.isBookmarked).toBe(true);
      done();
    });
  });

  it('toggleBookmark: remove bookmark when bookmarked', done => {
    component.idChallenge = 'B1';
    component.isBookmarked = true;
    challengeService.removeBookmark.mockReturnValue(of({ bookmarked: false, timesBookmarked: 0 }));
    component.toggleBookmark(new MouseEvent('click'));
    setTimeout(() => {
      expect(component.isBookmarked).toBe(false);
      done();
    });
  });
})

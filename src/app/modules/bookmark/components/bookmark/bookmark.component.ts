import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, forkJoin, map, of, catchError, filter, switchMap, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core'; 
import { ToastrService } from 'ngx-toastr';

import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services/auth.service';
import { Challenge } from 'src/app/models/challenge.model';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']  
})
export class BookmarkComponent implements OnInit, OnDestroy {
  private readonly challengeService = inject(ChallengeService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService); 
  private readonly destroy$ = new Subject<void>();

  isLoading = false; 
  bookmarkedChallenges: Challenge[] = [];

  ngOnInit(): void {
    this.loadBookmarkedChallenges();
  }

  private loadBookmarkedChallenges(): void {
    this.isLoading = true;
    
    this.authService.getUserId().pipe(
      takeUntil(this.destroy$),
      tap(userId => {
        if (!userId) {
          this.isLoading = false;
          this.showError('messages.errors.userNotAuthenticated');
          console.warn('User ID is null or undefined.');
        }
      }),
      filter((userId): userId is string => !!userId),
      switchMap(userId =>
        this.challengeService.getUserBookmarks(userId).pipe(
          catchError(err => {
            this.showError('messages.errors.failedToLoadBookmarks');
            console.error("Failed to retrieve user bookmarks", err);
            return of([]);
          })
        )
      )
    ).subscribe({
      next: bookmarks => {
        this.isLoading = false;
        this.loadChallengesByBookmarkId(bookmarks);
      },
      error: err => {
        this.isLoading = false;
        this.showError('messages.errors.failedToLoadUser');
        console.error("Failed to retrieve user ID", err);
      }
    });
  }

  private loadChallengesByBookmarkId(bookmarkIds: string[]): void {
    if (bookmarkIds.length === 0) {
      this.showInfo('modules.challenge.bookmarksView.noBookmarksSaved');
      return;
    }

    this.isLoading = true;
    const uniqueIds = [...new Set(bookmarkIds)];

    const challengeRequests = uniqueIds.map(id =>
      this.challengeService.getChallengeById(id).pipe(
        map(challenge => new Challenge(challenge)),
        catchError(err => {
          this.showError('messages.errors.failedToLoadChallenge', { id });
          console.error(`Failed to load challenge with ID ${id}`, err);
          return of(null);
        })
      )
    );

    forkJoin(challengeRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: (Challenge | null)[]) => {
          this.isLoading = false;
          this.bookmarkedChallenges = this.getValidUniqueChallenges(results);
          
          if (this.bookmarkedChallenges.length === 0) {
            this.showInfo('messages.info.noValidBookmarks');
          }
        },
        error: () => {
          this.isLoading = false;
          this.showError('messages.errors.failedToLoadChallenges');
        }
      });
  }

   private getValidUniqueChallenges(results: (Challenge | null)[]): Challenge[] {
    const validChallenges = this.removeInvalidChallenges(results);
    return this.removeDuplicateChallenges(validChallenges);
  }

  private removeInvalidChallenges(results: (Challenge | null)[]): Challenge[] {
    return results.filter((challenge): challenge is Challenge => !!challenge);
  }

  private removeDuplicateChallenges(challenges: Challenge[]): Challenge[] {
    return challenges.filter(
      (challenge, index, self) =>
        index === self.findIndex(c => c.id_challenge === challenge.id_challenge)
    );
  }

  private showError(messageKey: string, interpolateParams?: any): void {
    this.translate.get(messageKey, interpolateParams).subscribe(message => {
      this.toastr.error(message, this.translate.instant('common.close'), {
        timeOut: 5000,
        progressBar: true
      });
    });
  }

  
  private showInfo(messageKey: string, interpolateParams?: any): void {
    this.translate.get(messageKey, interpolateParams).subscribe(message => {
      this.toastr.info(message, this.translate.instant('common.close'), {
        timeOut: 3000,
        progressBar: true
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

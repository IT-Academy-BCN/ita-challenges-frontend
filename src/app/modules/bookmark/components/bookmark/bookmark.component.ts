import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, forkJoin, map, of, catchError } from 'rxjs';

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
  private readonly destroy$ = new Subject<void>();

  bookmarkedChallenges: Challenge[] = [];

  ngOnInit(): void {
    this.loadBookmarkedChallenges();
  }

  private loadBookmarkedChallenges(): void {
    this.authService.getUserId()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: userId => {
          if (!userId) {
            console.warn('User ID is null or undefined.');
            return;
          }
          this.fetchBookmarks(userId);
        },
        error: err => console.error('Failed to retrieve user ID', err)
      });
  }

  private fetchBookmarks(userId: string): void {
    this.challengeService.getUserBookmarks(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: bookmarks => this.loadChallenges(bookmarks),
        error: err => console.error('Failed to retrieve user bookmarks', err)
      });
  }

  private loadChallenges(bookmarkIds: string[]): void {
    const uniqueIds = [...new Set(bookmarkIds)];

    const challengeRequests = uniqueIds.map(id =>
      this.challengeService.getChallengeById(id).pipe(
        map(challenge => new Challenge(challenge)),
        catchError(err => {
          console.error(`Failed to load challenge with ID ${id}`, err);
          return of(null); 
        })
      )
    );

    forkJoin(challengeRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe((results: (Challenge | null)[]) => {
        this.bookmarkedChallenges = results
          .filter((challenge): challenge is Challenge => !!challenge)
          .filter((challenge, index, self) =>
            self.findIndex(c => c.id_challenge === challenge.id_challenge) === index
          );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

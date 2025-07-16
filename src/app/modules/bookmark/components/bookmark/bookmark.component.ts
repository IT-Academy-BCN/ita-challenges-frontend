import { Component, inject, type OnInit, type OnDestroy } from '@angular/core';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Challenge } from 'src/app/models/challenge.model';


@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css'
})
export class BookmarkComponent implements OnInit, OnDestroy {
private readonly challengeSErvice = inject(ChallengeService)
private readonly authService = inject(AuthService)
private readonly destroy$ = new Subject<void>()

bookmarkedChallenges: Challenge[] = []

ngOnInit(): void {
  this.authService.getUserId()
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (userId)=>{
       if(!userId) {
    console.error("No user Id Found");
    return;
  }
    this.challengeSErvice.getUserBookmarks(userId)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (bookmarks: string[])=>{
      // this.bookmarkedChallenges = bookmarks
       console.log('Bookmarked Challenges IDs:', bookmarks)

        bookmarks.forEach(id => {
                this.challengeSErvice.getChallengeById(id)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe({
                    next: (challengeData) => {
                      this.bookmarkedChallenges.push(new Challenge(challengeData));
    },
    error: err => {
                      console.error(`Error loading challenge with ID ${id}`, err);
                    }
                  });
              });
            },
    error: (error)=>{
      console.error("error loading Bookmarks", error)
    }
  })
    },
    error: (error)=>{
      console.error('error getting user Id', error)
    }
  })
 


}
ngOnDestroy(): void {
  this.destroy$.next()
  this.destroy$.complete()
}
}

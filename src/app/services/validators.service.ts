import { Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  private readonly translate = inject(TranslateService)

  // email
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
}

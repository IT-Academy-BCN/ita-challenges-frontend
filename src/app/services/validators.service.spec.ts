import { TestBed } from '@angular/core/testing'

import { ValidatorsService } from './validators.service'
import { TranslateModule } from '@ngx-translate/core'

describe('ValidatorsService', () => {
  let service: ValidatorsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    }).compileComponents()
    service = TestBed.inject(ValidatorsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

import { TestBed } from '@angular/core/testing'

import { RelatedService } from './related.service'

describe('RelatedService', () => {
  let service: RelatedService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RelatedService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { PaginationComponent } from './pagination.component'
import exp from 'constants'

describe('PaginationComponent', () => {
  let component: PaginationComponent
  let fixture: ComponentFixture<PaginationComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    })
    fixture = TestBed.createComponent(PaginationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should increment page number', () => {
    const changePageSpy = jest.spyOn(component, 'changePage')
    component.pageNumber = 1
    component.totalPages = 3
    let currentPage = component.pageNumber
    component.next()
    expect(component.pageNumber).toEqual(currentPage+1)
    expect(changePageSpy).toHaveBeenCalled()
  })

  it('should decrease page number', () => {
    const changePageSpy = jest.spyOn(component, 'changePage')
    component.pageNumber = 2
    component.totalPages = 3
    let currentPage = component.pageNumber
    component.prev()
    expect(component.pageNumber).toEqual(currentPage-1)
    expect(changePageSpy).toHaveBeenCalled()
  })

  it('should emit page number', () => {
    const pageEmitterSpy = jest.spyOn(component.pageEmitter, 'emit')
    component.pageNumber = 2
    component.changePage()
    expect(pageEmitterSpy).toHaveBeenCalled()
  })

  it('should set and emit a certain page number', () => {
    const pageEmitterSpy = jest.spyOn(component.pageEmitter, 'emit')
    component.pageNumber = 1
    component.setPageOffset(3)
    expect(pageEmitterSpy).toHaveBeenCalledWith(3)
    expect(component.pageNumber).toBe(3)
  })
})

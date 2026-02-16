import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { SortSelectComponent } from './sort-select.component'
import { TranslateModule } from '@ngx-translate/core'
import { By } from '@angular/platform-browser'

describe('SortSelectComponent', () => {
  let component: SortSelectComponent
  let fixture: ComponentFixture<SortSelectComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortSelectComponent],
      imports: [TranslateModule.forRoot()]
    })
    fixture = TestBed.createComponent(SortSelectComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit sortSelected event when a sort option is clicked', () => {
    spyOn(component.sortSelected, 'emit')
    const sortValue = 'popularity'
    component.selectSort(sortValue)
    expect(component.sortSelected.emit).toHaveBeenCalledWith(sortValue)
  })

  it('should not emit sortSelected if value is the same as current sortBy', () => {
    spyOn(component.sortSelected, 'emit')
    component.sortBy = 'popularity'
    component.selectSort('popularity')
    expect(component.sortSelected.emit).not.toHaveBeenCalled()
  })

  it('should emit orderSelected event when order is toggled', () => {
    spyOn(component.orderSelected, 'emit')
    component.isAscending = false
    component.selectOrder(true)
    expect(component.orderSelected.emit).toHaveBeenCalledWith(true)
  })

  it('should not emit orderSelected if value is the same as current isAscending', () => {
    spyOn(component.orderSelected, 'emit')
    component.isAscending = true
    component.selectOrder(true)
    expect(component.orderSelected.emit).not.toHaveBeenCalled()
  })

  it('should set active class on the selected sort option', () => {
    component.sortBy = 'popularity'
    fixture.detectChanges()
    const activeBtn = fixture.debugElement.query(By.css('.dropdown-item.active'))
    expect(activeBtn).toBeTruthy()
  })

  it('should display visible tick for the current order', () => {
    component.isAscending = true
    fixture.detectChanges()
    const items = fixture.debugElement.queryAll(By.css('.dropdown-item'))
    const ascendingBtn = items[4]
    const tick = ascendingBtn.query(By.css('.tick-icon'))

    expect(tick.styles['visibility']).toBe('visible')
  })
})

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChallengeListFiltersComponent } from "./challenge-list-filters.component";
import { FilterChallenge } from "src/app/models/filter-challenge.model";
import { SolutionStatus } from "src/app/models/user-solution-status.enum";

describe("ChallengeListFiltersComponent", () => {
  let component: ChallengeListFiltersComponent;
  let fixture: ComponentFixture<ChallengeListFiltersComponent>;
  let AllFiltersAppliedSpy: jasmine.Spy;
  let SortSelectedSpy: jasmine.Spy;
  let OrderSelectedSpy: jasmine.Spy;
  let initialFilters: FilterChallenge = {
    languages: [],
    levels: [],
    progress: [],
    tags: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengeListFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render the filters container", () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector("#challenge-list-filters")).toBeTruthy();
  });
  it("should have initial filters set correctly", () => {
    component.initialFilters = {
      languages: ["1234"],
      levels: [],
      progress: [],
      tags: [],
    };
    expect(component.initialFilters).toEqual({
      languages: ["1234"],
      levels: [],
      progress: [],
      tags: [],
    });
  });

  it("should emit allFiltersApplied with correct filters when onModalFiltersApplied is called", () => {
    AllFiltersAppliedSpy = spyOn(component.allFiltersApplied, "emit");
    const modalFilters = {
      levels: ["Beginner"],
      tags: ["Tag1"],
      progress: [SolutionStatus.IN_PROGRESS],
    };
    component.onModalFiltersApplied(modalFilters);
    expect(AllFiltersAppliedSpy).toHaveBeenCalledWith({
      ...modalFilters,
      languages: component.languageFilters,
    });
  });
  it("should emit allFiltersApplied with correct filters when onLanguageFilterChange is called", () => {
    AllFiltersAppliedSpy = spyOn(component.allFiltersApplied, "emit");
    const languages = ["JavaScript", "Python"];
    component.onLanguageFilterChange(languages);
    expect(AllFiltersAppliedSpy).toHaveBeenCalledWith({
      ...initialFilters,
      languages: component.languageFilters,
    });
  });
  it("should emit orderSelected with correct boolean value when changeOrder is called", () => {
    OrderSelectedSpy = spyOn(component.orderSelected, "emit");
    const isAscending = true;
    component.changeOrder(isAscending);
    expect(OrderSelectedSpy).toHaveBeenCalledWith(isAscending);
  });
  it("should emit sortSelected with correct sort value when changeSort is called", () => {
    SortSelectedSpy = spyOn(component.sortSelected, "emit");
    const sortValue = "difficulty";
    component.changeSort(sortValue);
    expect(SortSelectedSpy).toHaveBeenCalledWith(sortValue);
  });
});

import { TestBed } from '@angular/core/testing'
import { Router, NavigationEnd, type ActivatedRouteSnapshot } from '@angular/router'
import { BreadcrumbService } from './breadcrumb.service'
import { Subject } from 'rxjs'

describe('BreadcrumbService', () => {
  let service: BreadcrumbService
  let routerMock: any
  let eventsSubject: Subject<any>

  beforeEach(() => {
    eventsSubject = new Subject<any>()
    routerMock = {
      events: eventsSubject.asObservable(),
      routerState: {
        // snapshot: {
        //   root: {} as ActivatedRouteSnapshot
        // } as RouterStateSnapshot
      }
    }

    TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        { provide: Router, useValue: routerMock }
      ]
    })

    service = TestBed.inject(BreadcrumbService)
  })

  afterEach(() => {
    service._breadcrumbs$.next([])
  })

  //     it('should emit breadcrumb when there is a NavigationEnd event (with 1 route segment)', (done) => {
  //         service.breadcrumbs$.subscribe((breadcrumbs) => {
  //             expect(breadcrumbs).toEqual([{
  //                 label: 'breadcrumb label',
  //                 url: '/test'
  //             }]);
  //             done();
  //         });

  // const fakeSnapshot: ActivatedRouteSnapshot = {
  //     url: [{ path: 'test' }],
  //     data: {
  //         breadcrumb: 'breadcrumb label'
  //     },
  //     queryParamMap: {
  //         has: () => false, // No query params
  //         get: () => null, // No query params
  //     },
  //     firstChild: null
  // } as any;

  //         routerMock.routerState.snapshot.root = fakeSnapshot;

  //         // Simulate NavigationEnd event
  //         eventsSubject.next(new NavigationEnd(1, '/test', '/test'));
  //     });

  //     it('should emit breadcrumb when there is a NavigationEnd event (with multiple route segments)', (done) => {
  //     service.breadcrumbs$.subscribe((breadcrumbs) => {
  //         expect(breadcrumbs).toEqual([
  //             { label: 'breadcrumb label 1', url: '/test1' },
  //             { label: 'breadcrumb label 2', url: '/test1/test2' },
  //             { label: 'breadcrumb label 3', url: '/test1/test2/test3' }
  //         ]);
  //         done();
  //     });

  //     const fakeSnapshotChild3: ActivatedRouteSnapshot = {
  //         url: [{ path: 'test3' }],
  //         data: {
  //             breadcrumb: 'breadcrumb label 3'
  //         },
  //         queryParamMap: {
  //         has: () => false, // No query params
  //         get: () => null, // No query params
  //         },
  //         firstChild: null
  //         } as any;

  //     const fakeSnapshotChild2: ActivatedRouteSnapshot = {
  //         url: [{ path: 'test2' }],
  //         data: {
  //             breadcrumb: 'breadcrumb label 2'
  //         },
  //         queryParamMap: {
  //         has: () => false, // No query params
  //         get: () => null, // No query params
  //         },
  //         firstChild: fakeSnapshotChild3
  //     } as any;

  //     const fakeSnapshot1: ActivatedRouteSnapshot = {
  //         url: [{ path: 'test1' }],
  //         data: {
  //             breadcrumb: 'breadcrumb label 1'
  //         },
  //         queryParamMap: {
  //         has: () => false, // No query params
  //         get: () => null, // No query params
  //         },
  //         firstChild: fakeSnapshotChild2
  //     } as any;

  //     routerMock.routerState.snapshot.root = fakeSnapshot1;

  //     // Simulate NavigationEnd event
  //     eventsSubject.next(new NavigationEnd(1, '/test1/test2/test3', '/test1/test2/test3'));
  //     });

  it('should emit breadcrumb when there is a NavigationEnd event (with multiple route segments + query params)', (done) => {
    service.breadcrumbs$.subscribe((breadcrumbs) => {
      expect(breadcrumbs).toEqual([
        { label: 'breadcrumb label 1', url: '/test1' },
        { label: 'breadcrumb label 2', url: '/test1/test2' },
        { label: 'breadcrumb label 3 > query', url: '/test1/test2/test3' }
      ])
      done()
    })

    const fakeSnapshotChild3: ActivatedRouteSnapshot = {
      url: [{ path: 'test3' }],
      data: {
        breadcrumb: 'breadcrumb label 3'
      },
      queryParamMap: {
        has (key: string) { return key === 'tab' }, // The 'tab' query param exists
        get (key: string) { return key === 'tab' ? 'query' : null } // Return 'query' for 'tab' query param, null for others
      },
      firstChild: null
    } as any

    const fakeSnapshotChild2: ActivatedRouteSnapshot = {
      url: [{ path: 'test2' }],
      data: {
        breadcrumb: 'breadcrumb label 2'
      },
      queryParamMap: {
        has: () => false, // No query params
        get: () => null // No query params
      },
      firstChild: fakeSnapshotChild3
    } as any

    const fakeSnapshot1: ActivatedRouteSnapshot = {
      url: [{ path: 'test1' }],
      data: {
        breadcrumb: 'breadcrumb label 1'
      },
      queryParamMap: {
        has: () => true,
        get: () => null
      },
      firstChild: fakeSnapshotChild2
    } as any

    routerMock.routerState.snapshot.root = fakeSnapshot1

    // Simulate NavigationEnd event
    eventsSubject.next(new NavigationEnd(1, '/test1/test2/test3?tab=query', '/test1/test2/test3?tab=query'))
  })
})

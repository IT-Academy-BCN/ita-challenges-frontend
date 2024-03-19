import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomLoader } from './custom-loader'
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('CustomLoader', () => {
    // let httpClientMock: HttpTestingController;
    let component: CustomLoader;
    let fixture: ComponentFixture<CustomLoader>;

    beforeEach(() => {
        TestBed.configureTestingModule({ // set up the testing module with required dependencies.
            imports: [HttpClientTestingModule]
        });
        fixture = TestBed.createComponent(CustomLoader);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create login component correctly', (done) => {
        expect(component).toBeTruthy();
        done();
    });
    
})
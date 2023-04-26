import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "./environment";

describe('environtments endpoints', () => {
    let injector: TestBed;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
       
      });
      injector = getTestBed();
      httpMock = injector.get(HttpTestingController);
    });

    it('should connect endpoints to server', () => {

        [

        ].forEach(element => {
            
            
        });        
    });

    it('should connect endpoints through proxy', () => {

      [

      ].forEach(element => {
          
          
      });        
  });


});
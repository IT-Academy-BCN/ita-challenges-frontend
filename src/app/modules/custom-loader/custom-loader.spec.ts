import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomLoader } from './custom-loader'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('CustomLoader', () => {
    let httpClientMock: HttpTestingController;
    let httpClient: HttpClient
    let customLoader: CustomLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CustomLoader]
        });
        httpClient = TestBed.inject(HttpClient);
        httpClientMock = TestBed.inject(HttpTestingController);
        customLoader = TestBed.inject(CustomLoader);
    });

    it('should create custom-loader correctly', (done) => {
        expect(customLoader).toBeTruthy();
        done();
    });

    it('should return translation file with challenges', (done) => {
        let mockLang: string = 'es'
        let expectedResponse = {
            "challenges": [
                {
                    "challenge_title": "Titulo en español",
                    "examples": {
                        "example_id": "Ejemplo en español",
                    },
                    "description": "Descripción en español",
                    "notes": "Notas en español"
                }
            ]
        };

        let mockResponse = [
            {
                "challenge_title": {
                    "ES": "Titulo en español",
                    "CAT": "Titulo en cat",
                    "EN": "Title in english",
                },
                "detail": {
                    "examples": [
                        {
                            "_id": {
                                "$uuid": "example_id"
                            },
                            "example_text": {
                                "ES": "Ejemplo en español",
                                "CAT": "Ejemplo en catalan",
                                "EN": "Example in english"
                            }
                        }
                    ],
                    "description": {
                        "ES": "Descripción en español",
                        "CAT": "Descrip en cat",
                        "EN": "Desc en english"
                    },
                    "notes": {
                        "ES": "Notas en español",
                        "CAT": "Notas en cat",
                        "EN": "Notes in english"
                    }
                }
            }
        ];

        let fileWithTranslation: any;

        customLoader.getTranslation(mockLang)
            .subscribe({
                next: (res) => {
                    expect(res).toBeTruthy();
                    fileWithTranslation = res;
                }
            });

        const req = httpClientMock.expectOne('../../../assets/dummy/challenge-out.json');
        expect(req.request.method).toEqual("GET");
        req.flush(mockResponse);

        expect(fileWithTranslation).toEqual({ ...expectedResponse, ...require(`../../../assets/i18n/${mockLang}.json`) })
        done();
    });

})
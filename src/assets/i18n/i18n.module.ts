import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

export function httpLoaderFactory (http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http,
    'assets/i18n/',
    '.json')
}

@NgModule({
  declarations: [],
  exports: [TranslateModule],
  imports: [CommonModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ca',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class I18nModule { }

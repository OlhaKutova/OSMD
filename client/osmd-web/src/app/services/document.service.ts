import { Inject, Injectable } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { apiUrl } from '../config';
import { MessageService } from 'app/services';
import { Document } from 'app/shared';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthHttp } from 'angular2-jwt';


@Injectable()
export class DocumentService {
  apiDocumentUrl: string;
  apiDocumentAdminUrl: string;

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private messageService: MessageService,
              @Inject(apiUrl) private apiUrl: string) {
    this.apiDocumentUrl = `${this.apiUrl}/documents`;
    this.apiDocumentAdminUrl = `${this.apiUrl}/admin/documents`;
  }

  getDocument(id): Observable<Document> {
    return this.http.get(`${this.apiDocumentUrl}/${id}`)
      .map((res: Response) => res.json())
      .catch(err => this.errorHandler(err));
  }

  getDocumentsWithPagination(skip = 0, limit = 10): Observable<{ documents: Document[], count: number }> {
    const searchParams = new URLSearchParams();
    searchParams.set('skip', skip.toString());
    searchParams.set('limit', limit.toString());

    const options = new RequestOptions({
      search: searchParams
    });
    return this.authHttp.get(`${this.apiDocumentAdminUrl}`, options)
      .map((res: Response) => res.json())
      .catch(err => this.errorHandler(err));
  }

  errorHandler(err): Observable<any> {
    console.log(err);
    let errorMessage;
    if (err instanceof Response) {
      const body = err.json() || '';
      const error = body.message || JSON.stringify(body);
      if (err.status > 0) {
        errorMessage = `${err.status} - ${error}`;
      } else {
        errorMessage = 'Ошибка. Возможно сервер временно не работает.';
      }
    } else {
      errorMessage = err.message || err.toString();
    }
    this.messageService.error(errorMessage, true, 8000);
    return Observable.throw(errorMessage);
  }
}

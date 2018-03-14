import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../auth.service';

@Injectable()
export class FeedService {

  constructor(
    private auth: AuthService
  ) { }

  public getAllPrograms(page, resultCount): Observable<any> {
    let result = this.auth.get('api/programs/get-all', {page: page, resultCount: resultCount});
    return result;
  }

  public getAllRequests(page, resultCount): Observable<any> {
    let result = this.auth.get('api/program-requests/pending', {page: page, resultCount: resultCount});
    return result;
  }

  public getRequestDetails(requestId): Observable<any> {
    let result = this.auth.get('api/program-requests/'+requestId);
    return result;
  }
}

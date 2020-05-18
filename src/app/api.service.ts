import {
  mergeMap as _observableMergeMap,
  catchError as _observableCatch,
} from "rxjs/operators";
import * as moment from "moment";

import {
  Observable,
  throwError as _observableThrow,
  of as _observableOf,
} from "rxjs";
import { Injectable, Inject, Optional, InjectionToken } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpResponseBase,
  HttpParams
} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor() { }
}

export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");

@Injectable()
export class APIClient {
  private http: HttpClient;
  private baseUrl: string;
  protected jsonParseReviver:
    | ((key: string, value: any) => any)
    | undefined = undefined;

  constructor(
    @Inject(HttpClient) http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    this.http = http;
    this.baseUrl = baseUrl ? baseUrl : "https://aapz-backend.conveyor.cloud";
  }

  toJSON(filter: Filter) {


    if (filter === null) {
      return '';
    } else if (filter.startTime !== null && filter.finishTime !== null) {
      return '?StartTime=' + filter.startTime.toLocaleString() + '&FinishTime' + filter.finishTime.toLocaleString();
    } else if (filter.startTime !== null) {
      return '?StartTime=' + filter.startTime.toLocaleString()
    } else {
      return '?FinishTime=' + filter.finishTime.toLocaleString()
    }
  }

  /**
    * @return Success
    */
  getFilteredWorkplaceOrdersListByClient(filter: Filter, pageNumber: number): Observable<FilteredPagedResult> {
    let url_ = this.baseUrl + "/api/WorkplaceOrder/GetFilteredWorkplaceOrdersListByClient/{pageNumber}";
    if (pageNumber === undefined || pageNumber === null)
      throw new Error("The parameter 'pageNumber' must be defined.");

    url_ = url_.replace("{pageNumber}", encodeURIComponent("" + pageNumber));
    let params = new HttpParams();
    if (filter != null && filter.startTime !== null) {
      params = params.set('StartTime', moment(filter.startTime).format("YYYY-MM-DD"));
      console.log(params);
    }
    if (filter != null && filter.finishTime !== null && filter.finishTime !== undefined)
      params = params.append('FinishTime', moment(filter.finishTime).format("YYYY-MM-DD"));

    if (filter != null && filter.like !== null && filter.like !== undefined)
      params = params.append('Like', filter.like);

    console.log(params);
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");

    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
      params: params
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetFilteredWorkplaceOrdersListByClient(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetFilteredWorkplaceOrdersListByClient(<any>response_);
            } catch (e) {
              return <Observable<FilteredPagedResult>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<FilteredPagedResult>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetFilteredWorkplaceOrdersListByClient(
    response: HttpResponseBase
  ): Observable<FilteredPagedResult> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? FilteredPagedResult.fromJS(resultData200)
            : new FilteredPagedResult();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<FilteredPagedResult>(<any>null);
  }




  /**
   * @return Success
   */
  getWorkplaceOrdersByWorkplaceAndDate(workplaceId: number, date: Date): Observable<WorkplaceOrder[]> {
    let url_ = this.baseUrl + "/api/WorkplaceOrder/GetWorkplaceOrdersByWorkplaceAndDate/{workplaceId}/{date}";
    if (workplaceId === undefined || workplaceId === null)
      throw new Error("The parameter 'workplaceId' must be defined.");
    if (date === undefined || date === null)
      throw new Error("The parameter 'date' must be defined.");
    url_ = url_.replace("{workplaceId}", encodeURIComponent("" + workplaceId));
    url_ = url_.replace("{date}", encodeURIComponent("" + date));
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");

    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceOrdersByWorkplaceAndDate(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceOrdersByWorkplaceAndDate(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceOrder[]>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<WorkplaceOrder[]>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetWorkplaceOrdersByWorkplaceAndDate(
    response: HttpResponseBase
  ): Observable<WorkplaceOrder[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (let item of resultData200)
              result200.push(WorkplaceOrder.fromJS(item));
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceOrder[]>(<any>null);
  }




  /**
   * @return Success
   */
  getLastMonitorings(): Observable<Monitoring[]> {
    let url_ = this.baseUrl + "/api/Monitoring/GetLastMonitorings";
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");

    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetMonitorings(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetMonitorings(<any>response_);
            } catch (e) {
              return <Observable<Monitoring[]>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<Monitoring[]>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetMonitorings(
    response: HttpResponseBase
  ): Observable<Monitoring[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (let item of resultData200)
              result200.push(Monitoring.fromJS(item));
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Monitoring[]>(<any>null);
  }


  /**
   * @return Success
   */
  getMonitoringList(): Observable<Monitoring[]> {
    let url_ = this.baseUrl + "/api/Monitoring/GetMonitoringList";
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");

    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetMonitoringList(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetMonitoringList(<any>response_);
            } catch (e) {
              return <Observable<Monitoring[]>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<Monitoring[]>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetMonitoringList(
    response: HttpResponseBase
  ): Observable<Monitoring[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (let item of resultData200)
              result200.push(Monitoring.fromJS(item));
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Monitoring[]>(<any>null);
  }


  /**
   * @return Success
   */
  getMonitoringByDate(date: Date): Observable<Monitoring> {
    let url_ = this.baseUrl + "/api/Monitoring/GetMonitoringByDate/{date}";
    if (date === undefined || date === null)
      throw new Error("The parameter 'date' must be defined.");
    url_ = url_.replace("{date}", encodeURIComponent("" + date));
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");

    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetMonitoringByDate(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetMonitoringByDate(<any>response_);
            } catch (e) {
              return <Observable<Monitoring>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<Monitoring>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetMonitoringByDate(
      response: HttpResponseBase
    ): Observable<Monitoring> {
      const status = response.status;
      const responseBlob =
        response instanceof HttpResponse
          ? response.body
          : (<any>response).error instanceof Blob
            ? (<any>response).error
            : undefined;

      let _headers: any = {};
      if (response.headers) {
        for (let key of response.headers.keys()) {
          _headers[key] = response.headers.get(key);
        }
      }
      if (status === 200) {
        return blobToText(responseBlob).pipe(
          _observableMergeMap((_responseText) => {
            let result200: any = null;
            const resultData200 =
              _responseText === ""
                ? null
                : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200
              ? Monitoring.fromJS(resultData200)
              : new Monitoring();
            return _observableOf(result200);
          })
        );
      } else if (status !== 200 && status !== 204) {
        return blobToText(responseBlob).pipe(
          _observableMergeMap((_responseText) => {
            return throwException(
              "An unexpected server error occurred.",
              status,
              _responseText,
              _headers
            );
          })
        );
      }
      return _observableOf<Monitoring>(<any>null);
    }

  /**
   * @return Success
   */
  getSchedule(clientId: number): Observable<Scheduler[]> {
    let url_ = this.baseUrl + "/api/Scheduler/GetSchedule/{clientId}";
    if (clientId === undefined || clientId === null)
      throw new Error("The parameter 'clientId' must be defined.");
    url_ = url_.replace("{clientId}", encodeURIComponent("" + clientId));
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");

    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetSchedule(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetSchedule(<any>response_);
            } catch (e) {
              return <Observable<Scheduler[]>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<Scheduler[]>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetSchedule(
    response: HttpResponseBase
  ): Observable<Scheduler[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (let item of resultData200)
              result200.push(Scheduler.fromJS(item));
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Scheduler[]>(<any>null);
  }

  /**
   * @return Success
   */
  getSearchSetting(): Observable<SearchSetting> {
    let url_ = this.baseUrl + "/api/SearchSetting/GetSearchSetting";

    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetSearchSetting(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetSearchSetting(<any>response_);
            } catch (e) {
              return <Observable<SearchSetting>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<SearchSetting>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetSearchSetting(
    response: HttpResponseBase
  ): Observable<SearchSetting> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? SearchSetting.fromJS(resultData200)
            : new SearchSetting();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<SearchSetting>(<any>null);
  }

  /**
   * @param model (optional)
   * @return Success
   */
  post(model: RegistrationViewModel | null | undefined): Observable<void> {
    let url_ = this.baseUrl + "/api/Account";
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");
    const content_ = JSON.stringify(model);

    let options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processPost(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processPost(<any>response_);
            } catch (e) {
              return <Observable<void>>(<any>_observableThrow(e));
            }
            // tslint:disable-next-line:curly
          } else return <Observable<void>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processPost(response: HttpResponseBase): Observable<void> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return _observableOf<void>(<any>null);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<void>(<any>null);
  }

  /**
   * @param credentials (optional)
   * @return Success
   */
  post2(
    credentials: CredentialsViewModel | null | undefined
  ): Observable<void> {
    let url_ = this.baseUrl + "/api/Auth/login";
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");
    const content_ = JSON.stringify(credentials);

    let options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processPost2(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processPost2(<any>response_);
            } catch (e) {
              return <Observable<void>>(<any>_observableThrow(e));
            }
          } else return <Observable<void>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processPost2(response: HttpResponseBase): Observable<void> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return _observableOf<void>(<any>null);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<void>(<any>null);
  }



  /**
   * @return Success
   */
  getBuildingsByLandlord(): Observable<Building[]> {
    let url_ = this.baseUrl + "/api/Building/GetBuildingsByLandlord";
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");
    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetBuildingsByLandlord(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetBuildingsByLandlord(<any>response_);
            } catch (e) {
              return <Observable<Building[]>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<Building[]>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetBuildingsByLandlord(
    response: HttpResponseBase
  ): Observable<Building[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (let item of resultData200) {
              result200.push(Building.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Building[]>(<any>null);
  }

  /**
   * @return Success
   */
  getBuildingsList(): Observable<Building[]> {
    let url_ = this.baseUrl + "/api/Building/GetBuildingsList";
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");
    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetBuildingsList(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetBuildingsList(<any>response_);
            } catch (e) {
              return <Observable<Building[]>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<Building[]>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetBuildingsList(
    response: HttpResponseBase
  ): Observable<Building[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (let item of resultData200) {
              result200.push(Building.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Building[]>(<any>null);
  }


  /**
  * @return Success
  */
  getBuildingSearchingResults(latitude: number, longitude: number): Observable<BuildingSearchingResult[]> {
    let url_ = this.baseUrl + "/api/Searching/GetBuildingSearchingResults/{latitude}/{longitude}";

    if (latitude === undefined || latitude === null) {
      throw new Error("The parameter 'latitude' must be defined.");
    }
    url_ = url_.replace("{latitude}", encodeURIComponent("" + latitude));

    if (longitude === undefined || longitude === null) {
      throw new Error("The parameter 'longitude' must be defined.");
    }
    url_ = url_.replace("{longitude}", encodeURIComponent("" + longitude));

    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");
    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetBuildingSearchingResult(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetBuildingSearchingResult(<any>response_);
            } catch (e) {
              return <Observable<BuildingSearchingResult[]>>(<any>_observableThrow(e));
            }
          } else
            return <Observable<BuildingSearchingResult[]>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processGetBuildingSearchingResult(
    response: HttpResponseBase
  ): Observable<BuildingSearchingResult[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (let item of resultData200) {
              result200.push(BuildingSearchingResult.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<BuildingSearchingResult[]>(<any>null);
  }




  /**
   * @return Success
   */
  getBuildingById(id: number): Observable<Building> {
    let url_ = this.baseUrl + "/api/Building/GetBuildingById/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    let authToken = localStorage.getItem("auth_token");
    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetBuildingById(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetBuildingById(<any>response_);
            } catch (e) {
              return <Observable<Building>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Building>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetBuildingById(
    response: HttpResponseBase
  ): Observable<Building> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Building.fromJS(resultData200)
            : new Building();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Building>(<any>null);
  }

  /**
   * @param building (optional)
   * @return Success
   */
  createBuilding(building: Building | null | undefined) {
    let url_ = this.baseUrl + "/api/Building/CreateBuilding";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(building);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCreateBuilding(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCreateBuilding(<any>response_);
            } catch (e) {
              return <Observable<Building>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Building>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processCreateBuilding(
    response: HttpResponseBase
  ): Observable<Building> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Building.fromJS(resultData200)
            : new Building();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Building>(<any>null);
  }

  /**
   * @param building (optional)
   * @return Success
   */
  updateBuilding(building: Building | null | undefined): Observable<Building> {
    let url_ = this.baseUrl + "/api/Building/UpdateBuilding";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(building);
    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateBuilding(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateBuilding(<any>response_);
            } catch (e) {
              return <Observable<Building>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Building>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processUpdateBuilding(
    response: HttpResponseBase
  ): Observable<Building> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Building.fromJS(resultData200)
            : new Building();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Building>(<any>null);
  }

  /**
   * @param searchSetting (optional)
   * @return Success
   */
  updateSearchSetting(
    searchSetting: SearchSetting | null | undefined
  ): Observable<SearchSetting> {
    let url_ = this.baseUrl + "/api/SearchSetting/UpdateSearchSetting";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(searchSetting);
    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateSearchSetting(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateSearchSetting(<any>response_);
            } catch (e) {
              return <Observable<SearchSetting>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<SearchSetting>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processUpdateSearchSetting(
    response: HttpResponseBase
  ): Observable<SearchSetting> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? SearchSetting.fromJS(resultData200)
            : new SearchSetting();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<SearchSetting>(<any>null);
  }

  /**
   * @param workplaceParameter (optional)
   * @return Success
   */
  updateWorkplaceParameter(
    workplaceParameter: WorkplaceParameter | null | undefined
  ): Observable<WorkplaceParameter> {
    let url_ =
      this.baseUrl + "/api/WorkplaceParameter/UpdateWorkplaceParameter";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(workplaceParameter);
    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateWorkplaceParameter(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateWorkplaceParameter(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceParameter>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceParameter>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processUpdateWorkplaceParameter(
    response: HttpResponseBase
  ): Observable<WorkplaceParameter> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceParameter.fromJS(resultData200)
            : new WorkplaceParameter();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceParameter>(<any>null);
  }

  /**
   * @return Success
   */
  deleteBuilding(id: number): Observable<Building> {
    let url_ = this.baseUrl + "/api/Building/DeleteBuilding/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("delete", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processDeleteBuilding(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processDeleteBuilding(<any>response_);
            } catch (e) {
              return <Observable<Building>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Building>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processDeleteBuilding(
    response: HttpResponseBase
  ): Observable<Building> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Building.fromJS(resultData200)
            : new Building();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Building>(<any>null);
  }

  /**
   * @return Success
   */
  deleteWorkplaceParameter(id: number): Observable<WorkplaceParameter> {
    let url_ =
      this.baseUrl + "/api/WorkplaceParameter/DeleteWorkplaceParameter/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("delete", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processDeleteWorkplaceParameter(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processDeleteWorkplaceParameter(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceParameter>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceParameter>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processDeleteWorkplaceParameter(
    response: HttpResponseBase
  ): Observable<WorkplaceParameter> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceParameter.fromJS(resultData200)
            : new WorkplaceParameter();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceParameter>(<any>null);
  }

  /**
   * @return Success
   */
  getClientsList(): Observable<Client[]> {
    let url_ = this.baseUrl + "/api/Client/GetClientsList";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetClientsList(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetClientsList(<any>response_);
            } catch (e) {
              return <Observable<Client[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Client[]>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetClientsList(
    response: HttpResponseBase
  ): Observable<Client[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(Client.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Client[]>(<any>null);
  }

  /**
   * @param id (optional)
   * @return Success
   */
  getClientById(id: number | null | undefined): Observable<Client> {
    let url_ = this.baseUrl + "/api/Client/GetClientById/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetClientById(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetClientById(<any>response_);
            } catch (e) {
              return <Observable<Client>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Client>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetClientById(
    response: HttpResponseBase
  ): Observable<Client> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Client.fromJS(resultData200)
            : new Client();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Client>(<any>null);
  }

  /**
   * @param client (optional)
   * @return Success
   */
  createClient(client: Client | null | undefined): Observable<Client> {
    let url_ = this.baseUrl + "/api/Client/CreateClient";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(client);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCreateClient(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCreateClient(<any>response_);
            } catch (e) {
              return <Observable<Client>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Client>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processCreateClient(
    response: HttpResponseBase
  ): Observable<Client> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Client.fromJS(resultData200)
            : new Client();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Client>(<any>null);
  }

  /**
   * @param client (optional)
   * @return Success
   */
  updateClient(client: Client | null | undefined): Observable<Client> {
    let url_ = this.baseUrl + "/api/Client";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(client);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateClient(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateClient(<any>response_);
            } catch (e) {
              return <Observable<Client>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Client>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processUpdateClient(
    response: HttpResponseBase
  ): Observable<Client> {
    const status = response.status;
    console.log(response);
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Client.fromJS(resultData200)
            : new Client();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Client>(<any>null);
  }

  /**
   * @param id (optional)
   * @return Success
   */
  deleteClient(id: number | null | undefined): Observable<Client> {
    let url_ = this.baseUrl + "/api/Client/DeleteClient/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("delete", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processDeleteClient(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processDeleteClient(<any>response_);
            } catch (e) {
              return <Observable<Client>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Client>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processDeleteClient(
    response: HttpResponseBase
  ): Observable<Client> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Client.fromJS(resultData200)
            : new Client();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Client>(<any>null);
  }

  /**
   * @return Success
   */
  getEquipmentsList(): Observable<Equipment[]> {
    let url_ = this.baseUrl + "/api/Equipment/GetEquipmentsList";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetEquipmentsList(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetEquipmentsList(<any>response_);
            } catch (e) {
              return <Observable<Equipment[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Equipment[]>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetEquipmentsList(
    response: HttpResponseBase
  ): Observable<Equipment[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(Equipment.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Equipment[]>(<any>null);
  }

  /**
   * @return Success
   */
  getEquipmentById(id: number): Observable<Equipment> {
    let url_ = this.baseUrl + "/api/Equipment/GetEquipmentById/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetEquipmentById(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetEquipmentById(<any>response_);
            } catch (e) {
              return <Observable<Equipment>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Equipment>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetEquipmentById(
    response: HttpResponseBase
  ): Observable<Equipment> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Equipment.fromJS(resultData200)
            : new Equipment();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Equipment>(<any>null);
  }

  /**
   * @param equipment (optional)
   * @return Success
   */
  createEquipment(
    equipment: Equipment | null | undefined
  ): Observable<Equipment> {
    let url_ = this.baseUrl + "/api/Equipment/CreateEquipment";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(equipment);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCreateEquipment(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCreateEquipment(<any>response_);
            } catch (e) {
              return <Observable<Equipment>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Equipment>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processCreateEquipment(
    response: HttpResponseBase
  ): Observable<Equipment> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Equipment.fromJS(resultData200)
            : new Equipment();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Equipment>(<any>null);
  }

  /**
   * @param equipment (optional)
   * @return Success
   */
  updateEquipment(
    equipment: Equipment | null | undefined
  ): Observable<Equipment> {
    let url_ = this.baseUrl + "/api/Equipment/UpdateEquipment";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(equipment);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateEquipment(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateEquipment(<any>response_);
            } catch (e) {
              return <Observable<Equipment>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Equipment>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processUpdateEquipment(
    response: HttpResponseBase
  ): Observable<Equipment> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Equipment.fromJS(resultData200)
            : new Equipment();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Equipment>(<any>null);
  }

  /**
   * @return Success
   */
  deleteEquipment(id: number): Observable<Equipment> {
    let url_ = this.baseUrl + "/api/Equipment/DeleteEquipment/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("delete", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processDeleteEquipment(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processDeleteEquipment(<any>response_);
            } catch (e) {
              return <Observable<Equipment>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Equipment>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processDeleteEquipment(
    response: HttpResponseBase
  ): Observable<Equipment> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Equipment.fromJS(resultData200)
            : new Equipment();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Equipment>(<any>null);
  }

  /**
   * @return Success
   */
  getLandlordsList(): Observable<Landlord[]> {
    let url_ = this.baseUrl + "/api/Landlord/GetLandlordsList";
    url_ = url_.replace(/[?&]$/, "");

    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetLandlordsList(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetLandlordsList(<any>response_);
            } catch (e) {
              return <Observable<Landlord[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Landlord[]>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetLandlordsList(
    response: HttpResponseBase
  ): Observable<Landlord[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(Landlord.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Landlord[]>(<any>null);
  }

  /**
   * @return Success
   */
  getLandlordById(id: number): Observable<Landlord> {
    let url_ = this.baseUrl + "/api/Landlord/GetLandlordById/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetLandlordById(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetLandlordById(<any>response_);
            } catch (e) {
              return <Observable<Landlord>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Landlord>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetLandlordById(
    response: HttpResponseBase
  ): Observable<Landlord> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Landlord.fromJS(resultData200)
            : new Landlord();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Landlord>(<any>null);
  }

  /**
   * @param landlord (optional)
   * @return Success
   */
  createLandlord(landlord: Landlord | null | undefined): Observable<Landlord> {
    let url_ = this.baseUrl + "/api/Landlord/CreateLandlord";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(landlord);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCreateLandlord(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCreateLandlord(<any>response_);
            } catch (e) {
              return <Observable<Landlord>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Landlord>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processCreateLandlord(
    response: HttpResponseBase
  ): Observable<Landlord> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Landlord.fromJS(resultData200)
            : new Landlord();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Landlord>(<any>null);
  }

  /**
   * @param landlord (optional)
   * @return Success
   */
  updateLandlord(landlord: Landlord | null | undefined): Observable<Landlord> {
    let url_ = this.baseUrl + "/api/Landlord/UpdateLandlord";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const content_ = JSON.stringify(landlord);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateLandlord(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateLandlord(<any>response_);
            } catch (e) {
              return <Observable<Landlord>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Landlord>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processUpdateLandlord(
    response: HttpResponseBase
  ): Observable<Landlord> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Landlord.fromJS(resultData200)
            : new Landlord();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Landlord>(<any>null);
  }

  /**
   * @return Success
   */
  deleteLandlord(id: number): Observable<Landlord> {
    let url_ = this.baseUrl + "/api/Landlord/DeleteLandlord/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("delete", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processDeleteLandlord(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processDeleteLandlord(<any>response_);
            } catch (e) {
              return <Observable<Landlord>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Landlord>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processDeleteLandlord(
    response: HttpResponseBase
  ): Observable<Landlord> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Landlord.fromJS(resultData200)
            : new Landlord();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Landlord>(<any>null);
  }

  /**
   * @return Success
   */
  calculateRecommendedTableHeight(clientId: number): Observable<number> {
    let url_ =
      this.baseUrl +
      "/api/Recommendation/CalculateRecommendedTableHeight/{clientId}";
    if (clientId === undefined || clientId === null) {
      throw new Error("The parameter 'clientId' must be defined.");
    }
    url_ = url_.replace("{clientId}", encodeURIComponent("" + clientId));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCalculateRecommendedTableHeight(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCalculateRecommendedTableHeight(
                <any>response_
              );
            } catch (e) {
              return <Observable<number>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<number>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processCalculateRecommendedTableHeight(
    response: HttpResponseBase
  ): Observable<number> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200 !== undefined ? resultData200 : <any>null;
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<number>(<any>null);
  }

  /**
   * @return Success
   */
  calculateRecommendedChairHeight(clientId: number): Observable<number> {
    let url_ =
      this.baseUrl +
      "/api/Recommendation/CalculateRecommendedChairHeight/{clientId}";
    if (clientId === undefined || clientId === null) {
      throw new Error("The parameter 'clientId' must be defined.");
    }
    url_ = url_.replace("{clientId}", encodeURIComponent("" + clientId));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCalculateRecommendedChairHeight(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCalculateRecommendedChairHeight(
                <any>response_
              );
            } catch (e) {
              return <Observable<number>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<number>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processCalculateRecommendedChairHeight(
    response: HttpResponseBase
  ): Observable<number> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200 !== undefined ? resultData200 : <any>null;
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<number>(<any>null);
  }

  getCurseValues() {
    //let result: CurseValues[] = [];
    return this.http.get(
      "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
    );
    //.subscribe((res) => {https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5
    //  console.log(res);
    // result = JSON.parse(JSON.stringify(res));
    // });
    //console.log(result);
    //   return result;
  }


  protected processSearcForWorcplaces(
    response: HttpResponseBase
  ): Observable<FindedWorkplace[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(FindedWorkplace.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<FindedWorkplace[]>(<any>null);
  }

  /**
   * @return Success
   */
  getStatisticsByYear(
    year: number,
    buildingId: number
  ): Observable<{ [key: string]: number }> {
    let url_ =
      this.baseUrl + "/api/Statistics/GetStatisticsByYear/{year}, {buildingId}";
    if (year === undefined || year === null) {
      throw new Error("The parameter 'year' must be defined.");
    }
    url_ = url_.replace("{year}", encodeURIComponent("" + year));
    if (buildingId === undefined || buildingId === null) {
      throw new Error("The parameter 'buildingId' must be defined.");
    }
    url_ = url_.replace("{buildingId}", encodeURIComponent("" + buildingId));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetStatisticsByYear(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetStatisticsByYear(<any>response_);
            } catch (e) {
              return <Observable<{ [key: string]: number }>>(
                (<any>_observableThrow(e))
              );
            }
          } else {
            return <Observable<{ [key: string]: number }>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetStatisticsByYear(
    response: HttpResponseBase
  ): Observable<{ [key: string]: number }> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200) {
            result200 = {};
            for (const key in resultData200) {
              if (resultData200.hasOwnProperty(key)) {
                result200[key] = resultData200[key];
              }
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<{ [key: string]: number }>(<any>null);
  }




 /**
   * @return Success
   */
  getClientStatisticsByYear(): Observable<{ [key: string]: number }> {
    let url_ =
      this.baseUrl + "/api/Statistics/GetClientStatisticsByYear";

    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetClientStatisticsByYear(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetClientStatisticsByYear(<any>response_);
            } catch (e) {
              return <Observable<{ [key: string]: number }>>(
                (<any>_observableThrow(e))
              );
            }
          } else {
            return <Observable<{ [key: string]: number }>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetClientStatisticsByYear(
    response: HttpResponseBase
  ): Observable<{ [key: string]: number }> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200) {
            result200 = {};
            for (const key in resultData200) {
              if (resultData200.hasOwnProperty(key)) {
                result200[key] = resultData200[key];
              }
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<{ [key: string]: number }>(<any>null);
  }



  /**
   * @return Success
   */
  getClientStatisticsByWeek(): Observable<{ [key: string]: number }> {
    let url_ =
      this.baseUrl + "/api/Statistics/GetClientStatisticsByWeek";

    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetClientStatisticsByWeek(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetClientStatisticsByWeek(<any>response_);
            } catch (e) {
              return <Observable<{ [key: string]: number }>>(
                (<any>_observableThrow(e))
              );
            }
          } else {
            return <Observable<{ [key: string]: number }>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetClientStatisticsByWeek(
    response: HttpResponseBase
  ): Observable<{ [key: string]: number }> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200) {
            result200 = {};
            for (const key in resultData200) {
              if (resultData200.hasOwnProperty(key)) {
                result200[key] = resultData200[key];
              }
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<{ [key: string]: number }>(<any>null);
  }

  /**
   * @return Success
   */
  getClientStatisticsByMonth(): Observable<{ [key: string]: number }> {
    let url_ =
      this.baseUrl + "/api/Statistics/GetClientStatisticsByMonth";

    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetClientStatisticsByMonth(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetClientStatisticsByMonth(<any>response_);
            } catch (e) {
              return <Observable<{ [key: string]: number }>>(
                (<any>_observableThrow(e))
              );
            }
          } else {
            return <Observable<{ [key: string]: number }>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetClientStatisticsByMonth(
    response: HttpResponseBase
  ): Observable<{ [key: string]: number }> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200) {
            result200 = {};
            for (const key in resultData200) {
              if (resultData200.hasOwnProperty(key)) {
                result200[key] = resultData200[key];
              }
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<{ [key: string]: number }>(<any>null);
  }


  /**
   * @return Success
   */
  getStatisticsByMonth(
    year: number,
    month: number,
    buildingId: number
  ): Observable<{ [key: string]: number }> {
    let url_ =
      this.baseUrl +
      "/api/Statistics/GetStatisticsByMonth/{year}, {month}, {buildingId}";
    if (year === undefined || year === null) {
      throw new Error("The parameter 'year' must be defined.");
    }
    url_ = url_.replace("{year}", encodeURIComponent("" + year));
    if (month === undefined || month === null) {
      throw new Error("The parameter 'month' must be defined.");
    }
    url_ = url_.replace("{month}", encodeURIComponent("" + month));
    if (buildingId === undefined || buildingId === null) {
      throw new Error("The parameter 'buildingId' must be defined.");
    }
    url_ = url_.replace("{buildingId}", encodeURIComponent("" + buildingId));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetStatisticsByMonth(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetStatisticsByMonth(<any>response_);
            } catch (e) {
              return <Observable<{ [key: string]: number }>>(
                (<any>_observableThrow(e))
              );
            }
          } else {
            return <Observable<{ [key: string]: number }>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetStatisticsByMonth(
    response: HttpResponseBase
  ): Observable<{ [key: string]: number }> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200) {
            result200 = {};
            for (const key in resultData200) {
              if (resultData200.hasOwnProperty(key)) {
                result200[key] = resultData200[key];
              }
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<{ [key: string]: number }>(<any>null);
  }

  /**
   * @return Success
   */
  getAverageStatisticsByWeek(
    buildingId: number
  ): Observable<{ [key: string]: number }> {
    let url_ =
      this.baseUrl + "/api/Statistics/GetAverageStatisticsByWeek/{buildingId}";
    if (buildingId === undefined || buildingId === null) {
      throw new Error("The parameter 'buildingId' must be defined.");
    }
    url_ = url_.replace("{buildingId}", encodeURIComponent("" + buildingId));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetAverageStatisticsByWeek(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetAverageStatisticsByWeek(<any>response_);
            } catch (e) {
              return <Observable<{ [key: string]: number }>>(
                (<any>_observableThrow(e))
              );
            }
          } else {
            return <Observable<{ [key: string]: number }>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetAverageStatisticsByWeek(
    response: HttpResponseBase
  ): Observable<{ [key: string]: number }> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200) {
            result200 = {};
            for (const key in resultData200) {
              if (resultData200.hasOwnProperty(key)) {
                result200[key] = resultData200[key];
              }
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<{ [key: string]: number }>(<any>null);
  }

  /**
   * @return Success
   */
  getAll(): Observable<string[]> {
    let url_ = this.baseUrl + "/api/Values";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");

    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetAll(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetAll(<any>response_);
            } catch (e) {
              return <Observable<string[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<string[]>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetAll(response: HttpResponseBase): Observable<string[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(item);
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<string[]>(<any>null);
  }

  /**
   * @return Success
   */
  getWorkplacesList(): Observable<Workplace[]> {
    let url_ = this.baseUrl + "/api/Workplace/GetWorkplacesList";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplacesList(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplacesList(<any>response_);
            } catch (e) {
              return <Observable<Workplace[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Workplace[]>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetWorkplacesList(
    response: HttpResponseBase
  ): Observable<Workplace[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(Workplace.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Workplace[]>(<any>null);
  }

  /**
   * @return Success
   */
  getWorkplaceById(id: number): Observable<Workplace> {
    let url_ = this.baseUrl + "/api/Workplace/GetWorkplaceById/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceById(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceById(<any>response_);
            } catch (e) {
              return <Observable<Workplace>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Workplace>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processGetWorkplaceById(
    response: HttpResponseBase
  ): Observable<Workplace> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Workplace.fromJS(resultData200)
            : new Workplace();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Workplace>(<any>null);
  }

  /**
   * @param workplace (optional)
   * @return Success
   */
  createWorkplace(
    workplace: Workplace | null | undefined
  ): Observable<Workplace> {
    let url_ = this.baseUrl + "/api/Workplace/CreateWorkplace";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const content_ = JSON.stringify(workplace);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCreateWorkplace(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCreateWorkplace(<any>response_);
            } catch (e) {
              return <Observable<Workplace>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Workplace>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processCreateWorkplace(
    response: HttpResponseBase
  ): Observable<Workplace> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Workplace.fromJS(resultData200)
            : new Workplace();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Workplace>(<any>null);
  }

  /**
   * @param workplace (optional)
   * @return Success
   */
  updateWorkplace(
    workplace: Workplace | null | undefined
  ): Observable<Workplace> {
    let url_ = this.baseUrl + "/api/Workplace/UpdateWorkplace";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const content_ = JSON.stringify(workplace);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateWorkplace(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateWorkplace(<any>response_);
            } catch (e) {
              return <Observable<Workplace>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Workplace>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processUpdateWorkplace(
    response: HttpResponseBase
  ): Observable<Workplace> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Workplace.fromJS(resultData200)
            : new Workplace();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Workplace>(<any>null);
  }

  /**
   * @return Success
   */
  deleteWorkplace(id: number): Observable<Workplace> {
    let url_ = this.baseUrl + "/api/Workplace/DeleteWorkplace/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("delete", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processDeleteWorkplace(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processDeleteWorkplace(<any>response_);
            } catch (e) {
              return <Observable<Workplace>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<Workplace>>(<any>_observableThrow(response_));
          }
        })
      );
  }

  protected processDeleteWorkplace(
    response: HttpResponseBase
  ): Observable<Workplace> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? Workplace.fromJS(resultData200)
            : new Workplace();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<Workplace>(<any>null);
  }

  /**
   * @return Success
   */
  getWorkplaceEquipmentsList(): Observable<WorkplaceEquipment[]> {
    let url_ =
      this.baseUrl + "/api/WorkplaceEquipment/GetWorkplaceEquipmentsList";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceEquipmentsList(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceEquipmentsList(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceEquipment[]>>(
                (<any>_observableThrow(e))
              );
            }
          } else {
            return <Observable<WorkplaceEquipment[]>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetWorkplaceEquipmentsList(
    response: HttpResponseBase
  ): Observable<WorkplaceEquipment[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(WorkplaceEquipment.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceEquipment[]>(<any>null);
  }

  /**
   * @return Success
   */
  getWorkplaceEquipmentById(id: number): Observable<WorkplaceEquipment> {
    let url_ =
      this.baseUrl + "/api/WorkplaceEquipment/GetWorkplaceEquipmentById/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceEquipmentById(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceEquipmentById(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceEquipment>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceEquipment>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetWorkplaceEquipmentById(
    response: HttpResponseBase
  ): Observable<WorkplaceEquipment> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceEquipment.fromJS(resultData200)
            : new WorkplaceEquipment();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceEquipment>(<any>null);
  }

  /**
   * @param workplaceEquipment (optional)
   * @return Success
   */
  createWorkplaceEquipment(
    workplaceEquipment: WorkplaceEquipment | null | undefined
  ): Observable<WorkplaceEquipment> {
    let url_ =
      this.baseUrl + "/api/WorkplaceEquipment/CreateWorkplaceEquipment";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(workplaceEquipment);
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCreateWorkplaceEquipment(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCreateWorkplaceEquipment(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceEquipment>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceEquipment>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processCreateWorkplaceEquipment(
    response: HttpResponseBase
  ): Observable<WorkplaceEquipment> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceEquipment.fromJS(resultData200)
            : new WorkplaceEquipment();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceEquipment>(<any>null);
  }

  /**
   * @param workplaceEquipment (optional)
   * @return Success
   */
  updateWorkplaceEquipment(
    workplaceEquipment: WorkplaceEquipment | null | undefined
  ): Observable<WorkplaceEquipment> {
    let url_ =
      this.baseUrl + "/api/WorkplaceEquipment/UpdateWorkplaceEquipment";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const content_ = JSON.stringify(workplaceEquipment);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateWorkplaceEquipment(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateWorkplaceEquipment(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceEquipment>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceEquipment>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processUpdateWorkplaceEquipment(
    response: HttpResponseBase
  ): Observable<WorkplaceEquipment> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceEquipment.fromJS(resultData200)
            : new WorkplaceEquipment();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceEquipment>(<any>null);
  }

  /**
   * @return Success
   */
  deleteWorkplaceEquipment(id: number): Observable<WorkplaceEquipment> {
    let url_ =
      this.baseUrl + "/api/WorkplaceEquipment/DeleteWorkplaceEquipment/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("delete", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processDeleteWorkplaceEquipment(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processDeleteWorkplaceEquipment(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceEquipment>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceEquipment>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processDeleteWorkplaceEquipment(
    response: HttpResponseBase
  ): Observable<WorkplaceEquipment> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceEquipment.fromJS(resultData200)
            : new WorkplaceEquipment();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceEquipment>(<any>null);
  }


  /**
   * @return Success
   */
  GetWorkplaceOrdersByWorkplaceId(workplaceId): Observable<WorkplaceOrder[]> {
    let url_ = this.baseUrl + "/api/WorkplaceOrder/GetWorkplaceOrdersByWorkplaceId/{workplaceId}";
    if (workplaceId === undefined || workplaceId === null) {
      throw new Error("The parameter 'workplaceId' must be defined.");
    }
    url_ = url_.replace("{workplaceId}", encodeURIComponent("" + workplaceId));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceOrdersByWorkplaceId(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceOrdersByWorkplaceId(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceOrder[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceOrder[]>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetWorkplaceOrdersByWorkplaceId(
    response: HttpResponseBase
  ): Observable<WorkplaceOrder[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(WorkplaceOrder.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceOrder[]>(<any>null);
  }

  /**
   * @return Success
   */
  GetWorkplaceEquipmentByWorkplaceWithEquipment(workplaceId): Observable<WorkplaceEquipment[]> {
    let url_ = this.baseUrl + "/api/WorkplaceEquipment/GetWorkplaceEquipmentByWorkplaceWithEquipment/{workplaceId}";
    if (workplaceId === undefined || workplaceId === null) {
      throw new Error("The parameter 'workplaceId' must be defined.");
    }
    url_ = url_.replace("{workplaceId}", encodeURIComponent("" + workplaceId));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceEquipmentByWorkplaceWithEquipment(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceEquipmentByWorkplaceWithEquipment(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceEquipment[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceEquipment[]>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetWorkplaceEquipmentByWorkplaceWithEquipment(
    response: HttpResponseBase
  ): Observable<WorkplaceEquipment[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(WorkplaceEquipment.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceEquipment[]>(<any>null);
  }

  /**
   * @return Success
   */
  getWorkplaceOrdersList(): Observable<WorkplaceOrder[]> {
    let url_ = this.baseUrl + "/api/WorkplaceOrder/GetWorkplaceOrdersList";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceOrdersList(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceOrdersList(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceOrder[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceOrder[]>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetWorkplaceOrdersList(
    response: HttpResponseBase
  ): Observable<WorkplaceOrder[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(WorkplaceOrder.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceOrder[]>(<any>null);
  }

  /**
   * @param clientId (optional)
   * @return Success
   */
  getWorkplaceOrdersListByClient(
    clientId: number | null | undefined
  ): Observable<WorkplaceOrder[]> {
    let url_ =
      this.baseUrl +
      "/api/WorkplaceOrder/GetWorkplaceOrdersListByClient/{clientId}";
    if (clientId === undefined || clientId === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{clientId}", encodeURIComponent("" + clientId));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceOrdersListByClient(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceOrdersList(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceOrder[]>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceOrder[]>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetWorkplaceOrdersListByClient(
    response: HttpResponseBase
  ): Observable<WorkplaceOrder[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(WorkplaceOrder.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceOrder[]>(<any>null);
  }

  /**
   * @return Success
   */
  getClientsWorkplaceParameters(): Observable<WorkplaceParameter[]> {
    let url_ =
      this.baseUrl + "/api/WorkplaceParameter/GetClientsWorkplaceParameters";

    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetClientsWorkplaceParameters(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetClientsWorkplaceParameters(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceParameter[]>>(
                (<any>_observableThrow(e))
              );
            }
          } else {
            return <Observable<WorkplaceParameter[]>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetClientsWorkplaceParameters(
    response: HttpResponseBase
  ): Observable<WorkplaceParameter[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            for (const item of resultData200) {
              result200.push(WorkplaceParameter.fromJS(item));
            }
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceParameter[]>(<any>null);
  }

  /**
   * @return Success
   */
  getWorkplaceOrderById(id: number): Observable<WorkplaceOrder> {
    let url_ = this.baseUrl + "/api/WorkplaceOrder/GetWorkplaceOrderById/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("get", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processGetWorkplaceOrderById(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processGetWorkplaceOrderById(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceOrder>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceOrder>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processGetWorkplaceOrderById(
    response: HttpResponseBase
  ): Observable<WorkplaceOrder> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceOrder.fromJS(resultData200)
            : new WorkplaceOrder();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceOrder>(<any>null);
  }

  /**
   * @param workplaceOrder (optional)
   * @return Success
   */
  createWorkplaceOrder(
    workplaceOrder: WorkplaceOrder | null | undefined
  ): Observable<WorkplaceOrder> {
    let url_ = this.baseUrl + "/api/WorkplaceOrder/CreateWorkplaceOrder";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const content_ = JSON.stringify(workplaceOrder);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCreateWorkplaceOrder(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCreateWorkplaceOrder(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceOrder>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceOrder>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processCreateWorkplaceOrder(
    response: HttpResponseBase
  ): Observable<WorkplaceOrder> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceOrder.fromJS(resultData200)
            : new WorkplaceOrder();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceOrder>(<any>null);
  }

  /**
   * @param workplaceParameter (optional)
   * @return Success
   */
  createWorkplaceParameter(
    workplaceParameter: WorkplaceParameter | null | undefined
  ): Observable<WorkplaceParameter> {
    let url_ =
      this.baseUrl + "/api/WorkplaceParameter/CreateWorkplaceParameter";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const content_ = JSON.stringify(workplaceParameter);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("post", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processCreateWorkplaceParameter(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processCreateWorkplaceParameter(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceParameter>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceParameter>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processCreateWorkplaceParameter(
    response: HttpResponseBase
  ): Observable<WorkplaceParameter> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceParameter.fromJS(resultData200)
            : new WorkplaceParameter();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceParameter>(<any>null);
  }

  /**
   * @param workplaceOrder (optional)
   * @return Success
   */
  updateWorkplaceOrder(
    workplaceOrder: WorkplaceOrder | null | undefined
  ): Observable<WorkplaceOrder> {
    let url_ = this.baseUrl + "/api/WorkplaceOrder/UpdateWorkplaceOrder";
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const content_ = JSON.stringify(workplaceOrder);

    const options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("put", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processUpdateWorkplaceOrder(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processUpdateWorkplaceOrder(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceOrder>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceOrder>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processUpdateWorkplaceOrder(
    response: HttpResponseBase
  ): Observable<WorkplaceOrder> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceOrder.fromJS(resultData200)
            : new WorkplaceOrder();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceOrder>(<any>null);
  }

  /**
   * @return Success
   */
  deleteWorkplaceOrder(id: number): Observable<WorkplaceOrder> {
    let url_ = this.baseUrl + "/api/WorkplaceOrder/DeleteWorkplaceOrder/{id}";
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    const authToken = localStorage.getItem("auth_token");
    const options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      }),
    };

    return this.http
      .request("delete", url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processDeleteWorkplaceOrder(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processDeleteWorkplaceOrder(<any>response_);
            } catch (e) {
              return <Observable<WorkplaceOrder>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<WorkplaceOrder>>(
              (<any>_observableThrow(response_))
            );
          }
        })
      );
  }

  protected processDeleteWorkplaceOrder(
    response: HttpResponseBase
  ): Observable<WorkplaceOrder> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
          ? (<any>response).error
          : undefined;

    const _headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          const resultData200 =
            _responseText === ""
              ? null
              : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = resultData200
            ? WorkplaceOrder.fromJS(resultData200)
            : new WorkplaceOrder();
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException(
            "An unexpected server error occurred.",
            status,
            _responseText,
            _headers
          );
        })
      );
    }
    return _observableOf<WorkplaceOrder>(<any>null);
  }
}

export class RegistrationViewModel implements IRegistrationViewModel {
  constructor(data?: IRegistrationViewModel) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  email?: string | undefined;
  password?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  birthday?: Date | undefined;
  passportNumber?: number | undefined;
  phone?: string | undefined;
  role?: string | undefined;

  static fromJS(data: any): RegistrationViewModel {
    data = typeof data === "object" ? data : {};
    const result = new RegistrationViewModel();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.email = data["email"];
      this.password = data["password"];
      this.firstName = data["firstName"];
      this.lastName = data["lastName"];
      this.birthday = data["birthday"]
        ? new Date(data["birthday"].toString())
        : <any>undefined;
      this.passportNumber = data["passportNumber"];
      this.phone = data["phone"];
      this.role = data["role"];
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["email"] = this.email;
    data["password"] = this.password;
    data["firstName"] = this.firstName;
    data["lastName"] = this.lastName;
    data["birthday"] = this.birthday
      ? this.birthday.toISOString()
      : <any>undefined;
    data["passportNumber"] = this.passportNumber;
    data["phone"] = this.phone;
    data["role"] = this.role;
    return data;
  }
}

export interface IRegistrationViewModel {
  email?: string | undefined;
  password?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  birthday?: Date | undefined;
  passportNumber?: number | undefined;
  phone?: string | undefined;
  role?: string | undefined;
}

export class CredentialsViewModel implements ICredentialsViewModel {
  constructor(data?: ICredentialsViewModel) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  userName?: string | undefined;
  password?: string | undefined;

  static fromJS(data: any): CredentialsViewModel {
    data = typeof data === "object" ? data : {};
    const result = new CredentialsViewModel();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.userName = data["userName"];
      this.password = data["password"];
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["userName"] = this.userName;
    data["password"] = this.password;
    return data;
  }
}

export interface ICredentialsViewModel {
  userName?: string | undefined;
  password?: string | undefined;
}

export class Building implements IBuilding {
  constructor(data?: IBuilding) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  country?: string | undefined;
  city?: string | undefined;
  street?: string | undefined;
  house?: string | undefined;
  flat?: number | undefined;
  landlordId?: number | undefined;
  x?: number | undefined;
  y?: number | undefined;
  name?: string | undefined;
  monStartTime?: number | undefined;
  monFinishTime?: number | undefined;
  tueStartTime?: number | undefined;
  tueFinishTime?: number | undefined;
  wedStartTime?: number | undefined;
  wedFinishTime?: number | undefined;
  thuStartTime?: number | undefined;
  thuFinishTime?: number | undefined;
  friStartTime?: number | undefined;
  friFinishTime?: number | undefined;
  satStartTime?: number | undefined;
  satFinishTime?: number | undefined;
  sunStartTime?: number | undefined;
  sunFinishTime?: number | undefined;
  landlord?: Landlord | undefined;
  workplace?: Workplace[] | undefined;

  static fromJS(data: any): Building {
    data = typeof data === "object" ? data : {};
    const result = new Building();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.country = data["country"];
      this.city = data["city"];
      this.street = data["street"];
      this.house = data["house"];
      this.flat = data["flat"];
      this.landlordId = data["landlordId"];
      this.x = data["x"];
      this.y = data["y"];
      this.name = data["name"];
      this.monStartTime = data["monStartTime"];
      this.monFinishTime = data["monFinishTime"];
      this.tueStartTime = data["tueStartTime"];
      this.tueFinishTime = data["tueFinishTime"];
      this.wedStartTime = data["wedStartTime"];
      this.wedFinishTime = data["wedFinishTime"];
      this.thuStartTime = data["thuStartTime"];
      this.thuFinishTime = data["thuFinishTime"];
      this.friStartTime = data["friStartTime"] ;
      this.friFinishTime = data["friFinishTime"];
      this.satStartTime = data["satStartTime"];
      this.satFinishTime = data["satFinishTime"];
      this.sunStartTime = data["sunStartTime"];
      this.sunFinishTime = data["sunFinishTime"];
      this.landlord = data["landlord"]
        ? Landlord.fromJS(data["landlord"])
        : <any>undefined;
      if (data["workplace"] && data["workplace"].constructor === Array) {
        this.workplace = [];
        for (const item of data["workplace"]) {
          this.workplace.push(Workplace.fromJS(item));
        }
      }
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["country"] = this.country;
    data["city"] = this.city;
    data["street"] = this.street;
    data["house"] = this.house;
    data["flat"] = this.flat;
    data["landlordId"] = this.landlordId;
    data["x"] = this.x;
    data["y"] = this.y;
    data["name"] = this.name;
    data["monStartTime"] = this.monStartTime;
    data["monFinishTime"] = this.monFinishTime;
    data["tueStartTime"] = this.tueStartTime;
    data["tueFinishTime"] = this.tueFinishTime;
    data["wedStartTime"] = this.wedStartTime;
    data["wedFinishTime"] = this.wedFinishTime;
    data["thuStartTime"] = this.thuStartTime;
    data["thuFinishTime"] = this.thuFinishTime;
    data["friStartTime"] = this.friStartTime;
    data["friFinishTime"] = this.friFinishTime;
    data["satStartTime"] = this.satStartTime;
    data["satFinishTime"] = this.satFinishTime;
    data["sunStartTime"] = this.sunStartTime;
    data["sunFinishTime"] = this.sunFinishTime;
    data["landlord"] = this.landlord ? this.landlord.toJSON() : <any>undefined;
    if (this.workplace && this.workplace.constructor === Array) {
      data["workplace"] = [];
      for (const item of this.workplace) {
        data["workplace"].push(item.toJSON());
      }
    }
    return data;
  }
}

export interface IBuilding {
  id?: number | undefined;
  country?: string | undefined;
  city?: string | undefined;
  street?: string | undefined;
  house?: string | undefined;
  flat?: number | undefined;
  landlordId?: number | undefined;
  x?: number | undefined;
  y?: number | undefined;
  name?: string | undefined;
  monStartTime?: number | undefined;
  monFinishTime?: number | undefined;
  tueStartTime?: number | undefined;
  tueFinishTime?: number | undefined;
  wedStartTime?: number | undefined;
  wedFinishTime?: number | undefined;
  thuStartTime?: number | undefined;
  thuFinishTime?: number | undefined;
  friStartTime?: number | undefined;
  friFinishTime?: number | undefined;
  satStartTime?: number | undefined;
  satFinishTime?: number | undefined;
  sunStartTime?: number | undefined;
  sunFinishTime?: number | undefined;
  landlord?: Landlord | undefined;
  workplace?: Workplace[] | undefined;
}

export class SearchSetting implements ISearchSetting {
  constructor(data?: ISearchSetting) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  searchSettingId?: number | undefined;
  radius?: number | undefined;
  wantedCost?: number | undefined;
  client?: Client | undefined;

  static fromJS(data: any): SearchSetting {
    data = typeof data === "object" ? data : {};
    const result = new SearchSetting();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.searchSettingId = data["searchSettingId"];
      this.radius = data["radius"];
      this.wantedCost = data["wantedCost"];
      this.client = data["client"]
        ? Client.fromJS(data["client"])
        : <any>undefined;
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["searchSettingId"] = this.searchSettingId;
    data["radius"] = this.radius;
    data["wantedCost"] = this.wantedCost;
    data["client"] = this.client ? this.client.toJSON() : <any>undefined;

    return data;
  }
}

export interface ISearchSetting {
  searchSettingId?: number | undefined;
  radius?: number | undefined;
  wantedCost?: number | undefined;
  client?: Client | undefined;
}

export class Landlord implements ILandlord {
  constructor(data?: ILandlord) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  passportNumber?: number | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  isInBlackList?: number | undefined;
  identityId?: string | undefined;
  identity?: User | undefined;
  building?: Building[] | undefined;
  birthday?: Date | undefined;


  static fromJS(data: any): Landlord {
    data = typeof data === "object" ? data : {};
    const result = new Landlord();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.firstName = data["firstName"];
      this.lastName = data["lastName"];
      this.passportNumber = data["passportNumber"];
      this.phone = data["phone"];
      this.email = data["email"];
      this.isInBlackList = data["isInBlackList"];
      this.identityId = data["identityId"];
      this.birthday = data["birthday"]
      ? new Date(data["birthday"].toString())
      : <any>undefined;
      this.identity = data["identity"]
        ? User.fromJS(data["identity"])
        : <any>undefined;
      if (data["building"] && data["building"].constructor === Array) {
        this.building = [];
        for (const item of data["building"]) {
          this.building.push(Building.fromJS(item));
        }
      }
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["firstName"] = this.firstName;
    data["lastName"] = this.lastName;
    data["passportNumber"] = this.passportNumber;
    data["phone"] = this.phone;
    data["email"] = this.email;
    data["isInBlackList"] = this.isInBlackList;
    data["identityId"] = this.identityId;
    data["birthday"] = this.birthday ? this.birthday : <any>undefined;
    data["identity"] = this.identity ? this.identity.toJSON() : <any>undefined;
    if (this.building && this.building.constructor === Array) {
      data["building"] = [];
      for (const item of this.building) {
        data["building"].push(item.toJSON());
      }
    }
    return data;
  }
}

export interface ILandlord {
  id?: number | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  passportNumber?: number | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  isInBlackList?: number | undefined;
  identityId?: string | undefined;
  identity?: User | undefined;
  building?: Building[] | undefined;
  birthday?: Date | undefined;
}


export interface IFilteredPagedResult {
  workplaceOrders?: WorkplaceOrder[] | undefined;
  totalCount?: number | undefined;
}


export class FilteredPagedResult implements IFilteredPagedResult {
  constructor(data?: IFilteredPagedResult) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  workplaceOrders?: WorkplaceOrder[] | undefined;
  totalCount?: number | undefined;

  static fromJS(data: any): FilteredPagedResult {
    data = typeof data === "object" ? data : {};
    const result = new FilteredPagedResult();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.totalCount = data["totalCount"];
      if (data["workplaceOrders"] && data["workplaceOrders"].constructor === Array) {
        this.workplaceOrders = [];
        for (const item of data["workplaceOrders"]) {
          this.workplaceOrders.push(WorkplaceOrder.fromJS(item));
        }
      }
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["totalCount"] = this.totalCount;
    if (this.workplaceOrders && this.workplaceOrders.constructor === Array) {
      data["workplaceOrders"] = [];
      for (const item of this.workplaceOrders) {
        data["workplaceOrders"].push(item.toJSON());
      }
    }
    return data;
  }
}

export class Workplace implements IWorkplace {
  constructor(data?: IWorkplace) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  mark?: number | undefined;
  cost?: number | undefined;
  buildingId?: number | undefined;
  building?: Building | undefined;
  workplaceOrder?: WorkplaceOrder[] | undefined;
  workplaceEquipment?: WorkplaceEquipment[] | undefined;

  static fromJS(data: any): Workplace {
    data = typeof data === "object" ? data : {};
    const result = new Workplace();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.mark = data["mark"];
      this.cost = data["cost"];
      this.buildingId = data["buildingId"];
      this.building = data["building"]
        ? Building.fromJS(data["building"])
        : <any>undefined;
      if (
        data["workplaceOrder"] &&
        data["workplaceOrder"].constructor === Array
      ) {
        this.workplaceOrder = [];
        for (const item of data["workplaceOrder"]) {
          this.workplaceOrder.push(WorkplaceOrder.fromJS(item));
        }
      }
      if (
        data["workplaceEquipment"] &&
        data["workplaceEquipment"].constructor === Array
      ) {
        this.workplaceEquipment = [];
        for (const item of data["workplaceEquipment"]) {
          this.workplaceEquipment.push(WorkplaceEquipment.fromJS(item));
        }
      }
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["mark"] = this.mark;
    data["cost"] = this.cost;
    data["buildingId"] = this.buildingId;
    data["building"] = this.building ? this.building.toJSON() : <any>undefined;
    if (this.workplaceOrder && this.workplaceOrder.constructor === Array) {
      data["workplaceOrder"] = [];
      for (const item of this.workplaceOrder) {
        data["workplaceOrder"].push(item.toJSON());
      }
    }
    if (
      this.workplaceEquipment &&
      this.workplaceEquipment.constructor === Array
    ) {
      data["workplaceEquipment"] = [];
      for (const item of this.workplaceEquipment) {
        data["workplaceEquipment"].push(item.toJSON());
      }
    }
    return data;
  }
}

export class Scheduler implements IScheduler {
  id?: string | undefined;
  start_date?: string | undefined;
  end_date?: string | undefined;
  text?: string | undefined;
  details?: string | undefined;

  constructor(data?: IScheduler) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.start_date = data["start_date"];
      this.end_date = data["end_date"];
      this.text = data["text"];
      this.details = data["details"];
    }
  }

  static fromJS(data: any): Scheduler {
    data = typeof data === "object" ? data : {};
    let result = new Scheduler();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["start_date"] = this.start_date;
    data["end_date"] = this.end_date;
    data["text"] = this.text;
    data["details"] = this.details;
    return data;
  }
}

export interface IScheduler {
  id?: string | undefined;
  start_date?: string | undefined;
  end_date?: string | undefined;
  text?: string | undefined;
  details?: string | undefined;
}

export interface IWorkplace {
  id?: number | undefined;
  mark?: number | undefined;
  cost?: number | undefined;
  buildingId?: number | undefined;
  building?: Building | undefined;
  workplaceOrder?: WorkplaceOrder[] | undefined;
  workplaceEquipment?: WorkplaceEquipment[] | undefined;
}

export interface IMonitoring {
  id?: number | undefined;
  clientId?: number | undefined;
  date?: Date | undefined;
  rightValues?: number | undefined;
}

export class Monitoring implements IMonitoring {
  constructor(data?: IMonitoring) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  clientId?: number | undefined;
  date?: Date | undefined;
  rightValues?: number | undefined;

  static fromJS(data: any): Monitoring {
    data = typeof data === "object" ? data : {};
    const result = new Monitoring();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.clientId = data["clientId"];
      this.date = data["date"]
        ? new Date(data["date"].toString())
        : <any>undefined;
      this.rightValues = data["rightValues"];
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["clientId"] = this.clientId;
    data["date"] = this.date
      ? this.date.toISOString()
      : <any>undefined;
    data["rightValues"] = this.rightValues;
    return data;
  }
}

export class User implements IUser {
  constructor(data?: IUser) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: string | undefined;
  userName?: string | undefined;
  normalizedUserName?: string | undefined;
  email?: string | undefined;
  normalizedEmail?: string | undefined;
  emailConfirmed?: boolean | undefined;
  passwordHash?: string | undefined;
  securityStamp?: string | undefined;
  concurrencyStamp?: string | undefined;
  phoneNumber?: string | undefined;
  phoneNumberConfirmed?: boolean | undefined;
  twoFactorEnabled?: boolean | undefined;
  lockoutEnd?: Date | undefined;
  lockoutEnabled?: boolean | undefined;
  accessFailedCount?: number | undefined;

  static fromJS(data: any): User {
    data = typeof data === "object" ? data : {};
    const result = new User();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.userName = data["userName"];
      this.normalizedUserName = data["normalizedUserName"];
      this.email = data["email"];
      this.normalizedEmail = data["normalizedEmail"];
      this.emailConfirmed = data["emailConfirmed"];
      this.passwordHash = data["passwordHash"];
      this.securityStamp = data["securityStamp"];
      this.concurrencyStamp = data["concurrencyStamp"];
      this.phoneNumber = data["phoneNumber"];
      this.phoneNumberConfirmed = data["phoneNumberConfirmed"];
      this.twoFactorEnabled = data["twoFactorEnabled"];
      this.lockoutEnd = data["lockoutEnd"]
        ? new Date(data["lockoutEnd"].toString())
        : <any>undefined;
      this.lockoutEnabled = data["lockoutEnabled"];
      this.accessFailedCount = data["accessFailedCount"];
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["userName"] = this.userName;
    data["normalizedUserName"] = this.normalizedUserName;
    data["email"] = this.email;
    data["normalizedEmail"] = this.normalizedEmail;
    data["emailConfirmed"] = this.emailConfirmed;
    data["passwordHash"] = this.passwordHash;
    data["securityStamp"] = this.securityStamp;
    data["concurrencyStamp"] = this.concurrencyStamp;
    data["phoneNumber"] = this.phoneNumber;
    data["phoneNumberConfirmed"] = this.phoneNumberConfirmed;
    data["twoFactorEnabled"] = this.twoFactorEnabled;
    data["lockoutEnd"] = this.lockoutEnd
      ? this.lockoutEnd.toISOString()
      : <any>undefined;
    data["lockoutEnabled"] = this.lockoutEnabled;
    data["accessFailedCount"] = this.accessFailedCount;
    return data;
  }
}

export interface IUser {
  id?: string | undefined;
  userName?: string | undefined;
  normalizedUserName?: string | undefined;
  email?: string | undefined;
  normalizedEmail?: string | undefined;
  emailConfirmed?: boolean | undefined;
  passwordHash?: string | undefined;
  securityStamp?: string | undefined;
  concurrencyStamp?: string | undefined;
  phoneNumber?: string | undefined;
  phoneNumberConfirmed?: boolean | undefined;
  twoFactorEnabled?: boolean | undefined;
  lockoutEnd?: Date | undefined;
  lockoutEnabled?: boolean | undefined;
  accessFailedCount?: number | undefined;
}

export class WorkplaceOrder implements IWorkplaceOrder {
  constructor(data?: IWorkplaceOrder) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  clientId?: number | undefined;
  workplaceId?: number | undefined;
  startTime?: Date | undefined;
  finishTime?: Date | undefined;
  sumToPay?: number | undefined;
  client?: Client | undefined;
  workplace?: Workplace | undefined;

  static fromJS(data: any): WorkplaceOrder {
    data = typeof data === "object" ? data : {};
    const result = new WorkplaceOrder();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.clientId = data["clientId"];
      this.workplaceId = data["workplaceId"];
      this.startTime = data["startTime"]
        ? new Date(data["startTime"].toString())
        : <any>undefined;
      this.finishTime = data["finishTime"]
        ? new Date(data["finishTime"].toString())
        : <any>undefined;
      this.sumToPay = data["sumToPay"];
      this.client = data["client"]
        ? Client.fromJS(data["client"])
        : <any>undefined;
      this.workplace = data["workplace"]
        ? Workplace.fromJS(data["workplace"])
        : <any>undefined;
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["clientId"] = this.clientId;
    data["workplaceId"] = this.workplaceId;
    data["startTime"] = this.startTime
      ? this.startTime.toLocaleString()
      : <any>undefined;
    data["finishTime"] = this.finishTime
      ? this.finishTime.toLocaleString()
      : <any>undefined;
    data["sumToPay"] = this.sumToPay;
    data["client"] = this.client ? this.client.toJSON() : <any>undefined;
    data["workplace"] = this.workplace
      ? this.workplace.toJSON()
      : <any>undefined;

    console.log(data);

    return data;
  }
}

export interface IWorkplaceOrder {
  id?: number | undefined;
  clientId?: number | undefined;
  workplaceId?: number | undefined;
  startTime?: Date | undefined;
  finishTime?: Date | undefined;
  sumToPay?: number | undefined;
  client?: Client | undefined;
  workplace?: Workplace | undefined;
}

export class WorkplaceParameter implements IWorkplaceParameter {
  constructor(data?: IWorkplaceParameter) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  clientId?: number | undefined;
  equipmentId?: number | undefined;
  count?: number | undefined;
  priority?: number | undefined;
  client?: Client | undefined;
  equipment?: Equipment | undefined;

  static fromJS(data: any): WorkplaceParameter {
    data = typeof data === "object" ? data : {};
    const result = new WorkplaceParameter();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.clientId = data["clientId"];
      this.equipmentId = data["equipmentId"];
      this.count = data["count"];
      this.priority = data["priority"];
      this.client = data["client"]
        ? Client.fromJS(data["client"])
        : <any>undefined;
      this.equipment = data["equipment"]
        ? Equipment.fromJS(data["equipment"])
        : <any>undefined;
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["clientId"] = this.clientId;
    data["equipmentId"] = this.equipmentId;
    data["count"] = this.count;
    data["priority"] = this.priority;
    data["client"] = this.client ? this.client.toJSON() : <any>undefined;
    data["equipment"] = this.equipment
      ? this.equipment.toJSON()
      : <any>undefined;
    return data;
  }
}

export interface IWorkplaceParameter {
  id?: number | undefined;
  clientId?: number | undefined;
  equipmentId?: number | undefined;
  count?: number | undefined;
  priority?: number | undefined;
  client?: Client | undefined;
  equipment?: Equipment | undefined;
}

export class WorkplaceEquipment implements IWorkplaceEquipment {
  constructor(data?: IWorkplaceEquipment) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  equipmentId?: number | undefined;
  workplaceId?: number | undefined;
  count?: number | undefined;
  equipment?: Equipment | undefined;
  workplace?: Workplace | undefined;

  static fromJS(data: any): WorkplaceEquipment {
    data = typeof data === "object" ? data : {};
    const result = new WorkplaceEquipment();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.equipmentId = data["equipmentId"];
      this.workplaceId = data["workplaceId"];
      this.count = data["count"];
      this.equipment = data["equipment"]
        ? Equipment.fromJS(data["equipment"])
        : <any>undefined;
      this.workplace = data["workplace"]
        ? Workplace.fromJS(data["workplace"])
        : <any>undefined;
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["equipmentId"] = this.equipmentId;
    data["workplaceId"] = this.workplaceId;
    data["count"] = this.count;
    data["equipment"] = this.equipment
      ? this.equipment.toJSON()
      : <any>undefined;
    data["workplace"] = this.workplace
      ? this.workplace.toJSON()
      : <any>undefined;
    return data;
  }
}

export interface IWorkplaceEquipment {
  id?: number | undefined;
  equipmentId?: number | undefined;
  workplaceId?: number | undefined;
  count?: number | undefined;
  equipment?: Equipment | undefined;
  workplace?: Workplace | undefined;
}

export class Client implements IClient {
  constructor(data?: IClient) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  birthday?: Date | undefined;
  passportNumber?: number | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  hight?: number | undefined;
  vision?: number | undefined;
  tableHight?: number | undefined;
  chairHight?: number | undefined;
  light?: number | undefined;
  temperature?: number | undefined;
  music?: string | undefined;
  drink?: string | undefined;
  isInBlackList?: number | undefined;
  sale?: number | undefined;
  identityId?: string | undefined;
  identity?: User | undefined;
  workplaceOrder?: WorkplaceOrder[] | undefined;

  static fromJS(data: any): Client {
    data = typeof data === "object" ? data : {};
    const result = new Client();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.firstName = data["firstName"];
      this.lastName = data["lastName"];
      this.birthday = data["birthday"]
        ? new Date(data["birthday"].toString())
        : <any>undefined;
      this.passportNumber = data["passportNumber"];
      this.phone = data["phone"];
      this.email = data["email"];
      this.hight = data["hight"];
      this.vision = data["vision"];
      this.tableHight = data["tableHight"];
      this.chairHight = data["chairHight"];
      this.light = data["light"];
      this.temperature = data["temperature"];
      this.music = data["music"];
      this.drink = data["drink"];
      this.isInBlackList = data["isInBlackList"];
      this.sale = data["sale"];
      this.identityId = data["identityId"];
      this.identity = data["identity"]
        ? User.fromJS(data["identity"])
        : <any>undefined;
      if (
        data["workplaceOrder"] &&
        data["workplaceOrder"].constructor === Array
      ) {
        this.workplaceOrder = [];
        for (const item of data["workplaceOrder"]) {
          this.workplaceOrder.push(WorkplaceOrder.fromJS(item));
        }
      }
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["firstName"] = this.firstName;
    data["lastName"] = this.lastName;
    data["birthday"] = this.birthday ? this.birthday : <any>undefined;
    data["passportNumber"] = this.passportNumber;
    data["phone"] = this.phone;
    data["email"] = this.email;
    data["hight"] = this.hight;
    data["vision"] = this.vision;
    data["tableHight"] = this.tableHight;
    data["chairHight"] = this.chairHight;
    data["light"] = this.light;
    data["temperature"] = this.temperature;
    data["music"] = this.music;
    data["drink"] = this.drink;
    data["isInBlackList"] = this.isInBlackList;
    data["sale"] = this.sale;
    data["identityId"] = this.identityId;
    data["identity"] = this.identity ? this.identity.toJSON() : <any>undefined;
    if (this.workplaceOrder && this.workplaceOrder.constructor === Array) {
      data["workplaceOrder"] = [];
      for (const item of this.workplaceOrder) {
        data["workplaceOrder"].push(item.toJSON());
      }
    }
    return data;
  }
}

export interface IClient {
  id?: number | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  birthday?: Date | undefined;
  passportNumber?: number | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  hight?: number | undefined;
  vision?: number | undefined;
  tableHight?: number | undefined;
  chairHight?: number | undefined;
  light?: number | undefined;
  temperature?: number | undefined;
  music?: string | undefined;
  drink?: string | undefined;
  isInBlackList?: number | undefined;
  sale?: number | undefined;
  identityId?: string | undefined;
  identity?: User | undefined;
  workplaceOrder?: WorkplaceOrder[] | undefined;
}

export class Equipment implements IEquipment {
  constructor(data?: IEquipment) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  id?: number | undefined;
  name?: string | undefined;
  description?: string | undefined;
  workplaceEquipment?: WorkplaceEquipment[] | undefined;

  static fromJS(data: any): Equipment {
    data = typeof data === "object" ? data : {};
    const result = new Equipment();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.name = data["name"];
      this.description = data["description"];
      if (
        data["workplaceEquipment"] &&
        data["workplaceEquipment"].constructor === Array
      ) {
        this.workplaceEquipment = [];
        for (const item of data["workplaceEquipment"]) {
          this.workplaceEquipment.push(WorkplaceEquipment.fromJS(item));
        }
      }
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["name"] = this.name;
    data["description"] = this.description;
    if (
      this.workplaceEquipment &&
      this.workplaceEquipment.constructor === Array
    ) {
      data["workplaceEquipment"] = [];
      for (const item of this.workplaceEquipment) {
        data["workplaceEquipment"].push(item.toJSON());
      }
    }
    return data;
  }
}

export interface IEquipment {
  id?: number | undefined;
  name?: string | undefined;
  description?: string | undefined;
  workplaceEquipment?: WorkplaceEquipment[] | undefined;
}

export interface IBuildingSearchingResult {
  building?: Building | undefined;
  workplaceSearchingResults?: WorkplaceSearchingResult[] | undefined;
}

export class BuildingSearchingResult implements IBuildingSearchingResult {
  constructor(data?: IBuildingSearchingResult) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  building?: Building | undefined;
  workplaceSearchingResults?: WorkplaceSearchingResult[] | undefined;

  static fromJS(data: any): BuildingSearchingResult {
    data = typeof data === "object" ? data : {};
    const result = new BuildingSearchingResult();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.building = data["building"]
        ? Building.fromJS(data["building"])
        : <any>undefined;
      if (
        data["workplaceSearchingResults"] &&
        data["workplaceSearchingResults"].constructor === Array
      ) {
        this.workplaceSearchingResults = [];
        for (const item of data["workplaceSearchingResults"]) {
          this.workplaceSearchingResults.push(
            WorkplaceSearchingResult.fromJS(item)
          );
        }
      }
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["building"] = this.building ? this.building.toJSON() : <any>undefined;
    if (
      this.workplaceSearchingResults &&
      this.workplaceSearchingResults.constructor === Array
    ) {
      data["workplaceSearchingResults"] = [];
      for (const item of this.workplaceSearchingResults) {
        data["workplaceSearchingResults"].push(item.toJSON());
      }
    }
    return data;
  }
}

export class SearchingViewModel implements ISearchingViewModel {
  constructor(data?: ISearchingViewModel) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  radius?: number | undefined;
  wantedCost?: number | undefined;
  x?: number | undefined;
  y?: number | undefined;
  searchingModel?: SearchingModel[] | undefined;

  static fromJS(data: any): SearchingViewModel {
    data = typeof data === "object" ? data : {};
    const result = new SearchingViewModel();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.radius = data["radius"];
      this.wantedCost = data["wantedCost"];
      this.x = data["x"];
      this.y = data["y"];
      if (
        data["searchingModel"] &&
        data["searchingModel"].constructor === Array
      ) {
        this.searchingModel = [];
        for (const item of data["searchingModel"]) {
          this.searchingModel.push(SearchingModel.fromJS(item));
        }
      }
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["radius"] = this.radius;
    data["wantedCost"] = this.wantedCost;
    data["x"] = this.x;
    data["y"] = this.y;
    if (this.searchingModel && this.searchingModel.constructor === Array) {
      data["searchingModel"] = [];
      for (const item of this.searchingModel) {
        data["searchingModel"].push(item.toJSON());
      }
    }
    return data;
  }
}

export interface ISearchingViewModel {
  radius?: number | undefined;
  wantedCost?: number | undefined;
  x?: number | undefined;
  y?: number | undefined;
  searchingModel?: SearchingModel[] | undefined;
}

export class SearchingModel implements ISearchingModel {
  constructor(data?: ISearchingModel) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  equipmentId?: number | undefined;
  importancy?: number | undefined;

  static fromJS(data: any): SearchingModel {
    data = typeof data === "object" ? data : {};
    const result = new SearchingModel();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.equipmentId = data["equipmentId"];
      this.importancy = data["importancy"];
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["equipmentId"] = this.equipmentId;
    data["importancy"] = this.importancy;
    return data;
  }
}

export interface ISearchingModel {
  equipmentId?: number | undefined;
  importancy?: number | undefined;
}

export interface IWorkplaceSearchingResult {
  workplaceId?: number | undefined;
  equipmentAppropriation?: number | undefined;
  costAppropriation?: number | undefined;
}

export interface IFilter {
  startTime?: Date | undefined;
  finishTime?: Date | undefined;
  like?: string | undefined;
}

export class Filter {
  constructor(data?: IFilter) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.startTime = data["startTime"];
      this.finishTime = data["finishTime"];

    }
  }
  startTime?: Date | undefined;
  finishTime?: Date | undefined;
  like?: string | undefined;

  toJSON(filter) {
    let data;
    data["startTime"] = filter.startTime
      ? this.startTime.toLocaleString()
      : <any>undefined;
    data["finishTime"] = filter.finishTime
      ? this.finishTime.toLocaleString()
      : <any>undefined;


    console.log(data);

    return data;
  }
}

export class WorkplaceSearchingResult implements IWorkplaceSearchingResult {
  constructor(data?: IWorkplaceSearchingResult) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  workplaceId?: number | undefined;
  equipmentAppropriation?: number | undefined;
  costAppropriation?: number | undefined;

  static fromJS(data: any): WorkplaceSearchingResult {
    data = typeof data === "object" ? data : {};
    const result = new WorkplaceSearchingResult();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.workplaceId = data["workplaceId"];
      this.equipmentAppropriation = data["equipmentAppropriation"];
      this.costAppropriation = data["costAppropriation"];
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["workplaceId"] = this.workplaceId;
    data["equipmentAppropriation"] = this.equipmentAppropriation;
    data["costAppropriation"] = this.costAppropriation;

    return data;
  }
}

export class FindedWorkplace implements IFindedWorkplace {
  constructor(data?: IFindedWorkplace) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
  workplaceId?: number | undefined;
  appropriationPercentage?: number | undefined;
  appropriationColor?: string | undefined;
  costColor?: string | undefined;

  static fromJS(data: any): FindedWorkplace {
    data = typeof data === "object" ? data : {};
    const result = new FindedWorkplace();
    result.init(data);
    return result;
  }

  init(data?: any) {
    if (data) {
      this.workplaceId = data["workplaceId"];
      this.appropriationPercentage = data["appropriationPercentage"];
      this.appropriationColor = data["appropriationColor"];
      this.costColor = data["costColor"];
    }
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["workplaceId"] = this.workplaceId;
    data["appropriationPercentage"] = this.appropriationPercentage;
    data["appropriationColor"] = this.appropriationColor;
    data["costColor"] = this.costColor;
    return data;
  }
}

export interface IFindedWorkplace {
  workplaceId?: number | undefined;
  appropriationPercentage?: number | undefined;
  appropriationColor?: string | undefined;
  costColor?: string | undefined;
}
export class CurseValues {
  ccy: string;
  base_ccy: string;
  buy: number;
  sale: number;
}
export class SwaggerException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any };
  result: any;

  constructor(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result: any
  ) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isSwaggerException = true;

  static isSwaggerException(obj: any): obj is SwaggerException {
    return obj.isSwaggerException === true;
  }
}

function throwException(
  message: string,
  status: number,
  response: string,
  headers: { [key: string]: any },
  result?: any
): Observable<any> {
  if (result !== null && result !== undefined) {
    return _observableThrow(result);
  } else {
    return _observableThrow(
      new SwaggerException(message, status, response, headers, null)
    );
  }
}

function blobToText(blob: any): Observable<string> {
  return new Observable<string>((observer: any) => {
    if (!blob) {
      observer.next("");
      observer.complete();
    } else {
      const reader = new FileReader();
      reader.onload = function () {
        observer.next(this.result);
        observer.complete();
      };
      reader.readAsText(blob);
    }
  });
}

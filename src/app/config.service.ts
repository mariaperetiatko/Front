import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    _apiURI: string;

    constructor() {
        this._apiURI = 'https://172.29.186.125/api';
     }

     getApiURI() {
         return this._apiURI;
     }
}

import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    _apiURI: string;

    constructor() {
        this._apiURI = 'https://172.29.185.238/api';
     }

     getApiURI() {
         return this._apiURI;
     }
}

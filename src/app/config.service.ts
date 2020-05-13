import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    _apiURI: string;

    constructor() {
        this._apiURI = 'https://192.168.1.4:45456/api';
     }

     getApiURI() {
         return this._apiURI;
     }
}

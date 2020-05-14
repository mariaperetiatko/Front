import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    _apiURI: string;

    constructor() {
        this._apiURI = 'https://aapz-backend.conveyor.cloud/api';
     }

     getApiURI() {
         return this._apiURI;
     }
}

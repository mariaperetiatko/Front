import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    _apiURI: string;

    constructor() {
        this._apiURI = 'https://aapz-backend.conveyor.cloud/api';
        //this._apiURI = 'https://192.168.1.4:45490/api';
        this._apiURI = 'https://localhost:44333/api';


     }

     getApiURI() {
         return this._apiURI;
     }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LocalidadeModel } from "../interfaces/uteis.interface";
import { EndpointService } from "./endpoint.service";


@Injectable({
    providedIn: 'root'
})

export class ViaCepService {

    constructor(
        private _http: HttpClient,
        private _endpointService: EndpointService) { }

    private _obterHeaders(): any {
        return {
            'Content-Type': 'application/json',
        };
    }

    getLocalidadeByCep(cep: number): Observable<LocalidadeModel> {
        let url = this._endpointService.GetUrlViaCep(cep, 'json');
        return this._http
            .get<LocalidadeModel>(url, {
                observe: 'response',
                headers: this._obterHeaders()
            })
            .pipe(
                map(res => {
                    return res.body;
                })
            );
    }
}
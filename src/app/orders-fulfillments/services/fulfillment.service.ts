import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';
import { Fulfillment } from '../model/fulfillment.entity';
import { FulfillmentAssembler } from './fulfillment.assembler';
import {FulfillmentResponse} from './fulfillment.response';



@Injectable({
  providedIn: 'root'
})
export class FulfillmentService extends BaseService<FulfillmentResponse> {
  constructor() {
    super('/fulfillments');
  }

  getAllFulfillments(): Observable<Fulfillment[]> {
    return this.getAll().pipe(
      map((response: FulfillmentResponse[]) =>
        response.map(fulfillmentResponse =>
          FulfillmentAssembler.toEntityFromResource(fulfillmentResponse)
        )
      )
    );
  }

}

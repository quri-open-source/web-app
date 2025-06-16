import { Component } from '@angular/core';
import {SearchBarComponent} from '../../../product-catalog/components/search-bar.component/search-bar.component';
import {ProductsViewComponent} from '../../../product-catalog/components/products-view.component/products-view.component';

@Component({
  selector: 'app-explore',
  imports: [
    SearchBarComponent,
    ProductsViewComponent
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})

export class ExploreComponent {

}

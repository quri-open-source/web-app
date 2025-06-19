import {Component, OnInit} from '@angular/core';
import { SearchBarComponent } from '../../../product-catalog/components/search-bar.component/search-bar.component';
import {CatalogComponent} from "../../../product-catalog/components/catalog.component/catalog.component";
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
      SearchBarComponent,
      CatalogComponent,
      CommonModule,
      MatButtonModule
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {

}

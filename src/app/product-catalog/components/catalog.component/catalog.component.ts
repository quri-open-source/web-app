import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product.entity';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailDialogComponent } from '../product-detail-dialog/product-detail-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CartService } from '../../../orders-fulfillments/services/cart.service';
import { UserService } from '../../../user-management/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-catalog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatIcon,
    MatDialogModule
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private cartService: CartService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.productService.getAllProductsWithProjects().subscribe((products) => {
      this.products = products;
      this.cdr.detectChanges();
    });
  }

  openDetail(product: Product) {
    this.dialog.open(ProductDetailDialogComponent, {
      data: product,
      backdropClass: 'custom-dialog-backdrop',
      panelClass: 'custom-dialog-panel',
      hasBackdrop: true
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.snackBar.open('Producto agregado al carrito', 'Cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
      },
      error: () => {
        this.snackBar.open('Error al agregar al carrito', 'Cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    });
  }
}

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
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../iam/services/authentication.service';

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
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
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
    // Get current user from localStorage (IAM system)
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.snackBar.open('No active user. Please log in.', 'Close', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    console.log('Adding product to cart for user:', userId);

    this.cartService.addToCart(product, userId).subscribe({
      next: () => {
        this.snackBar.open('Product added to cart', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        this.snackBar.open('Error adding product to cart', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    });
  }
}

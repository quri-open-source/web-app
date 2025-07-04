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
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-catalog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatIcon,
    MatDialogModule,
    TranslateModule
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
    private authService: AuthenticationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.productService.getAllProductsWithProjects().subscribe((products: Product[]) => {
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
      this.translate.get('auth.sign_in_required').subscribe((message: string) => {
        this.snackBar.open(message || 'No active user. Please log in.', this.translate.instant('common.close'), {
          duration: 2000,
          verticalPosition: 'top',
        });
      });
      return;
    }

    console.log('Adding product to cart for user:', userId);

    this.cartService.addToCart(product, userId).subscribe({
      next: () => {
        this.translate.get('product.product_added_to_cart').subscribe((message: string) => {
          this.snackBar.open(message || 'Product added to cart', this.translate.instant('common.close'), {
            duration: 2000,
            verticalPosition: 'top',
          });
        });
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        this.translate.get('errors.operation_failed').subscribe((message: string) => {
          this.snackBar.open(message || 'Error adding product to cart', this.translate.instant('common.close'), {
            duration: 2000,
            verticalPosition: 'top',
          });
        });
      }
    });
  }
}

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
import { UserDomainService } from '../../../access-security/services/user-domain.service';

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
    private snackBar: MatSnackBar,
    private userDomainService: UserDomainService
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
    const currentUser = this.userDomainService.getCurrentUser();
    if (!currentUser) {
      this.snackBar.open('No active user. Please log in.', 'Close', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }
    this.cartService.addToCart(product, currentUser.id).subscribe({
      next: () => {
        this.snackBar.open('Product added to cart', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      },
      error: () => {
        this.snackBar.open('Error adding product to cart', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    });
  }
}

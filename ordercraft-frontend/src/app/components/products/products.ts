import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  newProduct: Product = {
    productName: '',
    description: '',
    price: 0
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load products from server.';
      }
    });
  }

  addProduct(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newProduct.productName?.trim()) {
      this.errorMessage = 'Product name is required.';
      return;
    }

    if (!this.newProduct.description?.trim()) {
      this.errorMessage = 'Description is required.';
      return;
    }

    if (this.newProduct.price === null || this.newProduct.price === undefined || this.newProduct.price < 0) {
      this.errorMessage = 'Please enter a valid non-negative price.';
      return;
    }

    this.isSubmitting = true;

    this.productService.createProduct({
      productName: this.newProduct.productName.trim(),
      description: this.newProduct.description.trim(),
      price: Number(this.newProduct.price)
    }).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.successMessage = `Product "${created.productName}" added successfully.`;
        this.newProduct = {
          productName: '',
          description: '',
          price: 0
        };
        this.loadProducts();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create product.';
      }
    });
  }

  deleteProduct(id?: number): void {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.productService.deleteProduct(id).subscribe({
      next: (msg) => {
        this.successMessage = msg || 'Product deleted successfully.';
        this.loadProducts();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete product.';
      }
    });
  }
}

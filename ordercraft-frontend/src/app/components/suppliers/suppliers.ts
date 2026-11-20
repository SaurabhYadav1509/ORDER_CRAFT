import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupplierService } from '../../services/supplier';
import { Supplier } from '../../models/supplier';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class Suppliers implements OnInit {
  suppliers: Supplier[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  newSupplier: Supplier = {
    supplierName: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load suppliers from server.';
      }
    });
  }

  addSupplier(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newSupplier.supplierName?.trim()) {
      this.errorMessage = 'Contact person name is required.';
      return;
    }

    if (!this.newSupplier.company?.trim()) {
      this.errorMessage = 'Company name is required.';
      return;
    }

    if (!this.newSupplier.email?.trim() || !this.newSupplier.email.includes('@')) {
      this.errorMessage = 'Please provide a valid email address.';
      return;
    }

    if (!this.newSupplier.phone?.trim()) {
      this.errorMessage = 'Phone number is required.';
      return;
    }

    if (!this.newSupplier.address?.trim()) {
      this.errorMessage = 'Address is required.';
      return;
    }

    this.isSubmitting = true;

    this.supplierService.createSupplier({
      supplierName: this.newSupplier.supplierName.trim(),
      company: this.newSupplier.company.trim(),
      email: this.newSupplier.email.trim(),
      phone: this.newSupplier.phone.trim(),
      address: this.newSupplier.address.trim()
    }).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.successMessage = `Supplier "${created.company}" (${created.supplierName}) added successfully.`;
        this.newSupplier = {
          supplierName: '',
          company: '',
          email: '',
          phone: '',
          address: ''
        };
        this.loadSuppliers();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create supplier.';
      }
    });
  }

  deleteSupplier(id?: number): void {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this supplier?')) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.supplierService.deleteSupplier(id).subscribe({
      next: (msg) => {
        this.successMessage = msg || 'Supplier deleted successfully.';
        this.loadSuppliers();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete supplier.';
      }
    });
  }
}

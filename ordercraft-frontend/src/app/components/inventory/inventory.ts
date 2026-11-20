import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory';
import { Inventory } from '../../models/inventory';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class InventoryComponent implements OnInit {
  inventoryItems: Inventory[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  newInventory: Inventory = {
    materialName: '',
    quantity: 0,
    unit: '',
    reorderLevel: 0
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.inventoryService.getAllInventory().subscribe({
      next: (data) => {
        this.inventoryItems = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load inventory from server.';
      }
    });
  }

  get lowStockCount(): number {
    return this.inventoryItems.filter((item) => item.quantity <= item.reorderLevel).length;
  }

  isLowStock(item: Inventory): boolean {
    return item.quantity <= item.reorderLevel;
  }

  addInventory(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newInventory.materialName?.trim()) {
      this.errorMessage = 'Material / Item name is required.';
      return;
    }

    if (this.newInventory.quantity === null || this.newInventory.quantity === undefined || this.newInventory.quantity < 0) {
      this.errorMessage = 'Quantity must be a valid non-negative number.';
      return;
    }

    if (!this.newInventory.unit?.trim()) {
      this.errorMessage = 'Unit (e.g. kg, pcs, boxes) is required.';
      return;
    }

    if (this.newInventory.reorderLevel === null || this.newInventory.reorderLevel === undefined || this.newInventory.reorderLevel < 0) {
      this.errorMessage = 'Reorder level must be a valid non-negative number.';
      return;
    }

    this.isSubmitting = true;

    this.inventoryService.createInventory({
      materialName: this.newInventory.materialName.trim(),
      quantity: Number(this.newInventory.quantity),
      unit: this.newInventory.unit.trim(),
      reorderLevel: Number(this.newInventory.reorderLevel)
    }).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.successMessage = `Inventory record for "${created.materialName}" added successfully.`;
        this.newInventory = {
          materialName: '',
          quantity: 0,
          unit: '',
          reorderLevel: 0
        };
        this.loadInventory();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create inventory record.';
      }
    });
  }

  deleteInventory(id?: number): void {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this inventory record?')) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.inventoryService.deleteInventory(id).subscribe({
      next: (msg) => {
        this.successMessage = msg || 'Inventory record deleted successfully.';
        this.loadInventory();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete inventory record.';
      }
    });
  }
}

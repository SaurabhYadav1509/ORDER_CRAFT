import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialService } from '../../services/material';
import { Material } from '../../models/material';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './materials.html',
  styleUrl: './materials.css'
})
export class Materials implements OnInit {
  materials: Material[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  newMaterial: Material = {
    materialName: '',
    description: '',
    unit: '',
    unitPrice: 0
  };

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.materialService.getMaterials().subscribe({
      next: (data) => {
        this.materials = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load materials from server.';
      }
    });
  }

  addMaterial(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newMaterial.materialName?.trim()) {
      this.errorMessage = 'Material name is required.';
      return;
    }

    if (!this.newMaterial.description?.trim()) {
      this.errorMessage = 'Description is required.';
      return;
    }

    if (!this.newMaterial.unit?.trim()) {
      this.errorMessage = 'Unit (e.g. kg, pcs, meters) is required.';
      return;
    }

    if (this.newMaterial.unitPrice === null || this.newMaterial.unitPrice === undefined || this.newMaterial.unitPrice < 0) {
      this.errorMessage = 'Please enter a valid non-negative unit price.';
      return;
    }

    this.isSubmitting = true;

    this.materialService.createMaterial({
      materialName: this.newMaterial.materialName.trim(),
      description: this.newMaterial.description.trim(),
      unit: this.newMaterial.unit.trim(),
      unitPrice: Number(this.newMaterial.unitPrice)
    }).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.successMessage = `Material "${created.materialName}" added successfully.`;
        this.newMaterial = {
          materialName: '',
          description: '',
          unit: '',
          unitPrice: 0
        };
        this.loadMaterials();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create material.';
      }
    });
  }

  deleteMaterial(id?: number): void {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this material?')) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.materialService.deleteMaterial(id).subscribe({
      next: (msg) => {
        this.successMessage = msg || 'Material deleted successfully.';
        this.loadMaterials();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete material.';
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/models/supplier';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html'
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  loading = true;

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getAll().subscribe({
      next: (data:any) => {
        this.suppliers = data;
        this.loading = false;
      },
      error: (err:any) => {
        console.error('Erreur fournisseurs:', err);
        this.loading = false;
      }
    });
  }

  deleteSupplier(id: number | undefined): void {
    if (id && confirm('Supprimer ce fournisseur ?')) {
      this.supplierService.delete(id).subscribe(() => {
        this.suppliers = this.suppliers.filter(s => s.id !== id);
      });
    }
  }
}

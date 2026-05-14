import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filter: string = 'all';
  loading: boolean = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(type: string = 'all'): void {
    this.filter = type;
    this.loading = true;

    let obs: Observable<Product[]>;
    if (type === 'spare-parts') obs = this.productService.getSpareParts();
    else if (type === 'cars') obs = this.productService.getCars();
    else obs = this.productService.getAll();

    obs.subscribe({
      next: (data:any) => {
        this.products = data;
        this.loading = false;
      },
      error: (err:any) => {
        console.error('Erreur lors du chargement des produits', err);
        this.loading = false;
      }
    });
  }

  onDelete(id: number | undefined): void {
    if (id && confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err:any) => alert('Erreur lors de la suppression')
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // 👈 Importe le Router
import { CustomerService } from '../../services/customer.service';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;

  // 👈 Ajoute le router au constructeur
  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients', err);
        this.loading = false;
      }
    });
  }

  // 👈 Ajoute cette méthode pour la redirection
  onEdit(id: number): void {
    this.router.navigate(['/admin/customers/edit', id]);
  }

  // 👈 Ta méthode delete qui fonctionne déjà
  onDelete(id: number): void {
    if(confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== id);
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  // Optionnel: Pour le bouton "Nouveau Client"
  onCreate(): void {
    this.router.navigate(['/admin/customers/new']);
  }
}

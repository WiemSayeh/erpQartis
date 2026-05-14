import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent implements OnInit {
  // Initialisation d'un objet vide pour éviter les erreurs "undefined" dans le HTML
  customer: any = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    loyaltyPoints: 0,
    totalSpent: 0
  };

  isEditMode = false;
  loading = false;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router // Gardé en private pour la propreté
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loading = true;
      this.customerService.getCustomerById(id).subscribe({
        next: (data) => {
          this.customer = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur chargement client', err);
          this.loading = false;
        }
      });
    }
  }
onSubmit(): void {
  // On construit l'objet en incluant TOUS les champs obligatoires du modèle Customer
  const customerToSave: Customer = {
    id: this.customer.id,
    fullName: this.customer.fullName,
    email: this.customer.email,
    phone: this.customer.phone,
    address: this.customer.address,
    isActive: this.customer.isActive !== undefined ? this.customer.isActive : true,
    loyaltyPoints: this.customer.loyaltyPoints || 0,
    totalSpent: this.customer.totalSpent || 0,
    role: this.customer.role || 'CUSTOMER' // 👈 Ajoute cette ligne ici
  };

  if (this.isEditMode) {
    this.customerService.updateCustomer(customerToSave.id, customerToSave).subscribe({
      next: () => this.router.navigate(['/admin/customers']),
      error: (err) => alert('Erreur lors de la mise à jour')
    });
  } else {
    this.customerService.createCustomer(customerToSave).subscribe({
      next: () => this.router.navigate(['/admin/customers']),
      error: (err) => alert('Erreur lors de la création')
    });
  }
}

  // Cette méthode règle ton erreur "Property router is private"
  onCancel(): void {
    this.router.navigate(['/admin/customers']);
  }
}

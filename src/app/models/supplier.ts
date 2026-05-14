export interface Supplier {
  id?: number;
  companyName: string;   // Changé: était 'name'
  telephone: string;     // Changé: était 'phoneNumber'
  email: string;
  address: string;
  productCount?: number; // Ajouté pour correspondre au DTO
}

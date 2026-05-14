
export interface Customer {
  id: number;
  fullName:string;
  phone:string;
  address:string;
  email: string;
  role: string;
  isActive: boolean;
  loyaltyPoints: number;
  totalSpent: number;
  // On peut ajouter les longueurs des listes pour l'affichage
  cars?: any[];
  orders?: any[];
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  reference: string;
  price: number;
  discount: number;
  stockQuantity: number;
  image: string;
  brand: string;
  createdAt: Date;
  status: string;
  productType: 'CAR' | 'SPARE_PART';
  stockLocation: string;

  // Spécifique SparePart
  oemNumber?: string;
  warrantyMonths?: number;

  // Spécifique Car
  model?: string;
  year?: number;
  engineType?: string;
  transmission?: string;
  fuelType?: string;
}

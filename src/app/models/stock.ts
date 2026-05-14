export interface Stock {
  id: number;
  productId: number;
  productName?: string;
  location: string;
  quantityAvailable: number;
  reorderThreshold: number;
  needsReorder: boolean;

  // Propriété temporaire pour l'input d'ajustement
  adjustAmount?: number;
}

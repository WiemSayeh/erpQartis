import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html'
})
export class StockListComponent implements OnInit {
  stocks: Stock[] = [];
  loading = true;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.stockService.getAll().subscribe({
      next: (data) => {
        this.stocks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur Stock:', err);
        this.loading = false;
      }
    });
  }

  onAdjust(id: number | undefined, amount: number): void {
    if (!id || amount === 0) return;

    this.stockService.adjustQuantity(id, amount).subscribe({
      next: () => {
        this.loadStocks();
        // Réinitialiser l'input après ajustement
        this.stocks = this.stocks.map(s => s.id === id ? {...s, adjustAmount: 0} : s);
      },
      error: (err) => console.error('Erreur Ajustement:', err)
    });
  }

  onDelete(id: number | undefined): void {
    if (!id) return;

    if (confirm('Supprimer cet article du stock ?')) {
      this.stockService.delete(id).subscribe(() => {
        this.stocks = this.stocks.filter(s => s.id !== id);
      });
    }
  }
}

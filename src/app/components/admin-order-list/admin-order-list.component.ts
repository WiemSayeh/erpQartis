import { Component, OnInit } from '@angular/core';
import { OrderDTO } from 'src/app/models/OrderDTO';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './admin-order-list.component.html',
   styleUrls: ['./admin-order-list.component.css']
})
export class AdminOrderListComponent implements OnInit {
  orders: OrderDTO[] = [];
  statusFilter: string = '';
  customerIdFilter: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.filterOrders(this.statusFilter, this.customerIdFilter ?? undefined)
      .subscribe(res => this.orders = res);
  }

  updateStatus(order: OrderDTO, status: string) {
    this.orderService.updateStatus(order.id, status).subscribe(() => this.loadOrders());
  }

  cancelOrder(order: OrderDTO) {
    if (!confirm('Confirmer l\'annulation par admin ?')) return;
    this.orderService.cancelOrder(order.id).subscribe(() => this.loadOrders());
  }

  deleteOrder(order: OrderDTO) {
    if (!confirm('Supprimer définitivement cette commande ?')) return;
    this.orderService.deleteOrder(order.id).subscribe(() => this.loadOrders());
  }
}

import { OrderItemDTO } from "./OrderItemDTO";

export interface OrderDTO {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  customerId: number;
  customerName: string;
  transactionCode: string;
  invoiceNumber: string;
  items: OrderItemDTO[];
}

import { Store } from "../store/entities/store.entity";
import { Order } from "./entities/order.entity";

declare module "@medusajs/medusa/dist/models/order" {
  declare interface Order {
    store_id: string;
    order_parent_id: string;
    store: Store;
    parent: Order;
    children: Order[];
  }
}

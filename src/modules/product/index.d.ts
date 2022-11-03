import { default as ExtendedProductRepository } from "./product.repository";
import { Store } from "../store/entities/store.entity";

declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    parent_sku: number;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    store_id: string;
    store: Store;
  }
}

declare module "@medusajs/medusa/dist/repositories/product" {
  declare class ProductRepository extends ExtendedProductRepository {}
}

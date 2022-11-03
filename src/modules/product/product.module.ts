import { Module } from "medusa-extender";
import { ProductMigration1661113836183 } from "./migrations/1661113836183-product.migration";
import { ProductMigration1660997169735 } from "./migrations/1660997169735-product.migration";
import { Product } from "./product.entity";
import ProductRepository from "./product.repository";
import ProductService from "./product.service";
import addStoreIdToProduct1658147433000 from "./migrations/product.migration";
import AttachProductSubscribersMiddleware from "./product.middleware";
import { ExtendedCreateProductValidator } from "./product.validator";

@Module({
  imports: [
    Product,
    ProductRepository,
    ProductService,
    addStoreIdToProduct1658147433000,
    AttachProductSubscribersMiddleware,
    ProductMigration1660997169735,
    ExtendedCreateProductValidator,
    ProductMigration1661113836183,
  ],
})
export class ProductModule {}

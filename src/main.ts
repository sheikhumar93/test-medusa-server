import express = require("express");
const config = require("../medusa-config");
import { Medusa } from "medusa-extender";
import { resolve } from "path";
import { ProductModule } from "./modules/product/product.module";
import { StoreModule } from "./modules/store/store.module";
import { UserModule } from "./modules/user/user.module";
import { OrderModule } from "./modules/order/order.module";
// import { ProductCollectionModule } from "./modules/collection/collection.module";
// import { ProductVariantModule } from "./modules/productVariant/productVariant.module";
// import { PricingModule } from "./modules/pricing/pricing.module";

async function bootstrap() {
  const expressInstance = express();

  await new Medusa(resolve(__dirname, ".."), expressInstance).load([
    ProductModule,
    StoreModule,
    UserModule,
    OrderModule,
    // ProductCollectionModule,
    // ProductVariantModule,
    // PricingModule,
  ]);

  const port = config?.serverConfig?.port ?? 9000;
  expressInstance.listen(port, () => {
    console.info("Server successfully started on port " + port);
  });
}

bootstrap();

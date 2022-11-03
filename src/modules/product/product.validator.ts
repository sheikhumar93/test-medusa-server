import { Validator } from "medusa-extender";
import { AdminPostProductsReq } from "@medusajs/medusa";
import { IsNumber, IsString } from "class-validator";

@Validator({ override: AdminPostProductsReq })
export class ExtendedCreateProductValidator extends AdminPostProductsReq {
  @IsNumber()
  parent_sku: number;

  @IsString()
  seo_title: string;

  @IsString()
  seo_description: string;

  @IsString()
  seo_keywords: string;
}

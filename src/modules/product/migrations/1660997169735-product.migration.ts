import { MigrationInterface, QueryRunner } from "typeorm";
import { Migration } from "medusa-extender";

@Migration()
export class ProductMigration1660997169735 implements MigrationInterface {
  name = "ProductMigration1660997169735";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query =
      'ALTER TABLE public."product" ADD COLUMN IF NOT EXISTS "parent_sku" INTEGER;';
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = 'ALTER TABLE public."product" DROP COLUMN "parent_sku";';
    await queryRunner.query(query);
  }
}

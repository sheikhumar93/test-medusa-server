import { MigrationInterface, QueryRunner } from "typeorm";
import { Migration } from "medusa-extender";

@Migration()
export class ProductMigration1661113836183 implements MigrationInterface {
  name = "ProductMigration1661113836183";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query =
      'ALTER TABLE public."product" ADD COLUMN IF NOT EXISTS "seo_title" VARCHAR, ADD COLUMN IF NOT EXISTS "seo_description" VARCHAR, ADD COLUMN IF NOT EXISTS "seo_keywords" VARCHAR;';
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query =
      'ALTER TABLE public."product" DROP COLUMN "seo_title", DROP COLUMN "seo_description", DROP COLUMN "seo_keywords";';
    await queryRunner.query(query);
  }
}

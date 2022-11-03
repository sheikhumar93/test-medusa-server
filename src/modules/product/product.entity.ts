import { Product as MedusaProduct } from "@medusajs/medusa/dist";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Entity as MedusaEntity } from "medusa-extender";
import { Store } from "../store/entities/store.entity";

@MedusaEntity({ override: MedusaProduct })
@Entity()
export class Product extends MedusaProduct {
  // @Column({ type: "int", nullable: false })
  @Column()
  parent_sku: number;

  // @Column({ type: "varchar", nullable: true })
  @Column()
  seo_title: string | null;

  // @Column({ type: "varchar", nullable: true })
  @Column()
  seo_description: string | null;

  // @Column({ type: "varchar", nullable: true })
  @Column()
  seo_keywords: string | null;

  @Index()
  @Column({ nullable: false })
  store_id: string;

  @ManyToOne(() => Store, (store) => store.members)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store: Store;
}

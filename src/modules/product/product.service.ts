import {
  Service,
  OnMedusaEntityEvent,
  EntityEventType,
  MedusaEventHandlerParams,
} from "medusa-extender";
import { EntityManager } from "typeorm";
import { ProductService as MedusaProductService } from "@medusajs/medusa/dist/services";
import { Product } from "./product.entity";
import { User } from "../user/entities/user.entity";
import UserService from "../user/services/user.service";
import { Selector } from "@medusajs/medusa/dist/types/common";
import {
  FilterableProductProps,
  FindProductConfig,
} from "@medusajs/medusa/dist/types/product";
import ProductVariantService from "@medusajs/medusa/dist/services/product-variant";
import { ProductVariantRepository } from "@medusajs/medusa/dist/repositories/product-variant";
import { ProductOptionRepository } from "@medusajs/medusa/dist/repositories/product-option";
import EventBusService from "@medusajs/medusa/dist/services/event-bus";
import ProductCollectionService from "@medusajs/medusa/dist/services/product-collection";
import { ProductTypeRepository } from "@medusajs/medusa/dist/repositories/product-type";
import { ProductTagRepository } from "@medusajs/medusa/dist/repositories/product-tag";
import { ImageRepository } from "@medusajs/medusa/dist/repositories/image";
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router";
import DefaultSearchService from "@medusajs/medusa/dist/services/search";
import ProductRepository from "./product.repository";

interface ConstructorParams<
  TSearchService extends DefaultSearchService = DefaultSearchService
> {
  manager: EntityManager;
  loggedInUser?: User;
  productRepository: typeof ProductRepository;
  productVariantRepository: typeof ProductVariantRepository;
  productOptionRepository: typeof ProductOptionRepository;
  eventBusService: EventBusService;
  productVariantService: ProductVariantService;
  productCollectionService: ProductCollectionService;
  productTypeRepository: typeof ProductTypeRepository;
  productTagRepository: typeof ProductTagRepository;
  imageRepository: typeof ImageRepository;
  featureFlagRouter: FlagRouter;
  searchService: TSearchService;
  userService: UserService;
}

@Service({ scope: "SCOPED", override: MedusaProductService })
export default class ProductService extends MedusaProductService {
  private readonly manager: EntityManager;
  private readonly productRepository: typeof ProductRepository;

  constructor(readonly container: ConstructorParams) {
    super(container);
    this.manager = container.manager;
    this.productRepository = container.productRepository;
  }

  protected prepareListQuery_(
    selector: FilterableProductProps | Selector<Product>,
    config: FindProductConfig
  ) {
    if (Object.keys(this.container).includes("loggedInUser")) {
      selector["store_id"] = this.container.loggedInUser.store_id;
    }
    return super.prepareListQuery_(selector, config);
  }

  @OnMedusaEntityEvent.Before.Insert(Product, { async: true })
  public async attachStoreToProduct(
    params: MedusaEventHandlerParams<Product, "Insert">
  ): Promise<EntityEventType<Product, "Insert">> {
    const { event } = params;
    const loggedInUser = this.container.loggedInUser;
    event.entity.store_id = loggedInUser.store_id;
    return event;
  }

  async list(
    selector: FilterableProductProps | Selector<Product> = {},
    config: FindProductConfig = {
      relations: [],
      skip: 0,
      take: 20,
      include_discount_prices: false,
    }
  ): Promise<Product[]> {
    const productRepo = this.manager.getCustomRepository(
      this.productRepository
    );
    console.log(selector, config);
    const { q, query, relations } = this.prepareListQuery_(selector, config);
    if (q) {
      const [products] = await productRepo.getFreeTextSearchResultsAndCount(
        q,
        query,
        relations
      );
      return products;
    }
    console.log(query, relations);
    return await productRepo.findWithRelations(relations, query);
  }
}

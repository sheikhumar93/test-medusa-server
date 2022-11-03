import { Service } from "medusa-extender";
import { EntityManager } from "typeorm";
import EventBusService from "@medusajs/medusa/dist/services/event-bus";
import { FindConfig } from "@medusajs/medusa/dist/types/common";
import { UserService as MedusaUserService } from "@medusajs/medusa/dist/services";
import { User } from "../entities/user.entity";
import UserRepository from "../repositories/user.repository";
import { MedusaError } from "medusa-core-utils";
import { buildQuery, validateId } from "@medusajs/medusa/dist/utils";
// import AnalyticsConfigService from "@medusajs/medusa/dist/services/analytics-config";
import { FilterableUserProps } from "@medusajs/medusa/dist/types/user";

type ConstructorParams = {
  manager: EntityManager;
  userRepository: typeof UserRepository;
  eventBusService: EventBusService;
  loggedInUser?: User;
  analyticsConfigService;
  featureFlagRouter;
};

@Service({ scope: "SCOPED", override: MedusaUserService })
export default class UserService extends MedusaUserService {
  private readonly manager: EntityManager;
  private readonly userRepository: typeof UserRepository;
  private readonly eventBus: EventBusService;

  constructor(readonly container: ConstructorParams) {
    super(container);
    this.manager = container.manager;
    this.userRepository = container.userRepository;
    this.eventBus = container.eventBusService;
  }

  public async retrieve(
    userId: string,
    config?: FindConfig<User>
  ): Promise<User> {
    const userRepo = this.manager.getCustomRepository(this.userRepository);
    const validatedId = validateId(userId);
    const query = buildQuery({ id: validatedId }, config);

    // console.log("QUERY", query);
    const user = await userRepo.findOne(query);
    if (!user) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with id: ${userId} was not found`
      );
    }
    return user as User;
  }

  async list(selector: FilterableUserProps, config = {}) {
    // console.log("BUILD QUERY");
    if (
      Object.keys(this.container).includes("loggedInUser") &&
      this.container.loggedInUser.store_id
    ) {
      selector["store_id"] = this.container.loggedInUser.store_id;
    }

    return await this.atomicPhase_(async (transactionManager) => {
      const userRepo = transactionManager.getCustomRepository(
        this.userRepository
      );
      return await userRepo.find(buildQuery(selector, config));
    });
  }
}

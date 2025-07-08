import { implement } from "@orpc/server";
import { contract } from "@/contracts";
import { requiredAuthMiddleware } from "./middlewares/auth";
import { dbProviderMiddleware } from "./middlewares/db";

export const os = implement(contract);

export const pub = os.use(dbProviderMiddleware);

export const authed = pub.use(requiredAuthMiddleware);

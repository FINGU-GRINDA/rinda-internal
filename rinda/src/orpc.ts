import { os } from "@orpc/server";
import { requiredAuthMiddleware } from "./middlewares/auth";
import { dbProviderMiddleware } from "./middlewares/db";

export const pub = os.use(dbProviderMiddleware);

export const authed = pub.use(requiredAuthMiddleware);

import { createORPCClient } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { contract } from "@/contracts";
import type { router } from "@/router";

declare global {
	var $client: RouterClient<typeof router> | undefined;
}

const openapiLink = new OpenAPILink(contract, {
	url: `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api/rpc`,
	fetch: (
		request,
		init, // Override fetch if needed
	) =>
		globalThis.fetch(request, {
			...init,
			credentials: "include", // Include cookies for cross-origin requests
		}),
});

const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
	createORPCClient(openapiLink);

export const orpc = createTanstackQueryUtils(client);

import { os } from "@orpc/server";
import { peopleRouter } from "./people";
import { websetRouter } from "./webset";

export const router = os.router({
	people: peopleRouter,
	webset: websetRouter,
});

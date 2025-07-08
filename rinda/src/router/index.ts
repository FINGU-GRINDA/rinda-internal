import { os } from "@/orpc";
import { me, signin, signup } from "./auth";
import { peopleRouter } from "./people";
import { websetRouter } from "./webset";

export const router = os.router({
	auth: {
		me: me,
		signup: signup,
		signin: signin,
	},
	people: peopleRouter,
	webset: websetRouter,
});

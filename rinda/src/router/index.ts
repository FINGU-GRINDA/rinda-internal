import { os } from "@/orpc";
import { me, signin, signup } from "./auth";
import { peopleRouter } from "./people";

export const router = os.router({
	auth: {
		me: me,
		signup: signup,
		signin: signin,
	},
	people: peopleRouter,
});

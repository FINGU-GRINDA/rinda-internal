import { me, signin, signup } from "./auth";
import { peopleRouter } from "./people";

export const router = {
	auth: {
		signup,
		signin,
		me,
	},
	people: peopleRouter,
};

import { oc } from "@orpc/contract";
import { CredentialSchema, TokenSchema } from "../schemas/auth";
import { NewUserSchema, UserSchema } from "../schemas/user";

export const signupContract = oc
	.route({
		method: "POST",
		path: "/auth/signup",
		summary: "Sign up a new user",
		tags: ["Authentication"],
	})
	.input(NewUserSchema)
	.output(UserSchema);

export const signinContract = oc
	.route({
		method: "POST",
		path: "/auth/signin",
		summary: "Sign in a user",
		tags: ["Authentication"],
	})
	.input(CredentialSchema)
	.output(TokenSchema);

export const meContract = oc
	.route({
		method: "GET",
		path: "/auth/me",
		summary: "Get the current user",
		tags: ["Authentication"],
	})
	.output(UserSchema);

export const authContract = {
	signup: signupContract,
	signin: signinContract,
	me: meContract,
};

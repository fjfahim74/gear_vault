import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URL as string);
const db = client.db("next_project");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },

    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path !== "/sign-up/email") return;

            const email = String(ctx.body?.email ?? "").trim().toLowerCase();
            if (!email) return;

            const existing = await ctx.context.internalAdapter.findUserByEmail(email);
            if (existing) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                    message: "User already exists. Use another email.",
                    code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
                });
            }
        }),
    },

    plugins: [
        jwt(),
    ],

    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60,
        },
    },



    database: mongodbAdapter(db, {
        client,
    }),
});
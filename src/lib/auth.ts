import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";

const globalForMongo = globalThis as typeof globalThis & {
    mongoClient?: MongoClient;
};

const client =
    globalForMongo.mongoClient ?? new MongoClient(process.env.MONGO_DB_URL as string);

globalForMongo.mongoClient = client;

const db = client.db("next_project");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    user: {
        additionalFields: {
            role: {
                type: ["Customer", "Owner", "Admin"],
                required: false,
                defaultValue: "Customer",
                input: false,
            },
        },
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
        jwt({
            jwt: {
                definePayload: ({ user }) => {
                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    };
                },
            },
        }),
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
import type {FastifyRequest} from "fastify";
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {z} from "zod";
import {createLog} from "@/app/services/create-log";
import {listLogs} from "@/app/services/list-logs";
import {unwrapEither} from "@/infra/shared/either";

const bodySchema = z.object({
	shortId: z.string(),
	userAgent: z.string(),
});

type BodySchema = z.infer<typeof bodySchema>;

export const accessLogsRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/logs",
		{
			schema: {
				summary: "Register a log",
				body: bodySchema,
				response: {
					201: z.object({
						id: z.string(),
						shortId: z.string(),
						ip: z.string(),
						userAgent: z.string(),
						createdAt: z.string(),
					}),
					500: z
						.object({
							message: z.string(),
						})
						.describe("Internal server error"),
				},
			},
		},
		async (request: FastifyRequest<{ Body: BodySchema }>, reply) => {
			const { shortId, userAgent } = request.body;

			const ipHeader = request.headers["x-forwarded-for"];
			const ip =
				typeof ipHeader === "string"
					? ipHeader
					: Array.isArray(ipHeader)
						? ipHeader[0]
						: request.socket.remoteAddress || "";

			const response = await createLog({
				shortId,
				ip,
				userAgent,
			});

			const result = unwrapEither(response);

			if (result instanceof Error) {
				return reply.status(500).send({
					message: result.message || "Internal server error",
				});
			}

			// Type assertion to help TypeScript understand the structure
			const successResult = result as { log: any };
			return reply.status(201).send(successResult.log);
		},
	);

	server.get(
		"/logs",
		{
			schema: {
				summary: "Get all logs",
				response: {
					200: z.array(
						z.object({
							id: z.string(),
							shortId: z.string(),
							ip: z.string(),
							userAgent: z.string(),
							createdAt: z.string(),
						}),
					),
					500: z
						.object({
							message: z.string(),
						})
						.describe("Internal server error"),
				},
			},
		},
		async (request, reply) =>
			reply
				.status(200)
				.send(await listLogs().then((response) => response.json())),
	);
};

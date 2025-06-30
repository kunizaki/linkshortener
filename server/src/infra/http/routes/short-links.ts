import type {FastifyRequest} from "fastify";
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {z} from "zod";
import {createShortLink} from "@/app/services/create-short-link";
import {DuplicateShortLink} from "@/app/services/errors/duplicate-short-link";
import {listShortLinks} from "@/app/services/list-short-links";
import {makeLeft, unwrapEither} from "@/infra/shared/either";

const bodySchema = z.object({
	shortId: z.string(),
	original: z.string(),
});

type BodySchema = z.infer<typeof bodySchema>;

export const shortLinksRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/links",
		{
			schema: {
				summary: "Register a short url",
				body: bodySchema,
				response: {
					201: z.object({
						id: z.string(),
						shortId: z.string(),
						original: z.string(),
						createdAt: z.date(),
					}),
					409: z
						.object({
							message: z.string(),
						})
						.describe("This shortId already exists."),
					500: z
						.object({
							message: z.string(),
						})
						.describe("Internal server error"),
				},
			},
		},
		async (request: FastifyRequest<{ Body: BodySchema }>, reply) => {
			const { shortId, original } = request.body;

			const response = await createShortLink({
				shortId,
				original,
			});

			const result = unwrapEither(response);

			if (result instanceof DuplicateShortLink) {
				return reply.status(409).send({
					message: "This shortId already exists.",
				});
			}

			return reply.status(201).send(result);
		},
	);

	server.get(
		"/links",
		{
			schema: {
				summary: "Get all short urls",
				response: {
					200: z.array(
						z.object({
							id: z.string(),
							shortId: z.string(),
							original: z.string(),
							createdAt: z.date(),
							accesses: z.array(z.object({})),
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
		async (request, reply) => {
			const response = await listShortLinks();

			const result = unwrapEither(response);

			return reply.status(200).send(result);
		},
	);
};

import type {FastifyRequest} from "fastify";
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {z} from "zod";
import {deleteShortLink} from "@/app/services/delete-short-link";
import {NotFoundLink} from "@/app/services/errors/not-found-link";
import {getShortLink} from "@/app/services/get-short-link";
import {makeLeft, unwrapEither} from "@/infra/shared/either";

export const shortLinkRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/link/:shortId",
		{
			schema: {
				summary: "Get a shor link infos",
				params: z.object({
					shortId: z.string().min(1, "Short ID is required"),
				}),
				response: {
					200: z.object({
						id: z.string(),
						shortId: z.string(),
						original: z.string(),
						createdAt: z.date(),
						accesses: z.array(
							z.object({
								id: z.string(),
								shortLinkId: z.string(),
								timestamp: z.date(),
								userAgent: z.string(),
								ip: z.string(),
							}),
						),
					}),
					500: z
						.object({
							message: z.string(),
						})
						.describe("Internal server error"),
				},
			},
		},
		async (request: FastifyRequest<{ Params: { shortId: string } }>, reply) => {
			const { shortId } = request.params;

			const response = await getShortLink({
				shortId,
			});

			const result = unwrapEither(response);

			if (makeLeft(result) instanceof NotFoundLink) {
				return reply.status(404).send({
					message: "Short link not found",
				});
			}

			return reply.status(200).send(result);
		},
	);

	server.delete(
		"/link/:id",
		{
			schema: {
				summary: "Delete a short url",
				params: z.object({
					id: z.string().min(1, "ID is required"),
				}),
				response: {
					204: z.object({}),
					404: z.object({
						message: z.string(),
					}),
					500: z
						.object({
							message: z.string(),
						})
						.describe("Internal server error"),
				},
			},
		},
		async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
			const { id } = request.params;

			const response = await deleteShortLink({
				id,
			});

			const result = unwrapEither(response);

			if (makeLeft(result) instanceof NotFoundLink) {
				return reply.status(404).send({
					message: "Short link not found",
				});
			}

			return reply.status(204).send();
		},
	);
};

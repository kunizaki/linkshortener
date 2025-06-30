import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {z} from "zod";
import {reportGenerate} from "@/app/services/report-generate";
import {unwrapEither} from "@/infra/shared/either";

export const reportGenerateRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/report",
		{
			schema: {
				summary: "Get url from report url infos",
				response: {
					200: z.object({
						url: z.string(),
					}),
					500: z
						.object({
							message: z.string(),
						})
						.describe("Internal server error"),
				},
			},
		},
		async (request, reply) => {
			const response = await reportGenerate();

			const result = unwrapEither(response);

			return reply.status(200).send(result);
		},
	);
};

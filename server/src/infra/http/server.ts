import {fastifyCors} from "@fastify/cors";
import {fastifyMultipart} from "@fastify/multipart";
import {fastifySwagger} from "@fastify/swagger";
import {fastifySwaggerUi} from "@fastify/swagger-ui";
import {fastify} from "fastify";
import {hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler,} from "fastify-type-provider-zod";
import {env} from "@/env";
import {accessLogsRoute} from "@/infra/http/routes/access-logs";
import {healthRoute} from "@/infra/http/routes/health";
import {reportGenerateRoute} from "@/infra/http/routes/report-generate";
import {shortLinkRoute} from "@/infra/http/routes/short-link";
import {shortLinksRoute} from "@/infra/http/routes/short-links";
import {transformSwaggerSchema} from "@/infra/http/transform-swagger-schema";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: "Validation error.",
			issues: error.validation,
		});
	}

	console.error(error);
	reply.status(500).send({
		message: "Internal server error",
	});
});

server.register(fastifyCors, {
	origin: "*",
	methods: ["GET", "POST", "DELETE"],
});

server.register(fastifyMultipart);

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Encurtador de Links",
			description: "API para encurtar URLs",
			version: "1.0.0",
		},
	},
	transform: transformSwaggerSchema,
});

server.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

server.register(healthRoute);
server.register(shortLinkRoute);
server.register(shortLinksRoute);
server.register(accessLogsRoute);
server.register(reportGenerateRoute);

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log("HTTP server running!");
});

import { jsonSchemaTransform } from "fastify-type-provider-zod";

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0];

export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
	const { schema, url } = jsonSchemaTransform(data);

	// Check if schema and schema.consumes exist before trying to access them
	if (schema && schema.consumes && schema.consumes.includes("multipart/form-data")) {
		if (schema.body === undefined) {
			schema.body = {
				type: "object",
				required: [],
				properties: {},
			};
		}

		// @ts-ignore
		schema.body.properties.file = {
			type: "string",
			format: "binary",
		};

		// @ts-ignore
		schema.body.required.push("file");
	}

	return { schema, url };
}

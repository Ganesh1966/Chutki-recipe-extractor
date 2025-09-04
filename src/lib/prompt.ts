import { ChatCompletionCreateParams } from 'openai/resources/chat/completions';

export const buildProductCatalogPrompt = (rawText: string): ChatCompletionCreateParams => {
    return {
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content:
                    "You are a product catalog extractor. The input text can be messy, unstructured, or contain irrelevant content. " +
                    "Your job is to extract product details and return a complete catalog. " +
                    "Each product must have the following fields: " +
                    "name (product title), price (in INR; use value from text if available, otherwise estimate an average Indian price), " +
                    "description (use value from text if present, otherwise infer a reasonable description), " +
                    "category (use value from text if present, otherwise infer a suitable category). " +
                    "Ensure every product object contains all keys, even if some values are inferred."
            },
            {
                role: "user",
                content: `Extract a product catalog from the following text file content:\n\n${rawText}`
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "ProductCatalogExtraction",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        products: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    price: { type: "string" },
                                    description: { type: "string" },
                                    category: { type: "string" }
                                },
                                // all fields required to satisfy strict schema
                                required: ["name", "price", "description", "category"],
                                additionalProperties: false
                            },
                            minItems: 1
                        }
                    },
                    required: ["products"],
                    additionalProperties: false
                }
            }
        }
    };
};

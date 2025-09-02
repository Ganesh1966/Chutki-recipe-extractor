import { ChatCompletionCreateParams } from 'openai/resources/chat/completions';


export const buildRecipePrompt = (rawText: string): ChatCompletionCreateParams => {
    return {
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content:
                    "You are a recipe extractor. The input text can be messy, unstructured, or contain irrelevant content. " +
                    "Your job is to find and extract a valid recipe regardless of formatting. " +
                    "Always return JSON with the following fields: " +
                    "name (recipe title), ingredients (array of ingredients), steps (array of cooking steps) " + +
                        "Do your best to infer missing information from context if the text is incomplete."
            },
            {
                role: "user",
                content: `Extract a recipe from the following text file content:\n\n${rawText}`
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "RecipeExtraction",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        ingredients: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1
                        },
                        steps: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1
                        }
                    },
                    required: ["name", "ingredients", "steps"],
                    additionalProperties: false
                }
            }
        }
    };
};


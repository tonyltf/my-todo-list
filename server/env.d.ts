import { z } from "zod";

const envVariables = z.object({
    PORT: z.number().min(1).max(65535),
    HOSTNAME: z.string().ip(),
    DATABASE_URL: z.string(),
});

envVariables.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envVariables> { }
    }
}
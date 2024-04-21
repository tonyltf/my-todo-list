import type { paths } from "./schema";

export type Todo = paths['/v1/user/{userId}/todos']['get']['responses']['200']['content']['application/json'];;


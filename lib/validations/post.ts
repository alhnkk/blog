// Re-export from main validation file to avoid duplication
export {
  createPostSchema,
  updatePostSchema,
  postFiltersSchema,
} from "../types/validation";

export type {
  CreatePostData,
  UpdatePostData,
  PostFiltersData,
} from "../types/validation";

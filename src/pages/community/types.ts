import type { CommunityPostComment, CommunityPostSummary, CourseSearchItem } from "../../api/client";

export type CommunitySort = "latest" | "views" | "popular";
export type CommunityTab = "posts" | "reviews";

export type CommunityPostCardItem = CommunityPostSummary;

export type CommunityCommentItem = CommunityPostComment;

export type CommunityReviewCourse = CourseSearchItem;

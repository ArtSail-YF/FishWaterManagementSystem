import { request } from "@umijs/max";
import type { BaseResponse } from "@/types";

export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  source: string;
  category: "industry" | "market" | "policy" | "tech";
  publishTime: string;
  isPublished: boolean;
  createTime: string;
  createBy: string;
};

export async function getNewsList(params?: {
  current?: number;
  pageSize?: number;
  category?: string;
}) {
  return request<BaseResponse<{ records: NewsItem[]; total: number }>>(
    "/news/list",
    { method: "GET", params },
  );
}

export async function getNewsDetail(id: number) {
  return request<BaseResponse<NewsItem>>("/news/detail/" + id, {
    method: "GET",
  });
}

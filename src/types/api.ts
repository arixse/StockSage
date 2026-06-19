export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

export interface ScreenerFilters {
  sector?: string;
  industry?: string;
  minMarketCap?: number;
  maxMarketCap?: number;
  minPrice?: number;
  maxPrice?: number;
  minScore?: number;
  recommendation?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

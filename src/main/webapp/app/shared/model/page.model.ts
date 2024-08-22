export interface PaginatedResponse<ContentType> {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  size: number;
  content: ContentType[];
  empty: boolean;
}

export interface BaseGetAllInterface<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

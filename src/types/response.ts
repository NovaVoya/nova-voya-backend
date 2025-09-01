export interface Response<TData> {
  data: TData;
  success: boolean;
  message: string;
}

export interface IResponse {
  response?: {
    data: {
      message: string;
      statusCode: number;
    };
  };
}

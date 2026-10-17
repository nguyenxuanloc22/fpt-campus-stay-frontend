export interface AppErrorOptions {
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.code = options.code || 'UNKNOWN_ERROR';
    this.statusCode = options.statusCode || 500;
    this.details = options.details;
  }

  static fromAxiosError(error: unknown): AppError {
    if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
      const axiosError = error as {
        response?: { status: number; data?: { message?: string; code?: string } };
        message: string;
      };

      const statusCode = axiosError.response?.status || 500;
      const serverMessage = axiosError.response?.data?.message;
      const serverCode = axiosError.response?.data?.code;

      if (statusCode === 401) {
        return new AppError(serverMessage || 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', {
          code: 'UNAUTHORIZED',
          statusCode: 401,
        });
      }

      if (statusCode === 403) {
        return new AppError(serverMessage || 'Bạn không có quyền truy cập chức năng này.', {
          code: 'FORBIDDEN',
          statusCode: 403,
        });
      }

      if (statusCode === 404) {
        return new AppError(serverMessage || 'Không tìm thấy dữ liệu yêu cầu.', {
          code: 'NOT_FOUND',
          statusCode: 404,
        });
      }

      return new AppError(serverMessage || axiosError.message || 'Đã có lỗi xảy ra từ máy chủ.', {
        code: serverCode || `HTTP_${statusCode}`,
        statusCode,
      });
    }

    if (error instanceof Error) {
      return new AppError(error.message);
    }

    return new AppError('Lỗi không xác định.');
  }
}

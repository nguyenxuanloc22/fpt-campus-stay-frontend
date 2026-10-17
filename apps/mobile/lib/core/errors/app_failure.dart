import 'package:dio/dio.dart';

class AppFailure implements Exception {
  final String message;
  final String? code;
  final int? statusCode;

  const AppFailure({
    required this.message,
    this.code,
    this.statusCode,
  });

  factory AppFailure.fromDioException(DioException exception) {
    switch (exception.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const AppFailure(
          message: 'Kết nối mạng quá thời gian chờ. Vui lòng thử lại.',
          code: 'TIMEOUT',
        );
      case DioExceptionType.badResponse:
        final status = exception.response?.statusCode;
        final data = exception.response?.data;
        String? msg;
        if (data is Map<String, dynamic> && data['message'] != null) {
          msg = data['message'] as String;
        }

        if (status == 401) {
          return AppFailure(
            message: msg ?? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            code: 'UNAUTHORIZED',
            statusCode: 401,
          );
        }
        if (status == 403) {
          return AppFailure(
            message: msg ?? 'Bạn không có quyền truy cập chức năng này.',
            code: 'FORBIDDEN',
            statusCode: 403,
          );
        }
        if (status == 404) {
          return AppFailure(
            message: msg ?? 'Không tìm thấy dữ liệu yêu cầu.',
            code: 'NOT_FOUND',
            statusCode: 404,
          );
        }
        return AppFailure(
          message: msg ?? 'Lỗi máy chủ ($status). Vui lòng thử lại sau.',
          code: 'SERVER_ERROR',
          statusCode: status,
        );
      case DioExceptionType.connectionError:
        return const AppFailure(
          message: 'Không thể kết nối đến máy chủ. Hãy kiểm tra kết nối mạng hoặc mock server.',
          code: 'NETWORK_ERROR',
        );
      case DioExceptionType.cancel:
        return const AppFailure(
          message: 'Yêu cầu đã bị hủy.',
          code: 'CANCELLED',
        );
      default:
        return const AppFailure(
          message: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
          code: 'UNKNOWN',
        );
    }
  }

  @override
  String toString() => 'AppFailure(message: $message, code: $code, statusCode: $statusCode)';
}

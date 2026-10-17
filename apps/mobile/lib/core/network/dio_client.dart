import 'package:dio/dio.dart';
import '../constants/app_constants.dart';
import '../errors/app_failure.dart';
import '../storage/secure_storage_service.dart';

class DioClient {
  final Dio dio;
  final SecureStorageService storageService;

  DioClient({
    Dio? dioInstance,
    SecureStorageService? storage,
    String? baseUrl,
  })  : storageService = storage ?? SecureStorageService(),
        dio = dioInstance ??
            Dio(
              BaseOptions(
                baseUrl: baseUrl ?? AppConstants.defaultBaseUrl,
                connectTimeout: AppConstants.connectTimeout,
                receiveTimeout: AppConstants.receiveTimeout,
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
              ),
            ) {
    _setupInterceptors();
  }

  void _setupInterceptors() {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await storageService.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) {
          final failure = AppFailure.fromDioException(error);
          return handler.reject(
            DioException(
              requestOptions: error.requestOptions,
              response: error.response,
              type: error.type,
              error: failure,
            ),
          );
        },
      ),
    );
  }
}

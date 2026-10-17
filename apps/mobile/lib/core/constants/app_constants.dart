import 'dart:io';
import 'package:flutter/foundation.dart';

class AppConstants {
  AppConstants._();

  static const String appName = 'CampusStay FPT';

  // Base API URL:
  // - Android Emulator: http://10.0.2.2:4010/api/v1
  // - iOS Simulator / Web: http://localhost:4010/api/v1
  static String get defaultBaseUrl {
    const fromEnv = String.fromEnvironment('API_BASE_URL');
    if (fromEnv.isNotEmpty) return fromEnv;

    if (!kIsWeb && Platform.isAndroid) {
      return 'http://10.0.2.2:4010/api/v1';
    }
    return 'http://localhost:4010/api/v1';
  }

  // Storage Keys
  static const String keyAuthToken = 'auth_token';
  static const String keyRefreshToken = 'refresh_token';
  static const String keyUserData = 'user_data';

  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}

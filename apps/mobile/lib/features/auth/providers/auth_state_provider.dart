import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthUserState {
  final bool isAuthenticated;
  final String role;
  final String userName;
  final String studentId;
  final String email;
  final String? token;

  const AuthUserState({
    required this.isAuthenticated,
    required this.role,
    required this.userName,
    required this.studentId,
    required this.email,
    this.token,
  });

  AuthUserState copyWith({
    bool? isAuthenticated,
    String? role,
    String? userName,
    String? studentId,
    String? email,
    String? token,
  }) {
    return AuthUserState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      role: role ?? this.role,
      userName: userName ?? this.userName,
      studentId: studentId ?? this.studentId,
      email: email ?? this.email,
      token: token ?? this.token,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthUserState> {
  AuthNotifier()
      : super(const AuthUserState(
          isAuthenticated: true,
          role: 'STUDENT',
          userName: 'Nguyễn Xuân Lộc',
          studentId: 'SE170123',
          email: 'locnxse170123@fpt.edu.vn',
          token: 'mock-jwt-student-token',
        ));

  void loginAsStudent() {
    state = const AuthUserState(
      isAuthenticated: true,
      role: 'STUDENT',
      userName: 'Nguyễn Xuân Lộc',
      studentId: 'SE170123',
      email: 'locnxse170123@fpt.edu.vn',
      token: 'mock-jwt-student-token',
    );
  }

  void switchRoleForGradingDemo(String role) {
    state = state.copyWith(
      role: role,
      userName: role == 'STUDENT'
          ? 'Nguyễn Xuân Lộc'
          : role == 'STAFF'
              ? 'Trần Thị Thu Thảo (Cán bộ QL)'
              : role == 'MANAGER'
                  ? 'TS. Lê Hoàng Nam (Trưởng BQL)'
                  : 'Vũ Minh Tuấn (Admin KTX)',
    );
  }

  void logout() {
    state = const AuthUserState(
      isAuthenticated: false,
      role: 'STUDENT',
      userName: '',
      studentId: '',
      email: '',
      token: null,
    );
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthUserState>((ref) {
  return AuthNotifier();
});

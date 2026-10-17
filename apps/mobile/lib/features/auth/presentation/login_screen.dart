import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/app_button.dart';
import '../providers/auth_state_provider.dart';
import 'widgets/demo_role_switcher.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _studentIdController = TextEditingController(text: 'SE170123');
  final _passwordController = TextEditingController(text: 'password123');

  @override
  void dispose() {
    _studentIdController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    ref.read(authProvider.notifier).loginAsStudent();
    context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildHeader(),
                const SizedBox(height: 32),
                _buildForm(),
                const SizedBox(height: 24),
                AppButton(
                  label: 'Đăng nhập FPT Student',
                  icon: Icons.login,
                  onPressed: _handleLogin,
                ),
                const SizedBox(height: 24),
                const DemoRoleSwitcher(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            color: AppColors.fptOrange,
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Icon(Icons.apartment, size: 40, color: Colors.white),
        ),
        const SizedBox(height: 16),
        const Text(
          'CampusStay FPT',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.fptNavy),
        ),
        const SizedBox(height: 4),
        const Text(
          'Hệ thống Quản lý KTX Tân Uyên (Bình Dương)',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 13, color: AppColors.textSecondaryLight),
        ),
      ],
    );
  }

  Widget _buildForm() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        children: [
          TextField(
            controller: _studentIdController,
            decoration: const InputDecoration(
              labelText: 'Mã số sinh viên (MSSV)',
              prefixIcon: Icon(Icons.badge_outlined, color: AppColors.fptOrange),
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _passwordController,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: 'Mật khẩu',
              prefixIcon: Icon(Icons.lock_outline, color: AppColors.fptOrange),
              border: OutlineInputBorder(),
            ),
          ),
        ],
      ),
    );
  }
}

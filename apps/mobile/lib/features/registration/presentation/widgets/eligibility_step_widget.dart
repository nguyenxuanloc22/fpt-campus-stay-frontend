import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../providers/registration_provider.dart';

class EligibilityStepWidget extends StatelessWidget {
  final RegistrationFormState form;

  const EligibilityStepWidget({super.key, required this.form});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '1. Kiểm tra Điều kiện Đăng ký',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.fptNavy),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.successLight,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.success),
          ),
          child: Row(
            children: [
              const Icon(Icons.check_circle, color: AppColors.success, size: 28),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Đủ điều kiện xét duyệt KTX',
                      style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.success),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      form.eligibilityReason ?? '',
                      style: const TextStyle(fontSize: 12, color: AppColors.textPrimaryLight),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderLight),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Học kỳ mở đăng ký:', style: TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
              const SizedBox(height: 4),
              Text(
                form.selectedSemester,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.fptOrange),
              ),
              const SizedBox(height: 8),
              const Text(
                'Thời hạn nộp đơn: 15/08/2026 - 30/08/2026\nƯu tiên sinh viên khóa mới và sinh viên diện chính sách.',
                style: TextStyle(fontSize: 12, color: AppColors.textSecondaryLight, height: 1.4),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

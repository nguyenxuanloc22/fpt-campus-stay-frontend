import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../providers/registration_provider.dart';

class ReviewSubmitStepWidget extends StatelessWidget {
  final RegistrationFormState form;

  const ReviewSubmitStepWidget({super.key, required this.form});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '3. Xác nhận Thông tin Đăng ký',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.fptNavy),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderLight),
          ),
          child: Column(
            children: [
              _row('Học kỳ', form.selectedSemester),
              const Divider(height: 16),
              _row('Loại phòng nguyện vọng', form.selectedRoomType),
              const Divider(height: 16),
              _row(
                'Vị trí giường',
                form.selectedBedPreference == 'LOWER'
                    ? 'Tầng dưới'
                    : form.selectedBedPreference == 'UPPER'
                        ? 'Tầng trên'
                        : 'Không bắt buộc',
              ),
              const Divider(height: 16),
              _row(
                'Mã nhóm bạn cùng phòng',
                form.roommateCode.isNotEmpty ? form.roommateCode : 'Không có (xếp tự động)',
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.infoLight,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppColors.info.withAlpha(50)),
          ),
          child: const Row(
            children: [
              Icon(Icons.info, color: AppColors.info, size: 18),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Bằng việc nhấn Nộp đơn, bạn cam kết tuân thủ nội quy Ký túc xá FPT Tân Uyên.',
                  style: TextStyle(fontSize: 11, color: AppColors.fptNavy),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _row(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondaryLight)),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.fptNavy)),
      ],
    );
  }
}

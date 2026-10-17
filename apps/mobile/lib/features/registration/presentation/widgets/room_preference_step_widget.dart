import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../providers/registration_provider.dart';

class RoomPreferenceStepWidget extends StatelessWidget {
  final RegistrationFormState form;
  final void Function(String, String) onChanged;

  const RoomPreferenceStepWidget({
    super.key,
    required this.form,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final roomTypes = [
      'Phòng 4 giường điều hòa',
      'Phòng 6 giường tiêu chuẩn',
      'Phòng 2 giường dịch vụ',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '2. Chọn Nguyện vọng Phòng & Giường',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.fptNavy),
        ),
        const SizedBox(height: 12),
        const Text('Loại phòng ưu tiên:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        ...roomTypes.map((type) {
          final isSelected = form.selectedRoomType == type;
          return InkWell(
            onTap: () => onChanged(type, form.selectedBedPreference),
            borderRadius: BorderRadius.circular(10),
            child: Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.fptOrangeLight : Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isSelected ? AppColors.fptOrange : AppColors.borderLight,
                  width: isSelected ? 1.5 : 1,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                    color: isSelected ? AppColors.fptOrange : AppColors.textSecondaryLight,
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Text(
                    type,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      color: isSelected ? AppColors.fptOrangeDark : AppColors.textPrimaryLight,
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
        const SizedBox(height: 16),
        const Text('Vị trí giường ưu tiên:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Row(
          children: [
            _bedChip('LOWER', 'Giường tầng dưới'),
            const SizedBox(width: 8),
            _bedChip('UPPER', 'Giường tầng trên'),
            const SizedBox(width: 8),
            _bedChip('ANY', 'Bất kỳ'),
          ],
        ),
      ],
    );
  }

  Widget _bedChip(String key, String label) {
    final isSelected = form.selectedBedPreference == key;
    return ChoiceChip(
      label: Text(label, style: const TextStyle(fontSize: 11)),
      selected: isSelected,
      selectedColor: AppColors.fptOrange,
      labelStyle: TextStyle(color: isSelected ? Colors.white : AppColors.textPrimaryLight),
      onSelected: (val) {
        if (val) onChanged(form.selectedRoomType, key);
      },
    );
  }
}

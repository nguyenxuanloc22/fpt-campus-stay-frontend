import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../providers/rooms_provider.dart';

class RoomCardWidget extends StatelessWidget {
  final RoomModel room;
  final VoidCallback? onSelect;

  const RoomCardWidget({
    super.key,
    required this.room,
    this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    final isFull = room.availableBeds == 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(8),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Phòng ${room.roomNumber} (${room.building})',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.fptNavy,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isFull ? AppColors.errorLight : AppColors.successLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  isFull ? 'Hết chỗ' : 'Còn ${room.availableBeds}/${room.capacity} chỗ',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: isFull ? AppColors.error : AppColors.success,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            room.roomType,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondaryLight),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            runSpacing: 4,
            children: room.amenities.map((item) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Text(item, style: const TextStyle(fontSize: 11, color: AppColors.textSecondaryLight)),
              );
            }).toList(),
          ),
          const Divider(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${Formatters.formatCurrency(room.pricePerMonth)} / tháng',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.fptOrange,
                ),
              ),
              if (onSelect != null)
                TextButton(
                  onPressed: isFull ? null : onSelect,
                  child: const Text('Chọn phòng này'),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/status_chip.dart';
import '../providers/roommate_provider.dart';
import 'widgets/empty_roommate_group_view.dart';

class RoommateGroupScreen extends ConsumerWidget {
  const RoommateGroupScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final group = ref.watch(roommateProvider);
    final notifier = ref.read(roommateProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(title: const Text('Nhóm bạn cùng phòng')),
      body: group.groupCode == null
          ? EmptyRoommateGroupView(notifier: notifier)
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPinCard(group),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Thành viên (${group.members.length}/4)',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.fptNavy),
                      ),
                      StatusChip(status: group.status),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...group.members.map(_buildMemberTile),
                  const SizedBox(height: 24),
                  AppButton(
                    label: 'Rời nhóm bạn cùng phòng',
                    variant: AppButtonVariant.outline,
                    onPressed: () => notifier.leaveGroup(),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildPinCard(RoommateGroupState group) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.fptOrangeLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.fptOrange.withAlpha(80)),
      ),
      child: Column(
        children: [
          const Text('Mã PIN nhóm KTX của bạn', style: TextStyle(fontSize: 13, color: AppColors.fptOrangeDark)),
          const SizedBox(height: 8),
          Text(
            group.groupCode ?? '',
            style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: 4, color: AppColors.fptOrange),
          ),
          const SizedBox(height: 6),
          const Text(
            'Chia sẻ mã này với bạn bè để cùng đăng ký vào chung 1 phòng.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: AppColors.textSecondaryLight),
          ),
        ],
      ),
    );
  }

  Widget _buildMemberTile(RoommateMember member) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: member.isLeader ? AppColors.fptOrange : AppColors.fptNavyLight,
            foregroundColor: member.isLeader ? Colors.white : AppColors.fptNavy,
            child: Text(member.fullName.substring(0, 1)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(member.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    if (member.isLeader) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.fptOrangeLight,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text('Trưởng nhóm', style: TextStyle(fontSize: 10, color: AppColors.fptOrangeDark, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ],
                ),
                Text('MSSV: ${member.studentId} • Gia nhập: ${member.joinedAt}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

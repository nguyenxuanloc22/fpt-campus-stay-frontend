import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/empty_view.dart';
import '../../providers/roommate_provider.dart';

class EmptyRoommateGroupView extends StatefulWidget {
  final RoommateNotifier notifier;

  const EmptyRoommateGroupView({super.key, required this.notifier});

  @override
  State<EmptyRoommateGroupView> createState() => _EmptyRoommateGroupViewState();
}

class _EmptyRoommateGroupViewState extends State<EmptyRoommateGroupView> {
  final _pinController = TextEditingController();

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const EmptyView(
            title: 'Chưa tham gia nhóm nào',
            message: 'Tạo nhóm mới để nhận mã PIN 6 số hoặc nhập mã PIN từ bạn bè để ở chung phòng.',
            icon: Icons.group_add_outlined,
          ),
          const SizedBox(height: 16),
          AppButton(
            label: 'Tạo nhóm bạn cùng phòng mới',
            icon: Icons.add,
            onPressed: () => widget.notifier.createGroup(),
          ),
          const SizedBox(height: 24),
          const Divider(),
          const SizedBox(height: 16),
          TextField(
            controller: _pinController,
            decoration: const InputDecoration(
              labelText: 'Nhập mã PIN (VD: CP-8842)',
              prefixIcon: Icon(Icons.pin, color: AppColors.fptOrange),
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          AppButton(
            label: 'Gia nhập nhóm',
            variant: AppButtonVariant.secondary,
            onPressed: () {
              if (_pinController.text.isNotEmpty) {
                widget.notifier.joinGroup(_pinController.text.trim());
              }
            },
          ),
        ],
      ),
    );
  }
}

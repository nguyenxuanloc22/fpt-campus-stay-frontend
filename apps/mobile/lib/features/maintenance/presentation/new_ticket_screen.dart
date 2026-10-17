import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/app_button.dart';
import '../providers/maintenance_provider.dart';

class NewTicketScreen extends ConsumerStatefulWidget {
  const NewTicketScreen({super.key});

  @override
  ConsumerState<NewTicketScreen> createState() => _NewTicketScreenState();
}

class _NewTicketScreenState extends ConsumerState<NewTicketScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String _selectedCategory = 'AIR_CONDITIONER';
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (_titleController.text.trim().isEmpty || _descController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng điền đầy đủ tiêu đề và mô tả sự cố')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    await Future<void>.delayed(const Duration(milliseconds: 400));
    await ref.read(maintenanceProvider.notifier).addTicket(
          _selectedCategory,
          _titleController.text.trim(),
          _descController.text.trim(),
        );

    if (mounted) {
      setState(() => _isSubmitting = false);
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(title: const Text('Gửi Báo cáo Sự cố mới')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildForm(),
            const SizedBox(height: 24),
            AppButton(
              label: 'Gửi yêu cầu hỗ trợ kỹ thuật',
              isLoading: _isSubmitting,
              onPressed: _handleSubmit,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Danh mục thiết bị', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: _selectedCategory,
            items: const [
              DropdownMenuItem(value: 'AIR_CONDITIONER', child: Text('Điều hòa nhiệt độ')),
              DropdownMenuItem(value: 'ELECTRICITY', child: Text('Hệ thống Điện / Đèn / Ổ cắm')),
              DropdownMenuItem(value: 'PLUMBING', child: Text('Hệ thống Nước / Vòi / Vệ sinh')),
              DropdownMenuItem(value: 'DOOR_LOCK', child: Text('Khóa cửa / Ban công / Cửa sổ')),
              DropdownMenuItem(value: 'OTHER', child: Text('Trang thiết bị khác')),
            ],
            onChanged: (val) {
              if (val != null) setState(() => _selectedCategory = val);
            },
            decoration: const InputDecoration(border: OutlineInputBorder()),
          ),
          const SizedBox(height: 16),
          const Text('Tiêu đề sự cố', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          TextField(
            controller: _titleController,
            decoration: const InputDecoration(
              hintText: 'VD: Vòi sen phòng tắm bị rò rỉ nước',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          const Text('Mô tả chi tiết', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          TextField(
            controller: _descController,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText: 'Mô tả rõ tình trạng và vị trí trong phòng...',
              border: OutlineInputBorder(),
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/empty_view.dart';
import '../../../shared/widgets/error_view.dart';
import '../../../shared/widgets/loading_indicator.dart';
import '../providers/rooms_provider.dart';
import 'widgets/room_card_widget.dart';

class RoomCatalogScreen extends ConsumerWidget {
  const RoomCatalogScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedBuilding = ref.watch(selectedBuildingFilterProvider);
    final roomsAsync = ref.watch(roomsListProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Danh mục Phòng KTX'),
      ),
      body: Column(
        children: [
          _buildFilterTabs(ref, selectedBuilding),
          Expanded(
            child: roomsAsync.when(
              loading: () => const LoadingIndicator(message: 'Đang tải danh sách phòng...'),
              error: (err, stack) => ErrorView(
                message: err.toString(),
                onRetry: () => ref.refresh(roomsListProvider),
              ),
              data: (rooms) {
                if (rooms.isEmpty) {
                  return const EmptyView(
                    title: 'Không có phòng nào',
                    message: 'Không tìm thấy phòng phù hợp với bộ lọc đã chọn.',
                    icon: Icons.hotel_outlined,
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async => ref.refresh(roomsListProvider),
                  color: AppColors.fptOrange,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: rooms.length,
                    itemBuilder: (context, index) {
                      return RoomCardWidget(room: rooms[index]);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterTabs(WidgetRef ref, String selected) {
    final filters = [
      {'key': 'ALL', 'label': 'Tất cả tòa'},
      {'key': 'Tòa A', 'label': 'Tòa A (Nam)'},
      {'key': 'Tòa B', 'label': 'Tòa B (Nữ)'},
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      color: Colors.white,
      child: Row(
        children: filters.map((f) {
          final isSelected = selected == f['key'];
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(f['label']!),
              selected: isSelected,
              selectedColor: AppColors.fptOrange,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : AppColors.textPrimaryLight,
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              onSelected: (val) {
                if (val) {
                  ref.read(selectedBuildingFilterProvider.notifier).state = f['key']!;
                }
              },
            ),
          );
        }).toList(),
      ),
    );
  }
}

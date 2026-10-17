import 'package:flutter_riverpod/flutter_riverpod.dart';

class RoomModel {
  final String id;
  final String roomNumber;
  final String building;
  final String roomType; // 'STANDARD_4', 'PREMIUM_2', 'STANDARD_6'
  final int capacity;
  final int availableBeds;
  final double pricePerMonth;
  final List<String> amenities;

  const RoomModel({
    required this.id,
    required this.roomNumber,
    required this.building,
    required this.roomType,
    required this.capacity,
    required this.availableBeds,
    required this.pricePerMonth,
    required this.amenities,
  });
}

final selectedBuildingFilterProvider = StateProvider<String>((ref) => 'ALL');

final roomsListProvider = FutureProvider<List<RoomModel>>((ref) async {
  await Future<void>.delayed(const Duration(milliseconds: 300));

  final building = ref.watch(selectedBuildingFilterProvider);

  final allRooms = [
    const RoomModel(
      id: 'r1',
      roomNumber: 'A-201',
      building: 'Tòa A',
      roomType: 'Phòng 4 giường điều hòa',
      capacity: 4,
      availableBeds: 2,
      pricePerMonth: 1200000,
      amenities: ['Điều hòa Inverter', 'Bình nóng lạnh', 'Bàn học riêng', 'Ban công phơi đồ'],
    ),
    const RoomModel(
      id: 'r2',
      roomNumber: 'A-202',
      building: 'Tòa A',
      roomType: 'Phòng 4 giường điều hòa',
      capacity: 4,
      availableBeds: 0,
      pricePerMonth: 1200000,
      amenities: ['Điều hòa Inverter', 'Bình nóng lạnh', 'Bàn học riêng', 'Ban công phơi đồ'],
    ),
    const RoomModel(
      id: 'r3',
      roomNumber: 'B-101',
      building: 'Tòa B',
      roomType: 'Phòng 6 giường tiêu chuẩn',
      capacity: 6,
      availableBeds: 3,
      pricePerMonth: 850000,
      amenities: ['Quạt trần', 'Bình nóng lạnh', 'Tủ cá nhân', 'Ban công'],
    ),
    const RoomModel(
      id: 'r4',
      roomNumber: 'B-205',
      building: 'Tòa B',
      roomType: 'Phòng 2 giường dịch vụ',
      capacity: 2,
      availableBeds: 1,
      pricePerMonth: 2100000,
      amenities: ['Điều hòa', 'Tủ lạnh mini', 'Vệ sinh khép kín cao cấp', 'Wifi riêng'],
    ),
  ];

  if (building == 'ALL') return allRooms;
  return allRooms.where((r) => r.building == building).toList();
});

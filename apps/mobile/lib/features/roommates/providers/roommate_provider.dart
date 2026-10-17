import 'package:flutter_riverpod/flutter_riverpod.dart';

class RoommateMember {
  final String studentId;
  final String fullName;
  final bool isLeader;
  final String joinedAt;

  const RoommateMember({
    required this.studentId,
    required this.fullName,
    required this.isLeader,
    required this.joinedAt,
  });
}

class RoommateGroupState {
  final String? groupCode; // e.g. "PIN-9921"
  final String status; // 'OPEN', 'LOCKED', 'ASSIGNED'
  final List<RoommateMember> members;
  final bool isLoading;

  const RoommateGroupState({
    this.groupCode = 'CP-8842',
    this.status = 'OPEN',
    this.members = const [
      RoommateMember(studentId: 'SE170123', fullName: 'Nguyễn Xuân Lộc', isLeader: true, joinedAt: '16/08/2026'),
      RoommateMember(studentId: 'SE170456', fullName: 'Trần Minh Quân', isLeader: false, joinedAt: '17/08/2026'),
      RoommateMember(studentId: 'SE170889', fullName: 'Lê Hoàng Hải', isLeader: false, joinedAt: '18/08/2026'),
    ],
    this.isLoading = false,
  });

  RoommateGroupState copyWith({
    String? groupCode,
    String? status,
    List<RoommateMember>? members,
    bool? isLoading,
  }) {
    return RoommateGroupState(
      groupCode: groupCode ?? this.groupCode,
      status: status ?? this.status,
      members: members ?? this.members,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class RoommateNotifier extends StateNotifier<RoommateGroupState> {
  RoommateNotifier() : super(const RoommateGroupState());

  Future<void> createGroup() async {
    state = state.copyWith(isLoading: true);
    await Future<void>.delayed(const Duration(milliseconds: 400));
    state = const RoommateGroupState(
      groupCode: 'CP-9901',
      status: 'OPEN',
      members: [
        RoommateMember(studentId: 'SE170123', fullName: 'Nguyễn Xuân Lộc', isLeader: true, joinedAt: 'Hôm nay'),
      ],
      isLoading: false,
    );
  }

  Future<void> joinGroup(String pin) async {
    state = state.copyWith(isLoading: true);
    await Future<void>.delayed(const Duration(milliseconds: 400));
    state = state.copyWith(
      groupCode: pin,
      isLoading: false,
      members: [
        ...state.members,
        const RoommateMember(studentId: 'SE170999', fullName: 'Võ Quốc Anh', isLeader: false, joinedAt: 'Vừa xong'),
      ],
    );
  }

  Future<void> leaveGroup() async {
    state = state.copyWith(isLoading: true);
    await Future<void>.delayed(const Duration(milliseconds: 300));
    state = const RoommateGroupState(groupCode: null, members: [], isLoading: false);
  }
}

final roommateProvider =
    StateNotifierProvider<RoommateNotifier, RoommateGroupState>((ref) {
  return RoommateNotifier();
});

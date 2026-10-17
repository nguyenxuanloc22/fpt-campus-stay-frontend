import 'package:flutter_riverpod/flutter_riverpod.dart';

class RegistrationFormState {
  final int currentStep; // 0: Eligibility, 1: Room preference, 2: Roommates, 3: Review
  final bool isEligible;
  final String? eligibilityReason;
  final String selectedSemester;
  final String selectedRoomType;
  final String selectedBedPreference; // 'LOWER', 'UPPER', 'ANY'
  final String roommateCode;
  final bool isSubmitting;
  final bool isSuccess;

  const RegistrationFormState({
    this.currentStep = 0,
    this.isEligible = true,
    this.eligibilityReason = 'Đạt điều kiện: Sinh viên chính quy FPT Campus Tân Uyên',
    this.selectedSemester = 'Fall 2026',
    this.selectedRoomType = 'Phòng 4 giường điều hòa',
    this.selectedBedPreference = 'LOWER',
    this.roommateCode = '',
    this.isSubmitting = false,
    this.isSuccess = false,
  });

  RegistrationFormState copyWith({
    int? currentStep,
    bool? isEligible,
    String? eligibilityReason,
    String? selectedSemester,
    String? selectedRoomType,
    String? selectedBedPreference,
    String? roommateCode,
    bool? isSubmitting,
    bool? isSuccess,
  }) {
    return RegistrationFormState(
      currentStep: currentStep ?? this.currentStep,
      isEligible: isEligible ?? this.isEligible,
      eligibilityReason: eligibilityReason ?? this.eligibilityReason,
      selectedSemester: selectedSemester ?? this.selectedSemester,
      selectedRoomType: selectedRoomType ?? this.selectedRoomType,
      selectedBedPreference: selectedBedPreference ?? this.selectedBedPreference,
      roommateCode: roommateCode ?? this.roommateCode,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      isSuccess: isSuccess ?? this.isSuccess,
    );
  }
}

class RegistrationNotifier extends StateNotifier<RegistrationFormState> {
  RegistrationNotifier() : super(const RegistrationFormState());

  void setStep(int step) => state = state.copyWith(currentStep: step);
  void nextStep() => state = state.copyWith(currentStep: state.currentStep + 1);
  void prevStep() => state = state.copyWith(currentStep: state.currentStep - 1);

  void updateRoomPreference(String roomType, String bedPref) {
    state = state.copyWith(selectedRoomType: roomType, selectedBedPreference: bedPref);
  }

  void updateRoommateCode(String code) {
    state = state.copyWith(roommateCode: code);
  }

  Future<void> submitRegistration() async {
    state = state.copyWith(isSubmitting: true);
    await Future<void>.delayed(const Duration(milliseconds: 600));
    state = state.copyWith(isSubmitting: false, isSuccess: true);
  }
}

final registrationProvider =
    StateNotifierProvider<RegistrationNotifier, RegistrationFormState>((ref) {
  return RegistrationNotifier();
});

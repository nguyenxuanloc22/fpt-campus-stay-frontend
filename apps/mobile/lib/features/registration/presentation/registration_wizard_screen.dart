import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/app_button.dart';
import '../providers/registration_provider.dart';
import 'widgets/eligibility_step_widget.dart';
import 'widgets/review_submit_step_widget.dart';
import 'widgets/room_preference_step_widget.dart';

class RegistrationWizardScreen extends ConsumerWidget {
  const RegistrationWizardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final form = ref.watch(registrationProvider);
    final notifier = ref.read(registrationProvider.notifier);

    if (form.isSuccess) {
      return Scaffold(
        backgroundColor: AppColors.backgroundLight,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.check_circle, size: 64, color: AppColors.success),
                const SizedBox(height: 16),
                const Text(
                  'Đăng ký thành công!',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.fptNavy),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Đơn đăng ký KTX Fall 2026 của bạn đã được gửi tới Ban Quản trị KTX Tân Uyên.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: AppColors.textSecondaryLight),
                ),
                const SizedBox(height: 24),
                AppButton(
                  label: 'Về trang chủ',
                  onPressed: () => context.go('/home'),
                  width: 160,
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Đăng ký Ký túc xá'),
      ),
      body: Column(
        children: [
          _buildStepProgress(form.currentStep),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: _buildCurrentStep(form, notifier),
            ),
          ),
          _buildBottomBar(context, form, notifier),
        ],
      ),
    );
  }

  Widget _buildStepProgress(int currentStep) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: List.generate(3, (index) {
          final isActive = index <= currentStep;
          return Expanded(
            child: Container(
              height: 4,
              margin: const EdgeInsets.symmetric(horizontal: 2),
              decoration: BoxDecoration(
                color: isActive ? AppColors.fptOrange : AppColors.borderLight,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildCurrentStep(RegistrationFormState form, RegistrationNotifier notifier) {
    switch (form.currentStep) {
      case 0:
        return EligibilityStepWidget(form: form);
      case 1:
        return RoomPreferenceStepWidget(
          form: form,
          onChanged: (room, bed) => notifier.updateRoomPreference(room, bed),
        );
      case 2:
      default:
        return ReviewSubmitStepWidget(form: form);
    }
  }

  Widget _buildBottomBar(BuildContext context, RegistrationFormState form, RegistrationNotifier notifier) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: Row(
        children: [
          if (form.currentStep > 0) ...[
            Expanded(
              child: AppButton(
                label: 'Quay lại',
                variant: AppButtonVariant.outline,
                onPressed: () => notifier.prevStep(),
              ),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: AppButton(
              label: form.currentStep == 2 ? 'Nộp đơn đăng ký' : 'Tiếp tục',
              isLoading: form.isSubmitting,
              onPressed: () {
                if (form.currentStep == 2) {
                  notifier.submitRegistration();
                } else {
                  notifier.nextStep();
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}

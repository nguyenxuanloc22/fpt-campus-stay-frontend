import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/role_notice_screen.dart';
import '../../features/auth/providers/auth_state_provider.dart';
import '../../features/checkin/presentation/checkin_appointment_screen.dart';
import '../../features/contracts/presentation/contract_view_screen.dart';
import '../../features/dashboard/presentation/student_dashboard_screen.dart';
import '../../features/invoices/presentation/vietqr_payment_screen.dart';
import '../../features/maintenance/presentation/maintenance_list_screen.dart';
import '../../features/maintenance/presentation/new_ticket_screen.dart';
import '../../features/registration/presentation/registration_wizard_screen.dart';
import '../../features/roommates/presentation/roommate_group_screen.dart';
import '../../features/rooms/presentation/room_catalog_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/home',
    redirect: (context, state) {
      final isLoggingIn = state.matchedLocation == '/login';
      final isNotice = state.matchedLocation == '/notice';

      if (!auth.isAuthenticated) {
        return isLoggingIn ? null : '/login';
      }

      // If a non-student logged in on mobile, redirect to notice screen
      if (auth.role != 'STUDENT') {
        return isNotice ? null : '/notice';
      }

      if (isLoggingIn || isNotice) {
        return '/home';
      }

      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/notice', builder: (context, state) => const RoleNoticeScreen()),
      GoRoute(path: '/home', builder: (context, state) => const StudentDashboardScreen()),
      GoRoute(path: '/rooms', builder: (context, state) => const RoomCatalogScreen()),
      GoRoute(path: '/registration', builder: (context, state) => const RegistrationWizardScreen()),
      GoRoute(path: '/roommates', builder: (context, state) => const RoommateGroupScreen()),
      GoRoute(path: '/contract', builder: (context, state) => const ContractViewScreen()),
      GoRoute(path: '/payment', builder: (context, state) => const VietQrPaymentScreen()),
      GoRoute(path: '/maintenance', builder: (context, state) => const MaintenanceListScreen()),
      GoRoute(path: '/maintenance/new', builder: (context, state) => const NewTicketScreen()),
      GoRoute(path: '/checkin', builder: (context, state) => const CheckinAppointmentScreen()),
    ],
  );
});

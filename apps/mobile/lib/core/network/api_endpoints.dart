class ApiEndpoints {
  ApiEndpoints._();

  static const String login = '/auth/login';
  static const String me = '/auth/me';

  static const String currentSemester = '/semesters/current';
  static const String checkEligibility = '/eligibility/check';

  static const String buildings = '/buildings';
  static const String rooms = '/rooms';
  static String roomDetail(String id) => '/rooms/$id';

  static const String myApplication = '/applications/my';
  static const String submitApplication = '/applications';

  static const String myRoommateGroup = '/roommates/groups/my';
  static const String createRoommateGroup = '/roommates/groups';
  static const String joinRoommateGroup = '/roommates/groups/join';

  static const String myContract = '/contracts/my';
  static String signContract(String id) => '/contracts/$id/sign';

  static const String invoices = '/invoices';
  static String invoiceVietQr(String id) => '/invoices/$id/vietqr';

  static const String maintenance = '/maintenance';

  static const String checkinAppointments = '/checkin/appointments';
}

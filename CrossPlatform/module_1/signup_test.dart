import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:whisper/main.dart' as app;
import 'package:whisper/keys/login-keys.dart';
import 'package:whisper/keys/home-keys.dart';
import 'test_cases/test_cases.dart';
import 'package:whisper/keys/signup-keys.dart';
import 'integration_test/utils/auth_user.dart';
import 'integration_test/utils/test_common_functions.dart';

const String empty_field = 'Form is invalid';
const String invalid_username_error_message = 'Form is invalid';
const String invalid_name_error_message = 'Form is invalid';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  group('Sign up E2E tests', () {
    late Finder email_field_login;
    late Finder password_field_login;
    late Finder login_button_login;
    late Finder sign_up_button_login;
    late Finder email_field_sign_up;
    late Finder username_field_sign_up;
    late Finder name_field_sign_up;
    late Finder password_field_sign_up;
    late Finder re_password_field_sign_up;
    late Finder phone_number;
    late Finder sign_up_button_sign_up;
    late Finder login_button_sign_up;
    late Finder go_back_from_recaptcha;
    late Finder go_back_from_code;
    late Finder code_field;
    late Finder submit_code_button;
    late Finder resend_code;
    testWidgets(
        'Initialization and Ensuring routing from signup page to login page',
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      email_field_login =
          find.byKey(const ValueKey(LoginKeys.emailTextFieldKey));
      password_field_login =
          find.byKey(const ValueKey(LoginKeys.passwordTextFieldKey));
      login_button_login = find.byKey(const ValueKey(LoginKeys.loginButtonKey));
      sign_up_button_login =
          find.byKey(const ValueKey(LoginKeys.registerHighLightTextKey));
      await tester.tap(sign_up_button_login);
      await tester.pumpAndSettle();
      email_field_sign_up =
          find.byKey(const ValueKey(SignupKeys.emailTextFieldKey));
      username_field_sign_up =
          find.byKey(const ValueKey(SignupKeys.usernameTextFieldKey));
      name_field_sign_up =
          find.byKey(const ValueKey(SignupKeys.nameTextFieldKey));
      password_field_sign_up =
          find.byKey(const ValueKey(SignupKeys.passwordTextFieldKey));
      re_password_field_sign_up =
          find.byKey(const ValueKey(SignupKeys.rePasswordTextFieldKey));
      phone_number = find.byKey(const ValueKey(SignupKeys.phoneNumberFieldKey));
      login_button_sign_up =
          find.byKey(const ValueKey(SignupKeys.goBackToLoginHighlightTextKey));
      sign_up_button_sign_up =
          find.byKey(const ValueKey(SignupKeys.goToRecaptchaButtonKey));
      await tester.tap(login_button_sign_up);
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey(LoginKeys.emailTextFieldKey)),
          findsOneWidget);
    });
    testWidgets('Ensure name testcases are covered',
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      final List<String> errors = [];
      await tester.tap(sign_up_button_login);
      await tester.pumpAndSettle();
      await tester.enterText(email_field_sign_up, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.enterText(username_field_sign_up, 'testusername');
      await tester.pumpAndSettle();
      await tester.enterText(
          password_field_sign_up, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      await tester.enterText(
          re_password_field_sign_up, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      await tester.enterText(phone_number, '1234567890');
      await tester.pumpAndSettle();
      for (String testcase in test_cases['Invalid Names']!) {
        await tester.tap(name_field_sign_up);
        await tester.pumpAndSettle();
        await tester.enterText(name_field_sign_up, testcase);
        await tester.pumpAndSettle();
        await tester.tap(re_password_field_sign_up);
        await tester.pumpAndSettle();
        await tester.tap(phone_number);
        await tester.pumpAndSettle();
        await tester.tap(sign_up_button_sign_up);
        await tester.pumpAndSettle();
        try {
          expect(
              find.textContaining(invalid_name_error_message), findsOneWidget);
        } catch (e) {
          await tester.pumpAndSettle(Duration(seconds: 5));
          go_back_from_recaptcha = find.byKey(
              const ValueKey(SignupKeys.goBackFromRecaptchaHighlightTextKey));
          await tester.tap(go_back_from_recaptcha);
          errors.add("Test case failed for invalid name: '$testcase'");
        }
      }
      //try empty
      await tester.enterText(name_field_sign_up, '');
      await tester.pumpAndSettle();
      await tester.tap(re_password_field_sign_up);
      await tester.pumpAndSettle();
      await tester.tap(phone_number);
      await tester.pumpAndSettle();
      await tester.tap(sign_up_button_sign_up);
      await tester.pumpAndSettle();
      try {
        expect(find.text(empty_field), findsOneWidget);
      } catch (e) {
        errors.add("Test case failed for empty name field - ");
      }
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });
    testWidgets('Ensure username testcases are covered',
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      final List<String> errors = [];
      await tester.tap(sign_up_button_login);
      await tester.pumpAndSettle();
      await tester.enterText(email_field_sign_up, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.enterText(name_field_sign_up, 'John Doe');
      await tester.pumpAndSettle();
      await tester.enterText(
          password_field_sign_up, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      await tester.enterText(
          re_password_field_sign_up, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      await tester.enterText(phone_number, '1234567890');
      await tester.pumpAndSettle();
      for (String testcase in test_cases['Invalid Usernames']!) {
        await tester.enterText(username_field_sign_up, testcase);
        await tester.pumpAndSettle();
        await tester.tap(re_password_field_sign_up);
        await tester.pumpAndSettle();
        await tester.tap(phone_number);
        await tester.pumpAndSettle();
        await tester.tap(sign_up_button_sign_up);
        await tester.pumpAndSettle();
        try {
          expect(find.textContaining(invalid_username_error_message),
              findsOneWidget);
        } catch (e) {
          await tester.pumpAndSettle(Duration(seconds: 5));
          go_back_from_recaptcha = find.byKey(
              const ValueKey(SignupKeys.goBackFromRecaptchaHighlightTextKey));
          await tester.tap(go_back_from_recaptcha);
          errors.add("Test case failed for invalid username: '$testcase'");
        }
      }
      //try empty
      await tester.enterText(username_field_sign_up, '');
      await tester.pumpAndSettle();
      await tester.tap(re_password_field_sign_up);
      await tester.pumpAndSettle();
      await tester.tap(phone_number);
      await tester.pumpAndSettle();
      await tester.tap(sign_up_button_sign_up);
      await tester.pumpAndSettle();
      try {
        expect(find.text(empty_field), findsOneWidget);
      } catch (e) {
        errors.add("Test case failed for empty username field");
      }
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });
    testWidgets('Test Phone Number', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      final List<String> errors = [];
      await tester.tap(sign_up_button_login);
      await tester.pumpAndSettle();
      await tester.enterText(email_field_sign_up, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.enterText(name_field_sign_up, 'John Doe');
      await tester.pumpAndSettle();
      await tester.enterText(username_field_sign_up, 'testusername');
      await tester.pumpAndSettle();
      await tester.enterText(
          password_field_sign_up, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      await tester.enterText(
          re_password_field_sign_up, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      await tester.enterText(phone_number, '1234567');
      await tester.pumpAndSettle();
      await tester.tap(sign_up_button_sign_up);
      await tester.pumpAndSettle();
      try {
        expect(find.textContaining('Form is invalid'), findsOneWidget);
      } catch (e) {
        errors.add("Test case failed for invalid phone number - ");
      }
      //try empty
      await tester.enterText(phone_number, '');
      await tester.pumpAndSettle();
      await tester.tap(sign_up_button_sign_up);
      await tester.pumpAndSettle();
      try {
        expect(find.text(empty_field), findsOneWidget);
      } catch (e) {
        errors.add("Test case failed for empty phone number field - ");
      }
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });
  });
}

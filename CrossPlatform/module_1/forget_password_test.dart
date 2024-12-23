import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:whisper/main.dart' as app;
import 'package:whisper/keys/login-keys.dart';
import 'test_cases/test_cases.dart';
import 'package:whisper/keys/forgot-password-keys.dart';
import 'package:whisper/keys/home-keys.dart';
import 'integration_test/utils/auth_user.dart';
import 'integration_test/utils/test_common_functions.dart';

const String invalid_email_error_message = 'Enter a valid email';
const String empty_field_error_message = 'This field is required';
const String not_existing_email_error_message = 'existed in DB';
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  group('Forget Password E2E Tests', () {
    late Finder forget_password_text;
    late Finder email_field;
    late Finder send_code_button;
    late Finder resend_code_button;
    late Finder go_back_from_code_and_passwords;
    late Finder code_field;
    late Finder password_field;
    late Finder re_password_field;

    testWidgets('Forget Password with invalid email',
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      forget_password_text =
          find.byKey(const ValueKey(LoginKeys.forgotPasswordHighlightText));
      // Navigate to Forget Password screen
      await tester.tap(forget_password_text);
      await tester.pumpAndSettle();

      email_field =
          find.byKey(const ValueKey(ForgotPasswordKeys.emailTextFieldKey));
      send_code_button =
          find.byKey(const ValueKey(ForgotPasswordKeys.sendCodeButtonKey));

      final List<String> errors = [];

      await tester.enterText(email_field, test_cases['Invalid Emails']![0]);
      await tester.tap(send_code_button);
      await tester.pumpAndSettle();
      try {
        expect(find.text(invalid_email_error_message), findsOneWidget);
      } catch (e) {
        errors.add("Forget password failed with invalid email: ");
      }

      await tester.enterText(email_field, '');
      await tester.tap(send_code_button);
      await tester.pumpAndSettle();
      try {
        expect(find.text(empty_field_error_message), findsOneWidget);
      } catch (e) {
        errors.add("Forget password failed with empty email field: ");
      }
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });

    testWidgets("Valid but not existing emails", (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(forget_password_text);
      await tester.pumpAndSettle();
      await tester.enterText(
          email_field, test_cases['Valid but Not Existing Emails']![0]);
      await tester.pumpAndSettle();
      await tester.tap(send_code_button);
      await tester.pumpAndSettle();
      try {
        expect(find.textContaining(not_existing_email_error_message),
            findsOneWidget);
      } catch (e) {
        fail("Forget password failed with not existing email: ");
      }
    });
    testWidgets("Forget Password with valid email",
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(forget_password_text);
      await tester.pumpAndSettle();
      //sending the code
      await tester.enterText(email_field, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.tap(send_code_button);
      await tester.pumpAndSettle();
      await tester.pumpAndSettle(Duration(seconds: 10));
      //Navigate back
      go_back_from_code_and_passwords = find.byKey(const ValueKey(
          ForgotPasswordKeys.goBackFromCodeAndPasswordsHighlightTextKey));
      await tester.tap(go_back_from_code_and_passwords);
      await tester.pumpAndSettle();
      //sending the code again
      await tester.enterText(email_field, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.tap(send_code_button);
      await tester.pumpAndSettle();
      // Get the first code from the email
      final String? firstCode = await getVerificationCode();
      expect(firstCode, isNotNull);
      resend_code_button = find
          .byKey(const ValueKey(ForgotPasswordKeys.resendCodeHighlightTextKey));
      await tester.tap(resend_code_button);
      await tester.pumpAndSettle();
      await tester.pumpAndSettle(Duration(seconds: 5));
      // Get the second code from the email
      final String? secondCode = await getVerificationCode();
      expect(firstCode, isNot(secondCode));
      code_field =
          find.byKey(const ValueKey(ForgotPasswordKeys.codeTextFieldKey));
      await tester.pumpAndSettle();
      // Testing with invalid code
      password_field =
          find.byKey(const ValueKey(ForgotPasswordKeys.passwordTextFieldKey));
      re_password_field =
          find.byKey(const ValueKey(ForgotPasswordKeys.rePasswordTextFieldKey));
      var save_password_and_login_button = find.byKey(
          const ValueKey(ForgotPasswordKeys.savePasswordAndLoginButtonKey));
      await tester.enterText(password_field, AuthUser.password_whisper_test_2);
      await tester.pumpAndSettle();
      await tester.enterText(
          re_password_field, AuthUser.password_whisper_test_2);
      await tester.pumpAndSettle();
      await tester.enterText(code_field, '12345678');
      await tester.pumpAndSettle();
      save_password_and_login_button = find.byKey(
          const ValueKey(ForgotPasswordKeys.savePasswordAndLoginButtonKey));
      await tester.tap(save_password_and_login_button);
      await tester.pumpAndSettle();
      try {
        expect(find.textContaining('Invalid code'), findsOneWidget);
      } catch (e) {
        fail("Forget password failed with invalid code: ");
      }
    });
    testWidgets("Forget Password with valid code and not similar passwords",
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(forget_password_text);
      await tester.pumpAndSettle();
      await tester.enterText(email_field, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.tap(send_code_button);
      await tester.pumpAndSettle();
      await tester.pumpAndSettle(Duration(seconds: 10));
      final String? firstCode = await getVerificationCode();
      // Testing with valid code and passwords doesn't match
      await tester.enterText(code_field, firstCode!);
      await tester.pumpAndSettle();
      await tester.enterText(password_field, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      await tester.enterText(
          re_password_field, '${AuthUser.password_whisper_test_1}66');
      await tester.pumpAndSettle();
      var save_password_and_login_button =
          find.widgetWithText(ElevatedButton, 'Save password and login');
      await tester.tap(save_password_and_login_button);
      await tester.pumpAndSettle();
      try {
        expect(find.textContaining('not similar'), findsOneWidget);
      } catch (e) {
        fail("Forget password failed with passwords not similar: ");
      }
    });
    testWidgets("Forget Password with valid code and passwords match",
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(forget_password_text);
      await tester.pumpAndSettle();
      await tester.enterText(email_field, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.tap(send_code_button);
      await tester.pumpAndSettle();
      await tester.pumpAndSettle(Duration(seconds: 5));
      final String? firstCode = await getVerificationCode();
      await tester.enterText(code_field, firstCode!);
      await tester.pumpAndSettle();
      await tester.enterText(password_field, AuthUser.password_whisper_test_2);
      await tester.enterText(
          re_password_field, AuthUser.password_whisper_test_2);
      await tester.pumpAndSettle();
      var save_password_and_login_button = find.byKey(
          const ValueKey(ForgotPasswordKeys.savePasswordAndLoginButtonKey));
      await tester.tap(save_password_and_login_button);
      await tester.pumpAndSettle();
      try {
        expect(find.text('Yes'), findsOneWidget);
      } catch (e) {
        fail("Forget password failed with valid code and passwords match: ");
      }
      //Say yes to Logout from all devices
      final yesButton = find.text('Yes');
      await tester.tap(yesButton);
      await tester.pumpAndSettle();
      //Try to Login with the new Password
      final loginButton = find.byKey(const ValueKey(LoginKeys.loginButtonKey));
      final emailFieldLogin =
          find.byKey(const ValueKey(LoginKeys.emailTextFieldKey));
      final passwordFieldLogin =
          find.byKey(const ValueKey(LoginKeys.passwordTextFieldKey));
      await tester.enterText(emailFieldLogin, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.enterText(
          passwordFieldLogin, AuthUser.password_whisper_test_2);
      await tester.pumpAndSettle();
      await tester.tap(loginButton);
      await tester.pumpAndSettle(Duration(seconds: 10));
      try {
        expect(find.byKey(const ValueKey(HomeKeys.logoutButtonKey)),
            findsOneWidget);
        await tester.tap(find.byKey(const ValueKey(HomeKeys.logoutButtonKey)));
        await tester.pumpAndSettle();
      } catch (e) {
        fail("Login failed after changing password: ");
      }
    });
    testWidgets(
        "Forget Password with valid code and passwords match but don't logout from all devices",
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(forget_password_text);
      await tester.pumpAndSettle();
      await tester.enterText(email_field, AuthUser.email_whisper_test);
      await tester.pumpAndSettle();
      await tester.tap(send_code_button);
      await tester.pumpAndSettle();
      await tester.pumpAndSettle(Duration(seconds: 10));
      final String? thirdCode = await getVerificationCode();
      await tester.enterText(code_field, thirdCode!);
      await tester.pumpAndSettle();
      await tester.enterText(password_field, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      await tester.enterText(
          re_password_field, AuthUser.password_whisper_test_1);
      await tester.pumpAndSettle();
      var save_password_and_login_button = find.byKey(
          const ValueKey(ForgotPasswordKeys.savePasswordAndLoginButtonKey));
      await tester.tap(save_password_and_login_button);
      await tester.pumpAndSettle();
      final noButton = find.text('No');
      await tester.tap(noButton);
      await tester.pumpAndSettle();
      try {
        expect(find.byKey(const ValueKey(HomeKeys.logoutButtonKey)),
            findsOneWidget);
        await tester.tap(find.byKey(const ValueKey(HomeKeys.logoutButtonKey)));
        await tester.pumpAndSettle();
      } catch (e) {
        fail("Forget password failed after saying no: ");
      }
    });
  });
}

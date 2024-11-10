import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:whisper/main.dart' as app;
import 'package:whisper/keys/login-keys.dart';
import 'package:whisper/keys/home-keys.dart';
import 'test_cases/test_cases.dart';
import 'package:whisper/keys/forgot-password-keys.dart';
import 'package:whisper/keys/signup-keys.dart';
import 'utils/auth_user.dart';

const String invalid_email_error_message = 'Enter a valid email';
const String empty_field_error_message = 'This field is required';
const String not_existing_email_error_message = 'existed in DB';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  group('Login E2E Tests', () {
    late Finder email_field;
    late Finder password_field;
    late Finder login_button;
    late Finder forget_password_text;
    late Finder signup_button;
    setUp(() async {
      try {
        email_field = find.byKey(const ValueKey(LoginKeys.emailTextFieldKey));
        password_field =
            find.byKey(const ValueKey(LoginKeys.passwordTextFieldKey));
        login_button = find.byKey(const ValueKey(LoginKeys.loginButtonKey));
        forget_password_text =
            find.byKey(const ValueKey(LoginKeys.forgotPasswordHighlightText));
        signup_button =
            find.byKey(const ValueKey(LoginKeys.registerHighLightTextKey));
      } catch (e) {
        fail("setup failed: Can't find fields: $e"); // Log error
      }
    });

    testWidgets('Login with invalid email and valid password',
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Initialize a list to capture errors
      final List<String> errors = [];

      await tester.enterText(password_field, 'ValidPass@@13');

      // Test invalid emails
      for (String testcase in test_cases['Invalid Emails']!) {
        await tester.enterText(email_field, testcase);
        await tester.tap(login_button);
        await tester.pumpAndSettle();
        try {
          expect(find.text(invalid_email_error_message), findsOneWidget);
        } catch (e) {
          errors.add("Test case failed for invalid email: '$testcase' - $e");
        }
      }

      // Test empty field
      await tester.enterText(email_field, '');
      await tester.tap(login_button);
      await tester.pumpAndSettle();
      try {
        expect(find.text(empty_field_error_message), findsOneWidget);
      } catch (e) {
        errors.add("Test case failed for empty email field - $e");
      }

      // If there are any errors, fail the test and display the accumulated messages
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });

    testWidgets('Login with valid email and invalid password',
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Initialize a list to capture errors
      final List<String> errors = [];

      // Enter a valid email
      await tester.enterText(email_field, AuthUser.email);

      // Test invalid passwords
      for (String testcase in test_cases['Invalid Passwords']!) {
        await tester.enterText(password_field, testcase);
        await tester.tap(login_button);
        await tester.pumpAndSettle();
        try {
          expect(find.textContaining('Password must'), findsOneWidget);
        } catch (e) {
          errors.add("Test case failed for invalid password '$testcase' - $e");
        }
      }

      // Test empty password field
      await tester.enterText(password_field, '');
      await tester.tap(login_button);
      await tester.pumpAndSettle();
      try {
        expect(find.text(empty_field_error_message), findsOneWidget);
      } catch (e) {
        errors.add("Test case failed for empty password field - $e");
      }

      // If there are any errors, fail the test and display the accumulated messages
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });

    testWidgets('Login with valid but non-existing emails and password',
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Initialize a list to capture errors
      final List<String> errors = [];

      // Enter a valid password
      await tester.enterText(password_field, 'ValidPass@@13');

      // Test valid but non-existing emails
      for (String testcase in test_cases['Valid but Not Existing Emails']!) {
        await tester.enterText(email_field, testcase);
        await tester.tap(login_button);
        await tester.pumpAndSettle();
        try {
          expect(find.textContaining(not_existing_email_error_message),
              findsOneWidget);
        } catch (e) {
          errors.add(
              "Test case failed for valid but non-existing email '$testcase' - $e");
        }
      }

      // If there are any errors, fail the test and display the accumulated messages
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });

    testWidgets('Login with valid email and password',
        (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Initialize a list to capture errors
      final List<String> errors = [];

      // Enter valid email and password
      await tester.enterText(email_field, AuthUser.email);
      await tester.enterText(password_field, AuthUser.password);
      await tester.tap(login_button);
      await tester.pumpAndSettle(Duration(seconds: 5));
      try {
        // Verify logout button appears after successful login
        expect(find.byKey(const ValueKey(HomeKeys.logoutButtonKey)),
            findsOneWidget);

        // Tap logout button to return to login screen
        await tester.tap(find.byKey(const ValueKey(HomeKeys.logoutButtonKey)));
        await tester.pumpAndSettle();

        // Confirm email field is visible on login screen
        expect(find.byKey(const ValueKey(LoginKeys.emailTextFieldKey)),
            findsOneWidget);
      } catch (e) {
        errors.add("Login failed - $e");
      }

      // If there are any errors, fail the test and display the accumulated messages
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });

    testWidgets("Ensure Visibility and Routing", (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Initialize a list to capture errors
      final List<String> errors = [];

      // Navigate to "Forget Password" screen and verify email field visibility
      await tester.tap(forget_password_text);
      await tester.pumpAndSettle();
      try {
        expect(find.byKey(const ValueKey(ForgotPasswordKeys.emailTextFieldKey)),
            findsOneWidget);
      } catch (e) {
        errors.add(
            " failed to find email text field on 'Forget Password' screen - $e");
      }

      // Go back to login screen and verify email field visibility
      var go_back = find.byKey(const ValueKey(
          ForgotPasswordKeys.goBackFromForgotPasswordHighlightTextKey));
      await tester.tap(go_back);
      await tester.pumpAndSettle();
      try {
        expect(find.byKey(const ValueKey(LoginKeys.emailTextFieldKey)),
            findsOneWidget);
      } catch (e) {
        errors.add(
            " failed to navigate back to login screen from 'Forget Password' - $e");
      }

      // Navigate to "Signup" screen and verify email field visibility
      await tester.tap(signup_button);
      await tester.pumpAndSettle();
      try {
        expect(find.byKey(const ValueKey(SignupKeys.emailTextFieldKey)),
            findsOneWidget);
      } catch (e) {
        errors.add(" failed to find email text field on 'Signup' screen - $e");
      }

      // Go back to login screen from "Signup" screen and verify email field visibility
      go_back =
          find.byKey(const ValueKey(SignupKeys.goBackToLoginHighlightTextKey));
      await tester.tap(go_back);
      await tester.pumpAndSettle();
      try {
        expect(find.byKey(const ValueKey(LoginKeys.emailTextFieldKey)),
            findsOneWidget);
      } catch (e) {
        errors
            .add(" failed to navigate back to login screen from 'Signup' - $e");
      }
      if (errors.isNotEmpty) {
        fail(errors.join('\n'));
      }
    });
  });
}

# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of RetailRx seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@retailrx.example.com

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to Expect

- A confirmation email acknowledging your report within 48 hours
- An assessment of the vulnerability and its impact
- A timeline for addressing the vulnerability
- Notification when the vulnerability has been fixed

## Security Best Practices

When deploying RetailRx, please follow these security best practices:

### Environment Variables

- Never commit `.env` files to version control
- Use strong, unique values for all secrets
- Rotate credentials regularly
- Use environment-specific configurations

### Database Security

- Enable Row Level Security (RLS) on all tables
- Use the principle of least privilege for database roles
- Regularly audit database access logs
- Keep Supabase and dependencies updated

### Authentication

- Enforce strong password policies
- Implement rate limiting on authentication endpoints
- Use secure session management
- Enable multi-factor authentication when possible

### Application Security

- Keep all dependencies updated
- Run `npm audit` regularly to check for vulnerabilities
- Use HTTPS in production
- Implement proper CORS policies
- Sanitize all user inputs

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new versions and notify users

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.

# Authentication System API Documentation

## Overview

This document describes the complete authentication and onboarding system for the Koshish Welfare application. The system implements a hierarchical onboarding workflow:

1. **Coordinator** (hardcoded credentials) → Onboards **Co-Circular** users
2. **Co-Circular** → Onboards **Teachers**
3. **Teacher** → Onboards **Students**
4. **Student** → Can recover credentials

## Database Credentials

All passwords are hashed using bcrypt (salt rounds: 10) before storage. Upon account creation, users receive:

- When created via onboarding: Temporary credentials sent via email
- When recovering credentials: New temporary password

## Authentication Hierarchy

```
Coordinator (Config-based)
    ↓
Co-Circular (Database-based)
    ↓
Teacher (Database-based)
    ↓
Student (Database-based)
```

---

## Endpoints

### 1. Coordinator Login

**Endpoint:** `POST /api/coordinater/login`

**Description:** Authenticates coordinator using hardcoded credentials from config

**Request Body:**

```json
{
  "username": "coordinator_username",
  "password": "coordinator_password"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "role": "coordinator",
  "message": "You are login"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Note:** Credentials managed in `config.js` under `auth.coordinator`

---

### 2. Co-Circular Onboarding (by Coordinator)

**Endpoint:** `POST /api/coordinater/onboard-cocircular`

**Authentication:** Requires valid coordinator token

**Description:** Creates a new Co-Circular user account with temporary credentials

**Request Body:**

```json
{
  "name": "Dr. Rahul Sharma",
  "email": "rahul.sharma@koshish.org",
  "speciality": "Sports",
  "degree": "B.tech",
  "about": "Expert in organizing sports events"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Co-Curricular user onboarded successfully",
  "data": {
    "_id": "mongo_id",
    "name": "Dr. Rahul Sharma",
    "email": "rahul.sharma@koshish.org",
    "speciality": "Sports",
    "degree": "B.tech",
    "isactive": true
  },
  "email": {
    "sent": true,
    "reason": null
  },
  "credentials": null
}
```

**Response when email fails:**

```json
{
  "success": true,
  "message": "Co-Curricular user onboarded successfully",
  "email": {
    "sent": false,
    "reason": "SMTP not configured"
  },
  "credentials": {
    "email": "rahul.sharma@koshish.org",
    "password": "GeneratedTempPassword123@"
  }
}
```

**Database Fields Stored:**

- `name` (required)
- `email` (required, unique, lowercase)
- `password` (hashed with bcrypt)
- `speciality` (required)
- `degree` (default: B.tech)
- `about` (required)
- `date` (auto: current timestamp)
- `isactive` (default: true)

---

### 3. Co-Circular Login

**Endpoint:** `POST /api/cocircular/login`

**Description:** Authenticates co-circular user with email and password

**Request Body:**

```json
{
  "email": "rahul.sharma@koshish.org",
  "password": "TempPassword123@"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Co-Curricular login successful",
  "token": "jwt_token_here",
  "cocircular": {
    "_id": "mongo_id",
    "name": "Dr. Rahul Sharma",
    "email": "rahul.sharma@koshish.org",
    "speciality": "Sports"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Authentication:** Uses bcrypt password comparison for validation

---

### 4. Teacher Onboarding (by Co-Circular)

**Endpoint:** `POST /api/cocircular/academic/teacher/add`

**Authentication:** Requires valid co-circular token

**Description:** Creates a new Teacher account for a specific academic session

**Request Body:**

```json
{
  "name": "Prof. John Doe",
  "email": "john.doe@koshish.org",
  "phoneNumber": "9876543210",
  "sessionId": "session_mongo_id",
  "username": "johndoe"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Teacher added successfully",
  "data": {
    "_id": "mongo_id",
    "username": "johndoe",
    "email": "john.doe@koshish.org",
    "phoneNumber": "9876543210",
    "sessionId": "session_mongo_id"
  },
  "email": {
    "sent": true,
    "reason": null
  },
  "credentials": null
}
```

**Database Fields Stored:**

- `username` (required, unique)
- `email` (required, unique, lowercase)
- `phoneNumber` (required)
- `password` (hashed with bcrypt)
- `sessionId` (reference to AcademicSession)
- `isActive` (default: true)

---

### 5. Teacher Login

**Endpoint:** `POST /api/teacher/login`

**Description:** Authenticates teacher with username and password

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "TempPassword123@"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Teacher login successful",
  "token": "jwt_token_here",
  "teacher": {
    "_id": "mongo_id",
    "username": "johndoe",
    "email": "john.doe@koshish.org",
    "phoneNumber": "9876543210"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**Authentication:** Uses bcrypt password comparison for validation

---

### 6. Student Onboarding (by Teacher)

**Endpoint:** `POST /api/teacher/students/add`

**Authentication:** Requires valid teacher token

**Description:** Creates a new Student account with auto-generated roll number

**Request Body:**

```json
{
  "name": "Arjun Kumar",
  "email": "arjun.kumar@student.koshish.org",
  "phoneNumber": "8765432109",
  "classId": "class_mongo_id",
  "sessionId": "session_mongo_id",
  "username": "arjunkumar"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "_id": "mongo_id",
    "name": "Arjun Kumar",
    "username": "arjunkumar",
    "email": "arjun.kumar@student.koshish.org",
    "phoneNumber": "8765432109",
    "rollNumber": "ROLL-0001"
  },
  "email": {
    "sent": true,
    "reason": null
  },
  "credentials": null
}
```

**Database Fields Stored:**

- `name` (required)
- `username` (required, unique)
- `email` (required, unique, lowercase)
- `phoneNumber` (required)
- `password` (hashed with bcrypt)
- `rollNumber` (auto-generated as ROLL-XXXX)
- `registrationNumber` (auto-generated same as rollNumber)
- `classId` (reference to Class)
- `sessionId` (reference to AcademicSession)

---

### 7. Student Registration (Self-service)

**Endpoint:** `POST /api/user/student/register`

**Description:** Self-registration for students without teacher onboarding

**Request Body:**

```json
{
  "name": "Arjun Kumar",
  "email": "arjun.kumar@student.koshish.org",
  "password": "SecurePassword123@",
  "registrationNumber": "REG-12345",
  "phoneNumber": "8765432109",
  "course": "Bachelor of Technology",
  "year": "2024"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Student registered successfully",
  "token": "jwt_token_here",
  "student": {
    "_id": "mongo_id",
    "name": "Arjun Kumar",
    "email": "arjun.kumar@student.koshish.org",
    "registrationNumber": "REG-12345",
    "phoneNumber": "8765432109"
  }
}
```

---

### 8. Student Login

**Endpoint:** `POST /api/user/student/login`

**Description:** Authenticates student with email and password

**Request Body:**

```json
{
  "email": "arjun.kumar@student.koshish.org",
  "password": "SecurePassword123@"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "student": {
    "_id": "mongo_id",
    "name": "Arjun Kumar",
    "email": "arjun.kumar@student.koshish.org",
    "registrationNumber": "REG-12345",
    "phoneNumber": "8765432109"
  }
}
```

**Authentication:** Uses bcrypt password comparison for validation

---

### 9. Credential Recovery (Teacher)

**Endpoint:** `POST /api/teacher/credentials/recover/teacher`

**Description:** Reset teacher password and send new credentials via email

**Request Body:**

```json
{
  "email": "john.doe@koshish.org"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Teacher credentials recovered successfully",
  "email": {
    "sent": true,
    "reason": null
  },
  "credentials": null
}
```

---

### 10. Credential Recovery (Student by Teacher)

**Endpoint:** `POST /api/teacher/credentials/recover/student`

**Authentication:** Requires valid teacher token

**Description:** Reset student password and send new credentials via email

**Request Body:**

```json
{
  "email": "arjun.kumar@student.koshish.org"
}
```

---

### 11. Credential Recovery (Student Self-service)

**Endpoint:** `POST /api/user/student/recover-credentials`

**Description:** Public endpoint for students to recover their credentials

**Request Body:**

```json
{
  "email": "arjun.kumar@student.koshish.org"
}
```

---

## Email Templates

### Credentials Template

Sent when new accounts are created or credentials are recovered.

**Subject:** `Koshish Welfare | [Label]`

**Content includes:**

- Welcome greeting with user name
- Username/Email for login
- Temporary password
- Instruction to change password after first login
- Optional login URL

**Template variables:**

- `name` - User's name
- `username` - Login username/email
- `password` - Temporary password
- `label` - Email subject label
- `role` - User role (optional)
- `loginUrl` - Application login URL (optional)

### Onboarding Template

Generic welcome email sent when account type is first created.

**Subject:** `Koshish Welfare | Welcome [Role] - Account Created`

**Content includes:**

- Generic welcome message
- Role confirmation
- Notice about separate credentials email
- Optional login link

---

## Security Features

### 1. Password Hashing

- Algorithm: bcrypt
- Salt rounds: 10
- All passwords stored as hashes in database
- Never transmitted in plain text in responses

### 2. Authentication Tokens

- Type: JWT (JSON Web Token)
- Signed with secret from config
- Role-specific tokens (coordinator, cocircular, teacher, student)
- Expiration: Configured in `config.js`

### 3. Cookie Management

- Auth tokens stored in secure HTTP-only cookies
- Role-specific cookie names:
  - `coordinatorToken`
  - `cocircularToken`
  - `teacherToken`
  - `studentToken`

### 4. Email Security

- Credentials sent via secure SMTP
- Configurable via environment variables
- Transporter validation in config checks SMTP availability

### 5. Access Control

- Coordinator endpoints protected with `authCoodinater` middleware
- Co-circular endpoints protected with `authCociculer` middleware
- Teacher endpoints protected with `authTeacher` middleware
- Student endpoints protected with `studentAuth` middleware

---

## Configuration

Required environment variables in `.env`:

```env
# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@koshish.org

# Auth Credentials
COORDINATOR_USERNAME=admin_username
COORDINATOR_PASSWORD=admin_password
COORDINATOR_NOTIFY_EMAIL=admin@koshish.org

# Frontend URLs (for login links)
STUDENT_PORTAL_URL=https://student.koshish.org
ADMIN_PANEL_URL=https://admin.koshish.org
```

---

## Best Practices

### For Administrators

1. **Onboarding Co-Circular Users:**
   - Use coordinator credentials to login
   - Visit onboarding endpoint with proper data
   - Verify email delivery to user

2. **Managing Credentials:**
   - Use recovery endpoints if user loses credentials
   - Ensure SMTP is properly configured before onboarding
   - Inform users to change temporary passwords after first login

3. **Session Management:**
   - Create academic sessions before adding teachers
   - Link teachers to specific sessions
   - Link students to specific classes and sessions

### For Users

1. **After Account Creation:**
   - Change temporary password immediately
   - Use email as primary login identifier
   - Enable notifications for security events

2. **Security:**
   - Keep credentials confidential
   - Use strong passwords (minimum 8 characters)
   - Report suspicious login attempts

---

## Error Handling

### Common Error Responses

**Invalid Credentials:**

```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**Missing Required Fields:**

```json
{
  "success": false,
  "message": "name, email and phoneNumber are required"
}
```

**User Already Exists:**

```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**Invalid Email Format:**

```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

**Email Delivery Issue:**

```json
{
  "success": true,
  "message": "User created successfully",
  "email": {
    "sent": false,
    "reason": "SMTP not configured"
  },
  "credentials": {
    "username": "generated_username",
    "password": "GeneratedPassword123@"
  }
}
```

---

## Testing the Authentication System

### Test Scenario 1: Complete Onboarding Flow

```bash
# 1. Login as Coordinator
curl -X POST http://localhost:5000/api/coordinater/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "coordinator_user",
    "password": "coordinator_pass"
  }'

# 2. Onboard Co-Circular user
curl -X POST http://localhost:5000/api/coordinater/onboard-cocircular \
  -H "Content-Type: application/json" \
  -H "Cookie: coordinatorToken=[TOKEN_FROM_STEP_1]" \
  -d '{
    "name": "Dr. Sarah",
    "email": "sarah@koshish.org",
    "speciality": "Music",
    "about": "Music director"
  }'

# 3. Co-Circular login
curl -X POST http://localhost:5000/api/cocircular/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@koshish.org",
    "password": "[TEMP_PASSWORD_FROM_EMAIL]"
  }'

# 4. Create academic session
curl -X POST http://localhost:5000/api/cocircular/academic/session/add \
  -H "Content-Type: application/json" \
  -H "Cookie: cocircularToken=[TOKEN_FROM_STEP_3]" \
  -d '{
    "name": "2024-2025",
    "startYear": 2024,
    "endYear": 2025
  }'

# 5. Add teacher to session
curl -X POST http://localhost:5000/api/cocircular/academic/teacher/add \
  -H "Content-Type: application/json" \
  -H "Cookie: cocircularToken=[TOKEN_FROM_STEP_3]" \
  -d '{
    "name": "Prof. John",
    "email": "john@koshish.org",
    "phoneNumber": "9876543210",
    "sessionId": "[SESSION_ID_FROM_STEP_4]"
  }'

# 6. Teacher login
curl -X POST http://localhost:5000/api/teacher/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "[GENERATED_USERNAME]",
    "password": "[TEMP_PASSWORD_FROM_EMAIL]"
  }'

# 7. Teacher adds student
curl -X POST http://localhost:5000/api/teacher/students/add \
  -H "Content-Type: application/json" \
  -H "Cookie: teacherToken=[TOKEN_FROM_STEP_6]" \
  -d '{
    "name": "Arjun",
    "email": "arjun@student.koshish.org",
    "phoneNumber": "8765432109"
  }'
```

---

## Troubleshooting

### Issue: "SMTP not configured" in email response

**Solution:**

- Check `.env` file for SMTP credentials
- Verify SMTP host, port, user, and password
- Ensure less secure apps are enabled (for Gmail)
- Check config.js email validation

### Issue: "Teacher login validation pending - database integration required"

**Solution:**

- Update teacherLogin.js with bcrypt validation
- Ensure Teacher model is imported
- Check that passwords are stored as hashes in database

### Issue: Login fails with valid credentials

**Solution:**

- Verify password is stored as bcrypt hash
- Check email/username case sensitivity
- Ensure user field used matches login field (email vs username)
- Check database connection

### Issue: Credentials email not received

**Solution:**

- Verify SMTP is properly configured
- Check email spam folder
- Ensure recipient email is correct
- Check server logs for SMTP errors

---

## Summary

The authentication system now provides:

✅ Hierarchical onboarding (Coordinator → Co-Circular → Teacher → Student)  
✅ Database-backed credentials with bcrypt hashing  
✅ Secure login endpoints with password validation  
✅ Email credential distribution  
✅ Credential recovery mechanisms  
✅ Role-based access control  
✅ Comprehensive logging and notifications

All endpoints follow RESTful conventions and return consistent JSON responses.

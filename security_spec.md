# Security Specification — EduLink Firestore Rules

## 1. Data Invariants
1. A `/users/{userId}` document belongs exclusively to the verified Google user whose `request.auth.uid == userId` and `request.auth.token.email_verified == true`. No user can read, list, create, update, or delete another user's profile.
2. On `/users/{userId}` update, `uid` and `email` and `createdAt` are immutable; only `displayName`, `photoURL`, `linkedRole`, `linkedSubject`, `linkedStudentId`, and `updatedAt` may change.
3. All document IDs (`userId`, `studentId`, `reportId`, `scheduleId`, `announcementId`, `settingId`) must match `^[a-zA-Z0-9_\-]+$` and be at most 128 characters.
4. Every string field and array field in every collection has strict type checks and bounded `.size()` limits to prevent shadow fields and payload exhaustion.
5. Unmatched paths fall through to the global catch-all `allow read, write: if false;`.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Cross-user profile read**: Authenticated User A attempts `get(/users/userB)`.
2. **User collection enumeration**: Authenticated User A attempts `list(/users)`.
3. **UID spoofing on user create**: Authenticated User A creates `/users/userA` with `{ uid: "userB", ... }`.
4. **Unverified email on user write**: User with `email_verified: false` writes `/users/userA`.
5. **Shadow field on user create**: User A creates `/users/userA` with extra field `{ isAdmin: true }`.
6. **Immutable email tamper on user update**: User A updates `/users/userA` changing `email` or `uid` or `createdAt`.
7. **Invalid `linkedRole` enum**: User A sets `linkedRole: "SUPERADMIN"` on `/users/userA`.
8. **ID poisoning**: Client attempts `setDoc(doc(db, 'students', 'bad/id$!@#...'), ...)`.
9. **Oversized student name**: Client writes `students/hs01` with `name` > 120 chars.
10. **Shadow field on announcement**: Client writes `announcements/ann_1` with `{ secretFlag: true }`.
11. **Oversized announcement content**: Client writes `announcements/ann_1` with `content` > 5000 chars.
12. **Arbitrary unknown collection write**: Client attempts `setDoc(doc(db, 'admin_secrets', 'root'), { bypass: true })`.

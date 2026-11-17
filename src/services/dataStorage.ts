import { Student, TeacherInfo, SubjectTeacherInfo, WeeklySchedule, SubjectScore, WeeklyReport, Announcement, AuditLogEntry, AuditTargetType, UserRole } from '../types';
import { db, OperationType, handleFirestoreError, stripUndefined } from '../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export const DEFAULT_TEACHER: TeacherInfo = {
  name: 'Thầy Lê Anh Tuấn',
  code: 'GV10A1',
  className: 'Lớp 10A1',
  schoolYear: '2025 - 2026',
  email: 'anhtuan.teacher@edu.vn',
  phone: '0988 123 456',
  subject: 'Chủ nhiệm / Giáo viên Toán',
  password: '123'
};

export const DEFAULT_SUBJECT_TEACHERS: SubjectTeacherInfo[] = [
  { subject: 'Toán Học', name: 'Thầy Lê Anh Tuấn', code: 'GV_TOAN', password: '123' },
  { subject: 'Ngữ Văn', name: 'Thầy Lê Văn Thành', code: 'GV_VAN', password: '123' },
  { subject: 'Tiếng Anh', name: 'Cô Trần Thu Trang', code: 'GV_ANH', password: '123' },
  { subject: 'Vật Lý', name: 'Thầy Phạm Văn Bình', code: 'GV_LY', password: '123' },
  { subject: 'Hóa Học', name: 'Cô Vũ Thị Mai', code: 'GV_HOA', password: '123' },
  { subject: 'Sinh Học', name: 'Thầy Nguyễn Đức Tâm', code: 'GV_SINH', password: '123' },
  { subject: 'Lịch Sử', name: 'Cô Đào Thị Huệ', code: 'GV_SU', password: '123' },
  { subject: 'Địa Lý', name: 'Thầy Trịnh Văn Nam', code: 'GV_DIA', password: '123' },
  { subject: 'Tin Học', name: 'Thầy Hoàng Anh Tuấn', code: 'GV_TIN', password: '123' },
  { subject: 'GDCD', name: 'Cô Hoàng Mỹ Linh', code: 'GV_GDCD', password: '123' },
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'hs01',
    name: 'Lý Thanh Nhã',
    studentCode: '10A101',
    avatar: '',
    gender: 'Nữ',
    dob: '12/04/2010',
    parentPassword: '123',
    conduct: 'Tốt',
    overallGPA: 0.0,
  },
  {
    id: 'hs02',
    name: 'Cao Phạm Bảo Khang',
    studentCode: '10A102',
    avatar: '',
    gender: 'Nam',
    dob: '25/08/2010',
    parentPassword: '123',
    conduct: 'Tốt',
    overallGPA: 0.0,
  },
  {
    id: 'hs03',
    name: 'Lê Nguyễn Đức Duy',
    studentCode: '10A103',
    avatar: '',
    gender: 'Nam',
    dob: '03/01/2010',
    parentPassword: '123',
    conduct: 'Tốt',
    overallGPA: 0.0,
  },
  {
    id: 'hs04',
    name: 'Nguyễn Đăng Khoa',
    studentCode: '10A104',
    avatar: '',
    gender: 'Nam',
    dob: '18/11/2010',
    parentPassword: '123',
    conduct: 'Tốt',
    overallGPA: 0.0,
  }
];

export const TIME_SLOTS = [
  '07:30 - 08:15',
  '08:20 - 09:05',
  '09:15 - 10:00',
  '10:05 - 10:50',
  '11:00 - 11:45'
];

export function generateWeeklySchedule(weekNum: number): WeeklySchedule {
  return {
    weekNumber: weekNum,
    startDate: `Đầu tuần ${weekNum}`,
    endDate: `Cuối tuần ${weekNum}`,
    days: [
      {
        dayName: 'Thứ 2',
        periods: [
          { periodNumber: 1, timeSlot: TIME_SLOTS[0], subject: 'Chào cờ / SHCC', teacher: 'Thầy Lê Anh Tuấn', room: 'Sân trường' },
          { periodNumber: 2, timeSlot: TIME_SLOTS[1], subject: 'Toán Học', teacher: 'Thầy Lê Anh Tuấn', room: 'Phòng 201' },
          { periodNumber: 3, timeSlot: TIME_SLOTS[2], subject: 'Toán Học', teacher: 'Thầy Lê Anh Tuấn', room: 'Phòng 201' },
          { periodNumber: 4, timeSlot: TIME_SLOTS[3], subject: 'Ngữ Văn', teacher: 'Thầy Lê Văn Thành', room: 'Phòng 201' },
          { periodNumber: 5, timeSlot: TIME_SLOTS[4], subject: 'Tiếng Anh', teacher: 'Cô Trần Thu Trang', room: 'Phòng Lab 1' },
        ]
      },
      {
        dayName: 'Thứ 3',
        periods: [
          { periodNumber: 1, timeSlot: TIME_SLOTS[0], subject: 'Vật Lý', teacher: 'Thầy Phạm Văn Bình', room: 'Phòng Lý' },
          { periodNumber: 2, timeSlot: TIME_SLOTS[1], subject: 'Vật Lý', teacher: 'Thầy Phạm Văn Bình', room: 'Phòng Lý' },
          { periodNumber: 3, timeSlot: TIME_SLOTS[2], subject: 'Hóa Học', teacher: 'Cô Vũ Thị Mai', room: 'Phòng Hóa' },
          { periodNumber: 4, timeSlot: TIME_SLOTS[3], subject: 'Ngữ Văn', teacher: 'Thầy Lê Văn Thành', room: 'Phòng 201' },
          { periodNumber: 5, timeSlot: TIME_SLOTS[4], subject: 'GDCD', teacher: 'Cô Hoàng Mỹ Linh', room: 'Phòng 201' },
        ]
      },
      {
        dayName: 'Thứ 4',
        periods: [
          { periodNumber: 1, timeSlot: TIME_SLOTS[0], subject: 'Sinh Học', teacher: 'Thầy Nguyễn Đức Tâm', room: 'Phòng Sinh' },
          { periodNumber: 2, timeSlot: TIME_SLOTS[1], subject: 'Tiếng Anh', teacher: 'Cô Trần Thu Trang', room: 'Phòng Lab 1' },
          { periodNumber: 3, timeSlot: TIME_SLOTS[2], subject: 'Toán Học', teacher: 'Thầy Lê Anh Tuấn', room: 'Phòng 201' },
          { periodNumber: 4, timeSlot: TIME_SLOTS[3], subject: 'Lịch Sử', teacher: 'Cô Đào Thị Huệ', room: 'Phòng 201' },
          { periodNumber: 5, timeSlot: TIME_SLOTS[4], subject: 'Địa Lý', teacher: 'Thầy Trịnh Văn Nam', room: 'Phòng 201' },
        ]
      },
      {
        dayName: 'Thứ 5',
        periods: [
          { periodNumber: 1, timeSlot: TIME_SLOTS[0], subject: 'Tin Học', teacher: 'Thầy Hoàng Anh Tuấn', room: 'Phòng Máy 2' },
          { periodNumber: 2, timeSlot: TIME_SLOTS[1], subject: 'Tin Học', teacher: 'Thầy Hoàng Anh Tuấn', room: 'Phòng Máy 2' },
          { periodNumber: 3, timeSlot: TIME_SLOTS[2], subject: 'Hóa Học', teacher: 'Cô Vũ Thị Mai', room: 'Phòng Hóa' },
          { periodNumber: 4, timeSlot: TIME_SLOTS[3], subject: 'Tiếng Anh', teacher: 'Cô Trần Thu Trang', room: 'Phòng 201' },
          { periodNumber: 5, timeSlot: TIME_SLOTS[4], subject: 'Thể Dục', teacher: 'Thầy Bùi Tiến Dũng', room: 'Sân Vận Động' },
        ]
      },
      {
        dayName: 'Thứ 6',
        periods: [
          { periodNumber: 1, timeSlot: TIME_SLOTS[0], subject: 'Ngữ Văn', teacher: 'Thầy Lê Văn Thành', room: 'Phòng 201' },
          { periodNumber: 2, timeSlot: TIME_SLOTS[1], subject: 'Ngữ Văn', teacher: 'Thầy Lê Văn Thành', room: 'Phòng 201' },
          { periodNumber: 3, timeSlot: TIME_SLOTS[2], subject: 'Toán Học', teacher: 'Thầy Lê Anh Tuấn', room: 'Phòng 201' },
          { periodNumber: 4, timeSlot: TIME_SLOTS[3], subject: 'Vật Lý', teacher: 'Thầy Phạm Văn Bình', room: 'Phòng Lý' },
          { periodNumber: 5, timeSlot: TIME_SLOTS[4], subject: 'Sinh Học', teacher: 'Thầy Nguyễn Đức Tâm', room: 'Phòng Sinh' },
        ]
      },
      {
        dayName: 'Thứ 7',
        periods: [
          { periodNumber: 1, timeSlot: TIME_SLOTS[0], subject: 'Tiếng Anh', teacher: 'Cô Trần Thu Trang', room: 'Phòng 201' },
          { periodNumber: 2, timeSlot: TIME_SLOTS[1], subject: 'Toán Học', teacher: 'Thầy Lê Anh Tuấn', room: 'Phòng 201' },
          { periodNumber: 3, timeSlot: TIME_SLOTS[2], subject: 'Lịch Sử', teacher: 'Cô Đào Thị Huệ', room: 'Phòng 201' },
          { periodNumber: 4, timeSlot: TIME_SLOTS[3], subject: 'Sinh Hoạt Lớp', teacher: 'Thầy Lê Anh Tuấn', room: 'Phòng 201' },
          { periodNumber: 5, timeSlot: TIME_SLOTS[4], subject: 'HĐ Lớp / Ngoại khóa', teacher: 'Thầy Lê Anh Tuấn', room: 'Hội trường' },
        ]
      }
    ]
  };
}

export function getDefaultSubjectScores(studentId: string): SubjectScore[] {
  // Empty default subject scores so user can input their own data
  const defaultSubjects = [
    { subjectName: 'Toán Học', teacherName: 'Thầy Lê Anh Tuấn' },
    { subjectName: 'Ngữ Văn', teacherName: 'Thầy Lê Văn Thành' },
    { subjectName: 'Tiếng Anh', teacherName: 'Cô Trần Thu Trang' },
    { subjectName: 'Vật Lý', teacherName: 'Thầy Phạm Văn Bình' },
    { subjectName: 'Hóa Học', teacherName: 'Cô Vũ Thị Mai' },
    { subjectName: 'Sinh Học', teacherName: 'Thầy Nguyễn Đức Tâm' },
    { subjectName: 'Lịch Sử', teacherName: 'Cô Đào Thị Huệ' },
    { subjectName: 'Địa Lý', teacherName: 'Thầy Trịnh Văn Nam' },
    { subjectName: 'Tin Học', teacherName: 'Thầy Hoàng Anh Tuấn' },
    { subjectName: 'GDCD', teacherName: 'Cô Hoàng Mỹ Linh' },
  ];

  return defaultSubjects.map(sub => ({
    subjectName: sub.subjectName,
    teacherName: sub.teacherName,
    oralScores: [],
    scores15m: [],
    scores45m: [],
    midtermScore: null,
    finalScore: null,
    averageScore: 0,
    teacherRemark: '',
    isNeedingImprovement: false,
  }));
}

export function getDefaultWeeklyReports(studentId: string, weekNum: number): WeeklyReport {
  return {
    studentId,
    weekNumber: weekNum,
    totalPeriods: 0,
    excusedAbsences: 0,
    unexcusedAbsences: 0,
    lateArrivals: 0,
    weakPoints: [],
    learningStatus: 'Chưa xếp loại',
    conductStatus: 'Tốt',
    teacherComment: '',
    parentFeedback: '',
    updatedAt: new Date().toLocaleString('vi-VN')
  };
}

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [];

// Persistent State Storage Helper
const STORAGE_KEYS = {
  TEACHER: 'edulink_teacher',
  SUBJECT_TEACHERS: 'edulink_subject_teachers',
  STUDENTS: 'edulink_students',
  ANNOUNCEMENTS: 'edulink_announcements',
  WEEKLY_REPORTS: 'edulink_weekly_reports',
  SUBJECT_SCORES: 'edulink_subject_scores',
  WEEKLY_SCHEDULES: 'edulink_weekly_schedules',
  AUDIT_LOGS: 'edulink_audit_logs',
  ACTIVE_ACTOR: 'edulink_active_actor'
};

export interface ActiveActorInfo {
  uid: string;
  name: string;
  label: string;
}

export function formatEditTimestamp(date: Date = new Date()): string {
  const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('vi-VN');
  return `${timeStr} • ${dateStr}`;
}

export class DataService {
  static getTeacher(): TeacherInfo {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHER);
    if (data) {
      try {
        const parsed: TeacherInfo = JSON.parse(data);
        if (parsed.name.includes('Hoàng Yến') || parsed.name !== 'Thầy Lê Anh Tuấn') {
          localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(DEFAULT_TEACHER));
          return DEFAULT_TEACHER;
        }
        return {
          ...parsed,
          password: parsed.password || '123',
        };
      } catch (e) {
        return DEFAULT_TEACHER;
      }
    }
    return DEFAULT_TEACHER;
  }

  private static async writeDocSafe(collectionName: string, docId: string, data: unknown): Promise<void> {
    const path = `${collectionName}/${docId}`;
    try {
      await setDoc(doc(db, collectionName, docId), stripUndefined(data));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, path);
      } catch (loggedErr) {
        console.warn('Firebase background write error:', loggedErr);
      }
    }
  }

  static saveTeacher(teacher: TeacherInfo): void {
    localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacher));
    void this.writeDocSafe('settings', 'teacher', teacher);
  }

  static updateTeacherPassword(newPassword: string): TeacherInfo {
    const current = this.getTeacher();
    const updated: TeacherInfo = {
      ...current,
      password: newPassword,
    };
    this.saveTeacher(updated);
    return updated;
  }

  static getStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (data) {
      try {
        const parsed: Student[] = JSON.parse(data);
        if (
          parsed.some(s => s.avatar !== '' || s.name === 'Nguyễn Văn Minh' || s.name === 'Trần Thị Mỹ Linh' || s.id === 'hs05' || s.id === 'hs06') ||
          parsed.length !== 4
        ) {
          const cleaned = DEFAULT_STUDENTS.map(s => ({ ...s, avatar: '' }));
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(cleaned));
          return cleaned;
        }
        return parsed.map(s => ({ ...s, avatar: '' }));
      } catch (e) {
        return DEFAULT_STUDENTS.map(s => ({ ...s, avatar: '' }));
      }
    }
    return DEFAULT_STUDENTS.map(s => ({ ...s, avatar: '' }));
  }

  static saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    students.forEach(student => {
      void this.writeDocSafe('students', student.id, student);
    });
  }

  static updateStudentPassword(studentId: string, newPass: string): void {
    const students = this.getStudents();
    const updated = students.map(s => s.id === studentId ? { ...s, parentPassword: newPass } : s);
    this.saveStudents(updated);
  }

  static getAnnouncements(): Announcement[] {
    const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return data ? JSON.parse(data) : DEFAULT_ANNOUNCEMENTS;
  }

  static saveAnnouncements(announcements: Announcement[]): void {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    announcements.forEach(ann => {
      void this.writeDocSafe('announcements', ann.id, ann);
    });
  }

  static addAnnouncement(title: string, content: string, category: Announcement['category'], isPinned: boolean = false): Announcement {
    const list = this.getAnnouncements();
    const newAnn: Announcement = {
      id: 'ann_' + Date.now(),
      title,
      content,
      category,
      date: new Date().toLocaleDateString('vi-VN'),
      author: DEFAULT_TEACHER.name,
      isPinned
    };
    const updated = [newAnn, ...list];
    this.saveAnnouncements(updated);
    return newAnn;
  }

  static deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements();
    this.saveAnnouncements(list.filter(a => a.id !== id));
    deleteDoc(doc(db, 'announcements', id)).catch((error) => {
      try {
        handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
      } catch (loggedErr) {
        console.warn('Firebase delete error:', loggedErr);
      }
    });
  }

  static getWeeklySchedule(weekNum: number): WeeklySchedule {
    const data = localStorage.getItem(`${STORAGE_KEYS.WEEKLY_SCHEDULES}_${weekNum}`);
    return data ? JSON.parse(data) : generateWeeklySchedule(weekNum);
  }

  static saveWeeklySchedule(weekNum: number, schedule: WeeklySchedule): void {
    localStorage.setItem(`${STORAGE_KEYS.WEEKLY_SCHEDULES}_${weekNum}`, JSON.stringify(schedule));
    void this.writeDocSafe('weekly_schedules', `week_${weekNum}`, schedule);
  }

  static getSubjectTeachers(): SubjectTeacherInfo[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECT_TEACHERS);
    if (data) {
      try {
        const parsed = JSON.parse(data) as SubjectTeacherInfo[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((st) => ({
            ...st,
            password: st.password || '123',
          }));
        }
      } catch (e) {
        return DEFAULT_SUBJECT_TEACHERS;
      }
    }
    return DEFAULT_SUBJECT_TEACHERS;
  }

  static saveSubjectTeachers(teachers: SubjectTeacherInfo[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBJECT_TEACHERS, JSON.stringify(teachers));
    void this.writeDocSafe('settings', 'subject_teachers', { teachers });
  }

  static updateSubjectTeacherPassword(subject: string, newPassword: string): SubjectTeacherInfo[] {
    const teachers = this.getSubjectTeachers();
    const updated = teachers.map((st) =>
      st.subject === subject ? { ...st, password: newPassword } : st
    );
    this.saveSubjectTeachers(updated);
    return updated;
  }

  private static activeActor: ActiveActorInfo | null = null;

  static setActiveActor(actor: ActiveActorInfo | null): void {
    this.activeActor = actor;
    try {
      if (actor) {
        sessionStorage.setItem(STORAGE_KEYS.ACTIVE_ACTOR, JSON.stringify(actor));
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_ACTOR);
      }
    } catch {
      // ignore storage errors
    }
  }

  static getActiveActor(): ActiveActorInfo | null {
    if (this.activeActor) return this.activeActor;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.ACTIVE_ACTOR);
      if (raw) {
        this.activeActor = JSON.parse(raw) as ActiveActorInfo;
        return this.activeActor;
      }
    } catch {
      // ignore storage errors
    }
    return null;
  }

  static getCurrentActorStamp(fallbackRole?: Exclude<UserRole, 'GUEST'>): { uid: string; email: string; name: string; displayTime: string } {
    const actor = this.getActiveActor();
    if (actor) {
      return {
        uid: actor.uid.slice(0, 128),
        email: actor.label.slice(0, 254),
        name: actor.name.slice(0, 120),
        displayTime: formatEditTimestamp(),
      };
    }

    const teacher = this.getTeacher();
    const defaultName =
      fallbackRole === 'PARENT'
        ? 'Phụ huynh học sinh'
        : fallbackRole === 'SUBJECT_TEACHER'
        ? 'Giáo viên bộ môn'
        : teacher.name;
    const defaultLabel =
      fallbackRole === 'PARENT'
        ? 'Phụ huynh'
        : fallbackRole === 'SUBJECT_TEACHER'
        ? 'GV Bộ Môn'
        : `GVCN (${teacher.code})`;

    return {
      uid: `role_${fallbackRole || 'TEACHER'}`,
      email: defaultLabel.slice(0, 254),
      name: defaultName.slice(0, 120),
      displayTime: formatEditTimestamp(),
    };
  }

  static getAuditLogs(): AuditLogEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data) as AuditLogEntry[];
      if (!Array.isArray(parsed)) return [];
      return parsed.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch {
      return [];
    }
  }

  static recordAuditLog(params: {
    actorRole: Exclude<UserRole, 'GUEST'>;
    action: string;
    targetType: AuditTargetType;
    targetLabel: string;
    summary: string;
  }): void {
    const actor = this.getCurrentActorStamp(params.actorRole);

    const now = new Date();
    const id = `log_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`;
    const entry: AuditLogEntry = {
      id: id.slice(0, 64),
      actorUid: actor.uid.slice(0, 128),
      actorEmail: actor.email,
      actorName: actor.name,
      actorRole: params.actorRole,
      action: params.action.slice(0, 64),
      targetType: params.targetType,
      targetLabel: params.targetLabel.slice(0, 200),
      summary: params.summary.slice(0, 500),
      createdAt: now.toISOString(),
      displayTime: formatEditTimestamp(now).slice(0, 64),
    };

    const existing = this.getAuditLogs();
    const updated = [entry, ...existing].slice(0, 200);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    void this.writeDocSafe('audit_logs', entry.id, entry);
  }

  static getSubjectScores(studentId: string): SubjectScore[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.SUBJECT_SCORES}_${studentId}`);
    return data ? JSON.parse(data) : getDefaultSubjectScores(studentId);
  }

  static saveSubjectScores(studentId: string, scores: SubjectScore[]): void {
    localStorage.setItem(`${STORAGE_KEYS.SUBJECT_SCORES}_${studentId}`, JSON.stringify(scores));
    void this.writeDocSafe('subject_scores', studentId, { studentId, scores });
  }

  static saveSingleSubjectScore(studentId: string, updatedSubjectScore: SubjectScore): SubjectScore {
    const actor = this.getCurrentActorStamp();
    const stampedScore: SubjectScore = {
      ...updatedSubjectScore,
      updatedByEmail: actor?.email || updatedSubjectScore.updatedByEmail,
      updatedByName: actor?.name || updatedSubjectScore.updatedByName,
      updatedAt: actor?.displayTime || formatEditTimestamp(),
    };
    const scores = this.getSubjectScores(studentId);
    const index = scores.findIndex(s => s.subjectName === stampedScore.subjectName);
    if (index !== -1) {
      scores[index] = stampedScore;
    } else {
      scores.push(stampedScore);
    }
    this.saveSubjectScores(studentId, scores);
    return stampedScore;
  }

  static getWeeklyReport(studentId: string, weekNum: number): WeeklyReport {
    const data = localStorage.getItem(`${STORAGE_KEYS.WEEKLY_REPORTS}_${studentId}_${weekNum}`);
    return data ? JSON.parse(data) : getDefaultWeeklyReports(studentId, weekNum);
  }

  static saveWeeklyReport(studentId: string, weekNum: number, report: WeeklyReport, stampActor: boolean = true): WeeklyReport {
    const actor = stampActor ? this.getCurrentActorStamp() : null;
    const stampedReport: WeeklyReport = {
      ...report,
      updatedAt: (actor?.displayTime || report.updatedAt || formatEditTimestamp()).slice(0, 64),
      ...(actor ? { updatedByEmail: actor.email, updatedByName: actor.name } : {}),
    };
    localStorage.setItem(`${STORAGE_KEYS.WEEKLY_REPORTS}_${studentId}_${weekNum}`, JSON.stringify(stampedReport));
    void this.writeDocSafe('weekly_reports', `${studentId}_w${weekNum}`, stampedReport);
    return stampedReport;
  }

  static saveParentFeedback(studentId: string, weekNum: number, feedback: string): void {
    const report = this.getWeeklyReport(studentId, weekNum);
    report.parentFeedback = feedback;
    report.parentFeedbackDate = formatEditTimestamp();
    this.saveWeeklyReport(studentId, weekNum, report, false);
  }

  static subscribeToRealtimeSync(onDataUpdated: () => void): () => void {

    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snap) => {
        if (!snap.empty) {
          const fetchedStudents: Student[] = [];
          snap.forEach((d) => fetchedStudents.push(d.data() as Student));
          if (fetchedStudents.length > 0) {
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(fetchedStudents));
            onDataUpdated();
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'students');
        } catch (err) {
          console.warn('Realtime students sync error:', err);
        }
      }
    );

    const unsubScores = onSnapshot(
      collection(db, 'subject_scores'),
      (snap) => {
        if (!snap.empty) {
          snap.forEach((d) => {
            const data = d.data();
            if (data.studentId && data.scores) {
              localStorage.setItem(`${STORAGE_KEYS.SUBJECT_SCORES}_${data.studentId}`, JSON.stringify(data.scores));
            }
          });
          onDataUpdated();
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'subject_scores');
        } catch (err) {
          console.warn('Realtime subject_scores sync error:', err);
        }
      }
    );

    const unsubReports = onSnapshot(
      collection(db, 'weekly_reports'),
      (snap) => {
        if (!snap.empty) {
          snap.forEach((d) => {
            const data = d.data() as WeeklyReport;
            if (data.studentId && data.weekNumber) {
              localStorage.setItem(`${STORAGE_KEYS.WEEKLY_REPORTS}_${data.studentId}_${data.weekNumber}`, JSON.stringify(data));
            }
          });
          onDataUpdated();
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'weekly_reports');
        } catch (err) {
          console.warn('Realtime weekly_reports sync error:', err);
        }
      }
    );

    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snap) => {
        const fetchedAnn: Announcement[] = [];
        snap.forEach((d) => fetchedAnn.push(d.data() as Announcement));
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(fetchedAnn));
        onDataUpdated();
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'announcements');
        } catch (err) {
          console.warn('Realtime announcements sync error:', err);
        }
      }
    );

    const unsubSchedules = onSnapshot(
      collection(db, 'weekly_schedules'),
      (snap) => {
        if (!snap.empty) {
          snap.forEach((d) => {
            const data = d.data() as WeeklySchedule;
            if (data.weekNumber) {
              localStorage.setItem(`${STORAGE_KEYS.WEEKLY_SCHEDULES}_${data.weekNumber}`, JSON.stringify(data));
            }
          });
          onDataUpdated();
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'weekly_schedules');
        } catch (err) {
          console.warn('Realtime weekly_schedules sync error:', err);
        }
      }
    );

    const unsubTeacher = onSnapshot(
      doc(db, 'settings', 'teacher'),
      (snap) => {
        if (snap.exists()) {
          localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(snap.data()));
          onDataUpdated();
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, 'settings/teacher');
        } catch (err) {
          console.warn('Realtime settings/teacher sync error:', err);
        }
      }
    );

    const unsubSubjectTeachers = onSnapshot(
      doc(db, 'settings', 'subject_teachers'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as { teachers?: SubjectTeacherInfo[] };
          if (Array.isArray(data.teachers) && data.teachers.length > 0) {
            localStorage.setItem(STORAGE_KEYS.SUBJECT_TEACHERS, JSON.stringify(data.teachers));
            onDataUpdated();
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, 'settings/subject_teachers');
        } catch (err) {
          console.warn('Realtime settings/subject_teachers sync error:', err);
        }
      }
    );

    const unsubAuditLogs = onSnapshot(
      query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(100)),
      (snap) => {
        const fetchedLogs: AuditLogEntry[] = [];
        snap.forEach((d) => fetchedLogs.push(d.data() as AuditLogEntry));
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(fetchedLogs));
        onDataUpdated();
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'audit_logs');
        } catch (err) {
          console.warn('Realtime audit_logs sync error:', err);
        }
      }
    );

    return () => {
      unsubStudents();
      unsubScores();
      unsubReports();
      unsubAnnouncements();
      unsubSchedules();
      unsubTeacher();
      unsubSubjectTeachers();
      unsubAuditLogs();
    };
  }

  static async syncFromFirebase(): Promise<void> {
    try {
      // 1. Fetch Students
      const studentsSnap = await getDocs(collection(db, 'students'));
      if (!studentsSnap.empty) {
        const fetchedStudents: Student[] = [];
        studentsSnap.forEach(d => fetchedStudents.push(d.data() as Student));
        if (fetchedStudents.length > 0) {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(fetchedStudents));
        }
      } else {
        // Seed default students to Firestore if empty
        const defaults = DEFAULT_STUDENTS.map(s => ({ ...s, avatar: '' }));
        defaults.forEach(s => {
          void this.writeDocSafe('students', s.id, s);
        });
      }

      // 2. Fetch Subject Scores
      const scoresSnap = await getDocs(collection(db, 'subject_scores'));
      if (!scoresSnap.empty) {
        scoresSnap.forEach(d => {
          const data = d.data();
          if (data.studentId && data.scores) {
            localStorage.setItem(`${STORAGE_KEYS.SUBJECT_SCORES}_${data.studentId}`, JSON.stringify(data.scores));
          }
        });
      } else {
        // Seed default subject scores for initial students
        DEFAULT_STUDENTS.forEach(s => {
          const scores = getDefaultSubjectScores(s.id);
          void this.writeDocSafe('subject_scores', s.id, { studentId: s.id, scores });
        });
      }

      // 3. Fetch Weekly Reports
      const reportsSnap = await getDocs(collection(db, 'weekly_reports'));
      if (!reportsSnap.empty) {
        reportsSnap.forEach(d => {
          const data = d.data() as WeeklyReport;
          if (data.studentId && data.weekNumber) {
            localStorage.setItem(`${STORAGE_KEYS.WEEKLY_REPORTS}_${data.studentId}_${data.weekNumber}`, JSON.stringify(data));
          }
        });
      }

      // 4. Fetch Weekly Schedules
      const schedulesSnap = await getDocs(collection(db, 'weekly_schedules'));
      if (!schedulesSnap.empty) {
        schedulesSnap.forEach(d => {
          const data = d.data() as WeeklySchedule;
          if (data.weekNumber) {
            localStorage.setItem(`${STORAGE_KEYS.WEEKLY_SCHEDULES}_${data.weekNumber}`, JSON.stringify(data));
          }
        });
      }

      // 5. Fetch Announcements
      const annSnap = await getDocs(collection(db, 'announcements'));
      if (!annSnap.empty) {
        const fetchedAnn: Announcement[] = [];
        annSnap.forEach(d => fetchedAnn.push(d.data() as Announcement));
        if (fetchedAnn.length > 0) {
          localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(fetchedAnn));
        }
      }

      // 6. Fetch Teacher info
      const teacherSnap = await getDoc(doc(db, 'settings', 'teacher'));
      if (teacherSnap.exists()) {
        localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacherSnap.data()));
      } else {
        void this.writeDocSafe('settings', 'teacher', DEFAULT_TEACHER);
      }

      // 7. Fetch Subject Teachers info & passwords
      const subjectTeachersSnap = await getDoc(doc(db, 'settings', 'subject_teachers'));
      if (subjectTeachersSnap.exists()) {
        const data = subjectTeachersSnap.data() as { teachers?: SubjectTeacherInfo[] };
        if (Array.isArray(data.teachers) && data.teachers.length > 0) {
          localStorage.setItem(STORAGE_KEYS.SUBJECT_TEACHERS, JSON.stringify(data.teachers));
        }
      } else {
        void this.writeDocSafe('settings', 'subject_teachers', { teachers: DEFAULT_SUBJECT_TEACHERS });
      }

      // 8. Fetch Audit Logs
      const auditSnap = await getDocs(
        query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(100))
      );
      if (!auditSnap.empty) {
        const fetchedLogs: AuditLogEntry[] = [];
        auditSnap.forEach((d) => fetchedLogs.push(d.data() as AuditLogEntry));
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(fetchedLogs));
      }
    } catch (err) {
      console.warn('Firebase initial sync warning:', err);
    }
  }

  static resetToDefault(): void {
    localStorage.clear();
  }
}

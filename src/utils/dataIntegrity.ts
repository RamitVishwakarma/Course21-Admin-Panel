import { useCourseStore } from '../store/useCourseStore';
import { useUserStore } from '../store/useUserStore';
import { useModuleStore } from '../store/useModuleStore';
import { useLectureStore } from '../store/useLectureStore';
import { useQuizStore } from '../store/useQuizStore';

export class DataIntegrityService {
  // Check if a course exists
  checkCourseExists(courseId: string): boolean {
    const { courses } = useCourseStore.getState();
    return courses.some((course) => course.id === courseId);
  }

  // Check if a user exists
  checkUserExists(userId: string): boolean {
    const { users } = useUserStore.getState();
    return users.some((user) => user.id === userId);
  }

  // Check if a module exists
  checkModuleExists(moduleId: string): boolean {
    const { modules } = useModuleStore.getState();
    return modules.some((module) => module.id === moduleId);
  }

  // Check if a lecture exists
  checkLectureExists(lectureId: string): boolean {
    const { lectures } = useLectureStore.getState();
    return lectures.some((lecture) => lecture.id === lectureId);
  }

  // Validate course relationships
  validateCourseIntegrity(courseId: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const { courses } = useCourseStore.getState();
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      errors.push(`Course with ID ${courseId} not found`);
      return { isValid: false, errors, warnings };
    }

    // Check instructor exists
    if (course.instructorId && !this.checkUserExists(course.instructorId)) {
      errors.push(
        `Instructor with ID ${course.instructorId} not found for course "${course.title}"`,
      );
    } else if (!course.instructorId) {
      warnings.push(
        `Course "${course.title || 'UNDEFINED_TITLE'}" (ID: ${
          course.id
        }) has no instructor assigned`,
      );
    }

    // Check all modules exist
    const { modules } = useModuleStore.getState();
    const courseModules = modules.filter((m) => m.courseId === courseId);

    course.modules.forEach((moduleId) => {
      if (!this.checkModuleExists(moduleId)) {
        errors.push(
          `Module with ID ${moduleId} not found for course "${course.title}"`,
        );
      }
    });

    // Check module count consistency
    if (course.moduleCount !== courseModules.length) {
      warnings.push(
        `Course "${course.title}" moduleCount (${course.moduleCount}) doesn't match actual modules (${courseModules.length})`,
      );
    }

    // Check total lecture count
    const { lectures } = useLectureStore.getState();
    const courseLectures = lectures.filter((l) => l.courseId === courseId);
    if (course.lectureCount !== courseLectures.length) {
      warnings.push(
        `Course "${course.title}" lectureCount (${course.lectureCount}) doesn't match actual lectures (${courseLectures.length})`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Validate module relationships
  validateModuleIntegrity(moduleId: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const { modules } = useModuleStore.getState();
    const module = modules.find((m) => m.id === moduleId);

    if (!module) {
      errors.push(`Module with ID ${moduleId} not found`);
      return { isValid: false, errors, warnings };
    }

    // Check course exists
    if (!this.checkCourseExists(module.courseId)) {
      errors.push(
        `Course with ID ${module.courseId} not found for module "${module.title}"`,
      );
    }

    // Check all lectures exist
    const { lectures } = useLectureStore.getState();
    const moduleLectures = lectures.filter((l) => l.moduleId === moduleId);

    module.lectures.forEach((lectureId) => {
      if (!this.checkLectureExists(lectureId)) {
        errors.push(
          `Lecture with ID ${lectureId} not found for module "${module.title}"`,
        );
      }
    });

    // Check lecture count consistency
    if (module.lectureCount !== moduleLectures.length) {
      warnings.push(
        `Module "${module.title}" lectureCount (${module.lectureCount}) doesn't match actual lectures (${moduleLectures.length})`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Validate lecture relationships
  validateLectureIntegrity(lectureId: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const { lectures } = useLectureStore.getState();
    const lecture = lectures.find((l) => l.id === lectureId);

    if (!lecture) {
      errors.push(`Lecture with ID ${lectureId} not found`);
      return { isValid: false, errors, warnings };
    }

    // Check course exists
    if (!this.checkCourseExists(lecture.courseId)) {
      errors.push(
        `Course with ID ${lecture.courseId} not found for lecture "${lecture.title}"`,
      );
    }

    // Check module exists
    if (!this.checkModuleExists(lecture.moduleId)) {
      errors.push(
        `Module with ID ${lecture.moduleId} not found for lecture "${lecture.title}"`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Fix data relationships
  async repairDataIntegrity(): Promise<{
    success: boolean;
    repaired: string[];
    failed: string[];
  }> {
    const repaired: string[] = [];
    const failed: string[] = [];

    try {
      // Get all stores
      const { courses, updateCourse } = useCourseStore.getState();
      const { modules } = useModuleStore.getState();
      const { lectures } = useLectureStore.getState();

      // Fix course module counts
      for (const course of courses) {
        const courseModules = modules.filter((m) => m.courseId === course.id);
        const courseLectures = lectures.filter((l) => l.courseId === course.id);

        let updated = false;
        const updates: any = {};

        if (course.moduleCount !== courseModules.length) {
          updates.moduleCount = courseModules.length;
          updates.modules = courseModules.map((m) => m.id);
          updated = true;
        }

        if (course.lectureCount !== courseLectures.length) {
          updates.lectureCount = courseLectures.length;
          updated = true;
        }

        // Calculate total duration
        const totalDuration = courseLectures.reduce(
          (sum, lecture) => sum + (lecture.videoDuration || 0),
          0,
        );
        if (course.duration !== totalDuration) {
          updates.duration = totalDuration;
          updated = true;
        }

        if (updated) {
          updateCourse(course.id, updates);
          repaired.push(
            `Fixed course "${course.title}" relationships and counts`,
          );
        }
      }

      // Fix module lecture counts
      const { updateModule } = useModuleStore.getState();
      for (const module of modules) {
        const moduleLectures = lectures.filter((l) => l.moduleId === module.id);

        let updated = false;
        const updates: any = {};

        if (module.lectureCount !== moduleLectures.length) {
          updates.lectureCount = moduleLectures.length;
          updates.lectures = moduleLectures.map((l) => l.id);
          updated = true;
        }

        // Calculate module duration
        const totalDuration = moduleLectures.reduce(
          (sum, lecture) => sum + (lecture.videoDuration || 0),
          0,
        );
        if (module.duration !== totalDuration) {
          updates.duration = totalDuration;
          updated = true;
        }

        if (updated) {
          updateModule(module.id, updates);
          repaired.push(
            `Fixed module "${module.title}" relationships and counts`,
          );
        }
      }

      return {
        success: true,
        repaired,
        failed,
      };
    } catch (error) {
      console.error('Data integrity repair failed:', error);

      return {
        success: false,
        repaired,
        failed: ['Data integrity repair failed'],
      };
    }
  }

  // Validate entire database
  validateAllData(): {
    isValid: boolean;
    summary: {
      coursesChecked: number;
      modulesChecked: number;
      lecturesChecked: number;
      totalErrors: number;
      totalWarnings: number;
    };
    details: Array<{
      type: string;
      id: string;
      name: string;
      errors: string[];
      warnings: string[];
    }>;
  } {
    const details: Array<{
      type: string;
      id: string;
      name: string;
      errors: string[];
      warnings: string[];
    }> = [];

    let totalErrors = 0;
    let totalWarnings = 0;

    // Validate all courses
    const { courses } = useCourseStore.getState();
    courses.forEach((course) => {
      const validation = this.validateCourseIntegrity(course.id);
      if (validation.errors.length > 0 || validation.warnings.length > 0) {
        details.push({
          type: 'Course',
          id: course.id,
          name: course.title,
          errors: validation.errors,
          warnings: validation.warnings,
        });
      }
      totalErrors += validation.errors.length;
      totalWarnings += validation.warnings.length;
    });

    // Validate all modules
    const { modules } = useModuleStore.getState();
    modules.forEach((module) => {
      const validation = this.validateModuleIntegrity(module.id);
      if (validation.errors.length > 0 || validation.warnings.length > 0) {
        details.push({
          type: 'Module',
          id: module.id,
          name: module.title,
          errors: validation.errors,
          warnings: validation.warnings,
        });
      }
      totalErrors += validation.errors.length;
      totalWarnings += validation.warnings.length;
    });

    // Validate all lectures
    const { lectures } = useLectureStore.getState();
    lectures.forEach((lecture) => {
      const validation = this.validateLectureIntegrity(lecture.id);
      if (validation.errors.length > 0 || validation.warnings.length > 0) {
        details.push({
          type: 'Lecture',
          id: lecture.id,
          name: lecture.title,
          errors: validation.errors,
          warnings: validation.warnings,
        });
      }
      totalErrors += validation.errors.length;
      totalWarnings += validation.warnings.length;
    });

    return {
      isValid: totalErrors === 0,
      summary: {
        coursesChecked: courses.length,
        modulesChecked: modules.length,
        lecturesChecked: lectures.length,
        totalErrors,
        totalWarnings,
      },
      details,
    };
  }

  // Delete cascade - when deleting a course, delete all its modules and lectures
  async deleteCourseWithCascade(courseId: string): Promise<boolean> {
    try {
      const { modules } = useModuleStore.getState();
      const { lectures } = useLectureStore.getState();
      const { deleteCourse } = useCourseStore.getState();
      const { deleteModule } = useModuleStore.getState();
      const { deleteLecture } = useLectureStore.getState();

      // Find all related modules and lectures
      const courseModules = modules.filter((m) => m.courseId === courseId);
      const courseLectures = lectures.filter((l) => l.courseId === courseId);

      // Delete lectures first
      for (const lecture of courseLectures) {
        deleteLecture(lecture.id);
      }

      // Delete modules
      for (const module of courseModules) {
        deleteModule(module.id);
      }

      // Finally delete course
      deleteCourse(courseId);

      return true;
    } catch (error) {
      console.error('Cascade delete failed:', error);
      return false;
    }
  }

  // Delete module with cascade
  async deleteModuleWithCascade(moduleId: string): Promise<boolean> {
    try {
      const { lectures } = useLectureStore.getState();
      const { deleteModule } = useModuleStore.getState();
      const { deleteLecture } = useLectureStore.getState();

      // Find all related lectures
      const moduleLectures = lectures.filter((l) => l.moduleId === moduleId);

      // Delete lectures first
      for (const lecture of moduleLectures) {
        deleteLecture(lecture.id);
      }

      // Delete module
      deleteModule(moduleId);

      return true;
    } catch (error) {
      console.error('Cascade delete failed:', error);
      return false;
    }
  }

  // Clean up invalid courses
  cleanupInvalidCourses(): {
    cleaned: number;
    issues: string[];
  } {
    const { courses, deleteCourse } = useCourseStore.getState();
    const issues: string[] = [];
    let cleaned = 0;

    const invalidCourses = courses.filter((course) => {
      if (!course.title || course.title === 'undefined') {
        issues.push(
          `Course with ID ${course.id} has invalid title: "${course.title}"`,
        );
        return true;
      }
      if (!course.instructorId) {
        issues.push(
          `Course "${course.title}" (ID: ${course.id}) has no instructor assigned`,
        );
        return true;
      }
      return false;
    });

    // Delete invalid courses
    invalidCourses.forEach((course) => {
      deleteCourse(course.id);
      cleaned++;
    });

    return { cleaned, issues };
  }
}

// Export singleton instance
export const dataIntegrityService = new DataIntegrityService();

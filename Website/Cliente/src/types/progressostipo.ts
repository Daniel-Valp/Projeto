export interface CapituloProgresso {
    chapterId: string; // mesmo que capituloid
    completed: boolean;
  }
  
  export interface SecaoProgresso {
    sectionId: string; // mesmo que secaoid
    chapters: CapituloProgresso[];
  }
  
  export interface UserCourseProgress {
    userId: string;
    courseId: string;
    sections: SecaoProgresso[];
  }
  
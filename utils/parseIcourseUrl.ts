interface IcourseParams {
    courseId?: string;
    termId?: string;
    contentId?: string;
  }
  
  export function parseIcourseUrl(url: string): IcourseParams | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      return {
        courseId: pathParts[2] || undefined,
        termId: pathParts[4] || undefined,
        contentId: pathParts[6] || undefined
      };
    } catch {
      return null;
    }
  }
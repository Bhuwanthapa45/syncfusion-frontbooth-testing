export type FileType = 'PDF' | 'WORD' | 'EXCEL' | 'IMAGE' | 'POWERPOINT' | 'VIDEO' | 'AUDIO' | 'UNKNOWN';

export const getFileType = (fileName : string) : FileType =>{
    const extension = fileName.split('.').pop()?.toLowerCase();

   switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
    case 'rtf':
    case 'sfdt':
      return 'WORD';
    case 'xlsx':
    case 'xls':
    case 'csv':
      return 'EXCEL';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'IMAGE';
    case 'pptx':
    case 'ppt':
    case 'potx':
      return 'POWERPOINT';
    case 'mp4':
    case 'webm':
    case 'ogg':
      return 'VIDEO';
    case 'mp3':
    case 'wav':
      return 'AUDIO';
    default:
      return 'UNKNOWN';
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

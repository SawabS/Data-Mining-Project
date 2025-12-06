import { ThreeFileResult, UploadResult } from 'src/upload/upload.service';

declare module 'express' {
  interface Request {
    fileData?: UploadResult;
    bucket?: string;
    filesData: UploadResult[];
    threeFilesData?: ThreeFileResult;
  }
}

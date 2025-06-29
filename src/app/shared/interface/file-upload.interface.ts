export interface IFile extends File {
  url: Promise<string>;
  isMain: boolean;
}

export interface IFileUpload {
  file: File;
  description: string;
  alternateName: string;
  isMain: boolean;
}
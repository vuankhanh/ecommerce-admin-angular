import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MaterialModule } from '../../modules/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IFile, IFileUpload } from '../../interface/file-upload.interface';
import { FileInfoComponent } from '../file-info/file-info.component';

@Component({
  selector: 'app-file-drag-and-drop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FileInfoComponent,

    NgxFileDropModule,
    MaterialModule
  ],
  templateUrl: './file-drag-and-drop.component.html',
  styleUrl: './file-drag-and-drop.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => in', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('0.5s ease-in-out')
      ]),
      transition('in => void', [
        animate('0.5s ease-in-out', style({ opacity: 0, transform: 'translateX(100%)' }))
      ]),
      transition('void => out', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out')
      ]),
      transition('out => void', [
        animate('0.5s ease-in-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class FileDragAndDropComponent implements OnInit {
  @ViewChild(FileInfoComponent) fileInfoComponent!: FileInfoComponent;

  @Input() isMultiple: boolean = false;
  @Input() acceptMIMETypes: Array<string> = [];

  @Output() uploadFiles = new EventEmitter<IFileUpload[]>();

  accepts!: string;
  displayedColumns: string[] = ['name', 'media', 'type'];

  isFileOverLimit: boolean = false;
  files: Array<IFile> = [];
  fileUploads: Array<IFileUpload> = [];

  ngOnInit(): void {
    this.accepts = this.acceptMIMETypes.join(',');
  }

  public async dropped(files: Array<NgxFileDropEntry>) {
    if (this.isFileOverLimit) {
      this.isFileOverLimit = false;
      console.warn('File drop ignored due to file limit.');
      return; // Ignore file drop if limit is exceeded
    }

    const transformFile: Array<IFile> = await FileUploadUtil.transformFile(files);

    if (!this.validateFile(transformFile)) {
      alert('Invalid file type');
      return;
    }

    this.files = transformFile;
  }

  public fileOver(event: DragEvent) {
    if (!this.isMultiple && !this.isFileOverLimit) {
      const items = event.dataTransfer?.items;
      if (items && items?.length > 1) {
        this.isFileOverLimit = true;
      }
    }
  }

  public fileLeave() {
    // console.log(event);
    this.isFileOverLimit = false;
  }

  handleFilesUploaded(fileUploads: IFileUpload[]): void {
    this.fileUploads = fileUploads;
    this.uploadFiles.emit(this.fileUploads);
  }

  reset() {
    this.files = [];
    this.isFileOverLimit = false;
    this.fileInfoComponent.reset();
  }

  private validateFile(transformFile: Array<File>): boolean {
    return transformFile.some(file => {
      return file ? this.acceptMIMETypes.includes(file.type) : false;
    });
  }
}

class FileUploadUtil {
  static async transformFile(droppedFiles: Array<NgxFileDropEntry>): Promise<Array<IFile>> {
    const result: Array<IFile> = [];
    for (const droppedFile of droppedFiles) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        const file = await this.cbToPromise(fileEntry);
        const url = this.createObjectURL(file);
        const newFile = Object.assign(file, { url }) as IFile;

        result.push(newFile);
      }
    }

    return result;
  }

  static cbToPromise(dropFile: FileSystemFileEntry): Promise<File> {
    return new Promise((resolve, reject) => {
      dropFile.file((file: File) => {
        resolve(file);
      }, (error: Error) => {
        reject(error);
      })
    })
  }

  static createObjectURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as ArrayBuffer;
        const blob = new Blob([result]);
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    })
  }

  // static progessBarValue(file: File): Observable<IFileProgress> {
  //   return new Observable<IFileProgress>((observer) => {
  //     const reader = new FileReader();
  //     observer.next({
  //       progress: 0,
  //       isComplete: false
  //     });
  //     reader.onprogress = (event: ProgressEvent<FileReader>) => {
  //       if (event.lengthComputable) {
  //         const progress = Math.round((event.loaded / event.total) * 100);
  //         observer.next({
  //           progress: progress,
  //           isComplete: false
  //         });
  //       }
  //     };

  //     reader.onload = () => {
  //       const result = reader.result as ArrayBuffer;
  //       const blob = new Blob([result]);
  //       const url = URL.createObjectURL(blob);

  //       // Emit final progress với URL
  //       observer.next({
  //         progress: 100,
  //         url: url,
  //         isComplete: true
  //       });

  //       observer.complete();
  //     };

  //     reader.onerror = (error) => {
  //       observer.error(error);
  //     };

  //     reader.readAsArrayBuffer(file);
  //   });
  // }
}
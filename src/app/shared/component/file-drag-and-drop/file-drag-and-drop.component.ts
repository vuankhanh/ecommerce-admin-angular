import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MaterialModule } from '../../modules/material';
import { BehaviorSubject } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatchHeightDirective } from '../../directive/match-height.directive';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filesArrayValidator } from '../../utitl/form-validator/files_array.validator';
import { IRequestParamsWithFiles } from '../../interface/request.interface';

@Component({
  selector: 'app-file-drag-and-drop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    GalleryComponent,
    MatchHeightDirective,

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
  @Input() isMultiple: boolean = false;
  @Input() acceptMIMETypes: Array<string> = [];
  
  @Output() uploadFiles = new EventEmitter<IRequestParamsWithFiles>();

  accepts!: string ;
  displayedColumns: string[] = ['name', 'media', 'type'];

  isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isFileOverLimit: boolean = false;
  files: Array<IFile> = [];

  isEditing: boolean = false;

  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      alternateName: [''],
      description: [''],
      files: [this.files, filesArrayValidator]
    });

  }

  ngOnInit(): void {
    this.accepts = this.acceptMIMETypes.join(',');
  }

  public async dropped(files: Array<NgxFileDropEntry>) {
    if (this.isFileOverLimit) {
      this.isFileOverLimit = false;
      console.warn('File drop ignored due to file limit.');
      return; // Ignore file drop if limit is exceeded
    }
    
    const transformFile: Array<IFile> = await this.transformFile(files);
    
    if (!this.validateFile(transformFile)) {
      alert('Invalid file type');
      return;
    }

    this.files = transformFile;
    this.formGroup.patchValue({ files: this.files });
    this.isEditing = false;
  }

  public fileOver(event: DragEvent) {
    if (!this.isMultiple && !this.isFileOverLimit) {
      const items = event.dataTransfer?.items;
      if (items && items?.length > 1) {
        this.isFileOverLimit = true;
      }
    }
  }

  public fileLeave(event: DragEvent) {
    // console.log(event);
    this.isFileOverLimit = false;
  }

  private validateFile(transformFile: Array<File>): boolean {
    return transformFile.some(file => {
      return file ? this.acceptMIMETypes.includes(file.type) : false;
    });
  }

  private async transformFile(droppedFiles: Array<NgxFileDropEntry>): Promise<Array<IFile>> {
    const result: Array<IFile> = [];
    for(let droppedFile of droppedFiles) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        const file = await this.cbToPromise(fileEntry);
        const newFile = Object.assign(file, { url: await this.createObjectURL(file) });

        result.push(newFile);
      }
    }
    
    return result;
  }

  private cbToPromise(dropFile: FileSystemFileEntry): Promise<File> {
    return new Promise((resolve, reject) => {
      dropFile.file((file: File) => {
        resolve(file);
      }, (error: Error)=>{
        reject(error);
      })
    })
  }

  createObjectURL(file: File): Promise<string> {
    return new Promise((resolve, reject)=>{
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

  editFiles(): void {
    this.isEditing = true;
  }

  upload() {
    const value = this.formGroup.value;
    const paramsWithFiles: IRequestParamsWithFiles = {
      alternateName: value.alternateName,
      description: value.description,
      files: value.files
    }
    this.uploadFiles.emit(paramsWithFiles);
  }

  ngOnDestroy() {

  }
}

interface IFile extends File {
  url: string;
}
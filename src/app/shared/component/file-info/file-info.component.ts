import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { CommonModule } from '@angular/common';
import { IFile, IFileUpload } from '../../interface/file-upload.interface';
import { FileSizePipe } from '../../pipe/file-size.pipe';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filesArrayValidator } from '../../utitl/form-validator/files_array.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FileSizePipe,

    MaterialModule
  ],
  templateUrl: './file-info.component.html',
  styleUrl: './file-info.component.scss'
})
export class FileInfoComponent implements OnChanges, OnInit, OnDestroy {
  @Input() files: Array<IFile> = [];

  @Output() uploadFiles = new EventEmitter<IFileUpload[]>();

  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  private readonly subscription: Subscription = new Subscription();
  // Khởi tạo FormArray đúng cách
  filesForm: FormGroup = this.formBuilder.group({
    files: this.formBuilder.array([], [Validators.minLength(1), filesArrayValidator])
  });

  get filesControls(): FormArray {
    return this.filesForm.get('files') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const files = changes['files'];
    if (files.currentValue && files.currentValue.length && files.currentValue != files.previousValue) {
      this.updateFormArray(files.currentValue);
    }
  }

  ngOnInit(): void {
    this.subscription.add(
      this.filesControls.valueChanges.subscribe(files => {
        this.uploadFiles.emit(files);
      })
    )
  }

  private updateFormArray(files: Array<IFile>): void {
    const filesFormArray = this.filesControls;

    // Add new controls
    files.forEach(file => {
      const fileGroup = this.formBuilder.group({
        file: [file, Validators.required],
        description: [''],
        alternateName: [''],
        isMain: [false] // cho radio button
      });
      filesFormArray.push(fileGroup);
    });
  }

  // Method để set file chính (chỉ 1 file được chọn)
  onMainFileChange(selectedIndex: number): void {
    this.filesControls.controls.forEach((control, index) => {
      const isMainControl = control.get('isMain');
      if (index === selectedIndex) {
        isMainControl?.setValue(true);
      } else {
        isMainControl?.setValue(false);
      }
    });
  }

  removeFile(file: IFile, index: number) {
    // Remove from FormArray
    this.filesControls.removeAt(index);

    // Remove from input array
    this.files.splice(index, 1);
    this.files = [...this.files];
  }


  reset() {
    this.files = [];
    this.filesControls.clear();
    this.filesForm.reset();
  }

  onSubmit() {
    if (this.filesControls.invalid) {
      this.filesControls.markAllAsTouched();
      return;
    }

    const submittedFiles: IFileUpload[] = this.filesControls.value;
    this.uploadFiles.emit(submittedFiles);
    console.log('Submitted files:', this.filesControls.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

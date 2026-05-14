import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService, CinUploadResult } from '../../services/file-upload.service';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

@Component({
  selector: 'app-employee-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-verification.component.html',
  styleUrls: ['./employee-verification.component.css']
})
export class EmployeeVerificationComponent {

  cinFront: File | null = null;
  cinBack:  File | null = null;

  frontPreview: string = '';
  backPreview:  string = '';

  frontUrl: string = '';
  backUrl:  string = '';

  // ── Résultat OCR ─────────────────────────────────────────────────────────
  cinNumber:     string = '';
  ocrStatus:     string = '';
  ocrConfidence: number = 0;
  ocrWarning:    string = '';

  uploadState: UploadState = 'idle';
  errorMessage = '';
  uploadProgress = 0;

  frontError = '';
  backError  = '';

  // ── Vérification employé ──────────────────────────────────────────────────
  verificationMessage: string = '';
  isVerified:          boolean = false;
  userId:              number | null = null;
  fullName:            string = '';           // ← NOUVEAU

  readonly ALLOWED_TYPES = [
    'image/jpeg', 'image/jpg', 'image/jfif',
    'image/pjpeg', 'image/png', 'image/webp'
  ];
  readonly MAX_MB = 10;

  constructor(private uploadService: FileUploadService) {}

  get canSubmit(): boolean {
    return !!this.cinFront && !!this.cinBack &&
           !this.frontError && !this.backError &&
           this.uploadState !== 'uploading';
  }

  get isUploading(): boolean { return this.uploadState === 'uploading'; }
  get isSuccess():   boolean { return this.uploadState === 'success'; }
  get isError():     boolean { return this.uploadState === 'error'; }

  get confidencePercent(): string {
    return (this.ocrConfidence * 100).toFixed(0) + '%';
  }

  get confidenceColor(): string {
    if (this.ocrConfidence >= 0.8) return '#22c55e';
    if (this.ocrConfidence >= 0.5) return '#f59e0b';
    return '#ef4444';
  }

  onFrontSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.frontError = ''; this.frontPreview = ''; this.cinFront = null;
    if (!file) return;
    const err = this.validate(file);
    if (err) { this.frontError = err; return; }
    this.cinFront = file;
    this.readPreview(file, url => this.frontPreview = url);
  }

  onBackSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.backError = ''; this.backPreview = ''; this.cinBack = null;
    if (!file) return;
    const err = this.validate(file);
    if (err) { this.backError = err; return; }
    this.cinBack = file;
    this.readPreview(file, url => this.backPreview = url);
  }

  onFrontDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    this.frontError = ''; this.frontPreview = ''; this.cinFront = null;
    const err = this.validate(file);
    if (err) { this.frontError = err; return; }
    this.cinFront = file;
    this.readPreview(file, url => this.frontPreview = url);
  }

  onBackDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    this.backError = ''; this.backPreview = ''; this.cinBack = null;
    const err = this.validate(file);
    if (err) { this.backError = err; return; }
    this.cinBack = file;
    this.readPreview(file, url => this.backPreview = url);
  }

  onDragOver(event: DragEvent): void { event.preventDefault(); }

  removeFront(event: Event): void {
    event.stopPropagation();
    this.cinFront = null; this.frontPreview = ''; this.frontError = '';
  }

  removeBack(event: Event): void {
    event.stopPropagation();
    this.cinBack = null; this.backPreview = ''; this.backError = '';
  }

  uploadCIN(): void {
    if (!this.canSubmit) return;

    const formData = new FormData();
    formData.append('front', this.cinFront!);
    formData.append('back',  this.cinBack!);

    this.uploadState    = 'uploading';
    this.errorMessage   = '';
    this.uploadProgress = 0;

    const ticker = setInterval(() => {
      if (this.uploadProgress < 85) this.uploadProgress += 5;
    }, 150);

    this.uploadService.uploadCIN(formData).subscribe({
      next: (res: CinUploadResult) => {
        clearInterval(ticker);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.frontUrl            = res.frontUrl;
          this.backUrl             = res.backUrl;
          this.cinNumber           = res.cinNumber      || 'Non détecté';
          this.ocrStatus           = res.ocrStatus      || 'unknown';
          this.ocrConfidence       = res.ocrConfidence  || 0;
          this.ocrWarning          = res.warning        || '';
          this.isVerified          = res.verified       || false;
          this.userId              = res.employeeId     || null;
          this.fullName            = res.fullName       || '';   // ← NOUVEAU
          this.verificationMessage = res.message        || '';
          this.uploadState         = 'success';
        }, 300);
      },
      error: (err) => {
        clearInterval(ticker);
        this.uploadState    = 'error';
        this.uploadProgress = 0;
        this.errorMessage   = err.error?.error
          || (typeof err.error === 'string' ? err.error : 'Erreur réseau. Veuillez réessayer.');
      }
    });
  }

  reset(): void {
    this.cinFront = null; this.cinBack = null;
    this.frontPreview = ''; this.backPreview = '';
    this.frontUrl = ''; this.backUrl = '';
    this.cinNumber = ''; this.ocrStatus = '';
    this.ocrConfidence = 0; this.ocrWarning = '';
    this.frontError = ''; this.backError = '';
    this.uploadState = 'idle';
    this.errorMessage = '';
    this.uploadProgress = 0;
    this.isVerified = false;
    this.userId = null;
    this.fullName = '';                                          // ← NOUVEAU
    this.verificationMessage = '';
  }

  private validate(file: File): string {
    if (!this.ALLOWED_TYPES.includes(file.type))
      return 'Format non accepté (JPEG, PNG, WEBP uniquement).';
    if (file.size > this.MAX_MB * 1024 * 1024)
      return `Taille maximale dépassée (${this.MAX_MB} MB).`;
    return '';
  }

  private readPreview(file: File, cb: (url: string) => void): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) =>
      cb(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  fileSizeMB(file: File | null): string {
    if (!file) return '';
    return (file.size / 1024 / 1024).toFixed(2) + ' MB';
  }
}

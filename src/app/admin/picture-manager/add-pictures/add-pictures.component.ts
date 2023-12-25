import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { PictureService } from '../../../shared/services/picture.service';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { ProcessingFile } from '../../../shared/models/processing-file';
import { FirebasePicture } from '../../../shared/models/firebase-data';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { sumBy } from 'lodash';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import firebase from 'firebase/compat';
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

interface UploadResult {
  size: string;
  url: string;
  ref: string;
}

@Component({
  selector: 'app-add-pictures',
  templateUrl: './add-pictures.component.html',
  styleUrls: ['./add-pictures.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPicturesComponent extends Unsubscribable {

  uploadFormGroup: FormGroup;
  processingFiles$: BehaviorSubject<ProcessingFile[]> = new BehaviorSubject<ProcessingFile[]>([]);
  displayedColumns = ['image', 'filename', 'resizedSmall', 'resizedMedium', 'uploaded'];
  completionStatus$: Observable<number | undefined>;

  constructor(private _fb: FormBuilder,
              private _pictureService: PictureService,
              private _firebaseService: FirebaseService,
              private _changeDetector: ChangeDetectorRef) {
    super();
    this.uploadFormGroup = _fb.group({
      files: ['', Validators.required]
    });
    this.completionStatus$ = this.processingFiles$.pipe(
      map(pfs => {
        if (pfs.length === 0) {
          return undefined;
        }
        return sumBy(pfs, pf => {
          return (pf.small ? 1 : 0)
            + (pf.medium ? 1 : 0)
            + (pf.isUploaded ? 1 : 0);
        }) * 100 / (pfs.length * 3);
      }),
      distinctUntilChanged());
    this.processingFiles$.pipe(
      map((pfs: ProcessingFile[]) => pfs.filter(pf => !pf.isUploading && !pf.isUploaded && !!pf.small && !!pf.medium)),
      filter(pfs => !!pfs.length),
      tap(pfs => pfs.forEach(pf => pf.isUploading = true)),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(pfs => {
      pfs.forEach(pf => {
        forkJoin(
          [this.uploadImage(pf.small, 'small'),
            this.uploadImage(pf.medium, 'medium'),
            this.uploadImage(pf.large, 'large')])
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((result: UploadResult[]) => {
            const smallImage = result.find(ur => ur.size === 'small');
            const mediumImage = result.find(ur => ur.size === 'medium');
            const largeImage = result.find(ur => ur.size === 'large');
            const picture: FirebasePicture = {
              small: {url: smallImage!.url, ref: smallImage!.ref},
              medium: {url: mediumImage!.url, ref: mediumImage!.ref},
              large: {url: largeImage!.url, ref: largeImage!.ref},
              ordered: false,
              order: -1
            };
            this._firebaseService.createPicture(picture).pipe(takeUntil(this.ngUnsubscribe$))
              .subscribe(() => {
                  pf.isUploading = false;
                  pf.isUploaded = true;
                  this.processingFiles$.next(this.processingFiles$.value);
                  this._changeDetector.detectChanges();
                },
                error => console.error('error saving picture', error));
          });
      });
    });
  }

  onSubmit() {
    // const files: FileInput = this.uploadFormGroup.getRawValue().files;
    // this.processingFiles$.next(files.files.map((file: File) => {
    //   return {
    //     large: file,
    //     small: null,
    //     medium: null,
    //     imageLoaded: false,
    //     isUploaded: false,
    //     isUploading: false
    //   };
    // }));
    // this.uploadFormGroup.get('files')!.setValue('');
    // console.log(this.processingFiles$.getValue());
    // this._pictureService.resizeImageForThumbnail(files.files)
    //   .pipe(takeUntil(this.ngUnsubscribe$))
    //   .subscribe((resizedFile: File) => {
    //     this.processingFiles$.getValue()!.find(pf => pf.large.name === resizedFile.name)!.small = resizedFile;
    //     this.processingFiles$.next(this.processingFiles$.value);
    //     this._changeDetector.detectChanges();
    //
    //     const fileReader = new FileReader();
    //     fileReader.onload = () => {
    //       this.processingFiles$.getValue()!.find(pf => pf.large.name === resizedFile.name)!.image = fileReader.result;
    //       this.processingFiles$.getValue()!.find(pf => pf.large.name === resizedFile.name)!.imageLoaded = true;
    //       this.processingFiles$.next(this.processingFiles$.value);
    //       this._changeDetector.detectChanges();
    //     };
    //     fileReader.readAsDataURL(resizedFile);
    //   });
    // this._pictureService.resizeImageForShowcase(files.files)
    //   .pipe(takeUntil(this.ngUnsubscribe$))
    //   .subscribe((resizedBlob: File) => {
    //     this.processingFiles$.getValue()!.find(pf => pf.large.name === resizedBlob.name)!.medium = resizedBlob;
    //     this.processingFiles$.next(this.processingFiles$.value);
    //     this._changeDetector.detectChanges();
    //   });
  }

  private uploadImage(file: File, key: string): Observable<UploadResult> {
    let smallRef: string;
    return this._pictureService.uploadPicture(file, key)
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((result: UploadTaskSnapshot) => {
          smallRef = result.metadata.fullPath;
          return result.ref.getDownloadURL();
        }),
        map(url => ({size: key, url: url, ref: smallRef})));
  }

}

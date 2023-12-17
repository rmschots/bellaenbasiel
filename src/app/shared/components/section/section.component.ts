import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy
} from '@angular/core';
import { SectionService } from '../../services/section.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements AfterViewInit, OnDestroy {

  @Input() sectionId!: string;
  @Input() sectionName!: string;

  constructor(private _element: ElementRef, private _sectionService: SectionService) {
  }

  ngAfterViewInit() {
    this.notifyChangePosition();
    interval(1000).pipe(untilDestroyed(this))
      .subscribe(() => this.notifyChangePosition());
  }


  @HostListener('window:resize')
  onResize() {
    this.notifyChangePosition();
  }

  ngOnDestroy(): void {
    this._sectionService.removeSection(this.sectionId);
  }

  private notifyChangePosition() {
    this._sectionService.addSection(this.sectionId, this.sectionName, this._element.nativeElement.offsetTop);
  }

}

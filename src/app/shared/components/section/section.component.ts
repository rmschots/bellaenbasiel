import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy
} from '@angular/core';
import { interval } from 'rxjs';
import { SectionService } from '../../services/section/section.service';
import { Unsubscribable } from '../../util/unsubscribable';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bnb-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent extends Unsubscribable implements AfterViewInit, OnDestroy {

  @Input() sectionId: string;
  @Input() sectionName: string;

  constructor(private _element: ElementRef, private _sectionService: SectionService) {
    super();
  }

  ngAfterViewInit() {
    this.notifyChangePosition();
    interval(1000).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.notifyChangePosition());
  }


  @HostListener('window:resize')
  onResize() {
    this.notifyChangePosition();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._sectionService.removeSection(this.sectionId);
  }

  private notifyChangePosition() {
    this._sectionService.addSection(this.sectionId, this.sectionName, this._element.nativeElement.offsetTop);
  }

}

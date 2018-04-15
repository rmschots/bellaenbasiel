import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { interval } from 'rxjs/observable/interval';
import { SectionService } from '../../services/section/section.service';
import { Unsubscribable } from '../../util/unsubscribable';

@Component({
  selector: 'bnb-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent extends Unsubscribable implements AfterViewInit {

  @HostBinding('attr.id') @Input() sectionName: string;

  constructor(private _element: ElementRef, private _sectionService: SectionService) {
    super();
  }

  ngAfterViewInit() {
    this.notifyChangePosition();
    interval(1000).takeUntil(this.ngUnsubscribe$)
      .subscribe(() => this.notifyChangePosition());
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.notifyChangePosition();
  }

  private notifyChangePosition() {
    this._sectionService.addSection(this.sectionName, this._element.nativeElement.offsetTop);
  }

}

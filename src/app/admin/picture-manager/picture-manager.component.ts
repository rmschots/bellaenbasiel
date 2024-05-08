import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Unsubscribable } from '../../shared/util/unsubscribable';


@Component({
  selector: 'bnb-picture-manager',
  templateUrl: './picture-manager.component.html',
  styleUrls: ['./picture-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictureManagerComponent extends Unsubscribable {


}

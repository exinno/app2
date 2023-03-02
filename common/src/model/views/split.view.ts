import { Field, View } from '..';
import { ContainerViewModel } from './container.view';

/** Split view model */
@View({
  name: 'splitView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Split Options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class SplitViewModel extends ContainerViewModel {
  declare type?: 'SplitView';

  name? = 'SplitView';

  /** It defines size of the split view.
   *  Best to include unit (cm, mm, in, px, rem, etc.) when writing in string. */
  @Field({ type: 'StringField' })
  sizes?: (number | string | undefined)[];

  /** It defines maximum size of the split view.
   *  Best to include unit (cm, mm, in, px, rem, etc.) when writing in string. */
  @Field({ type: 'StringField' })
  minSizes?: (number | string | undefined)[];

  /** It defines minimum size of the split view.
   *  Best to include unit (cm, mm, in, px, rem, etc.) when writing in string. */
  @Field({ type: 'StringField' })
  maxSizes?: (number | string | undefined)[];
}

import { Field, FieldModel, PropOptions, View } from '..';

/** Breadcrumb field */
@View({
  name: 'breadcrumbField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'items']
})
export class BreadcrumbFieldModel extends FieldModel {
  declare type: 'BreadcrumbField';

  name? = 'BreadcrumbField';

  icon? = 'mdi-chevron-triple-right';

  /**
   * Defines the list of Breadcrumb items.
   */
  @Field({
    type: 'PropField',
    propType: 'BreadcrumbItem[] | (<T extends this>(options: PropOptions<T>) => BreadcrumbItem[])'
  })
  items?: BreadcrumbItem[] | (<T extends this>(options: PropOptions<T>) => BreadcrumbItem[]);

  /**
   * Specifies the Url of the active Breadcrumb item.
   */
  @Field()
  activeItem?: string;

  /**
   * Specifies an integer to enable overflow behavior when the Breadcrumb items count exceeds and it is based on the overflowMode property.
   */
  @Field()
  maxItems?: number;
}

export interface BreadcrumbItem {
  /**
   * Specifies the text content of the Breadcrumb item.
   */
  text?: string;

  /**
   * Specifies the Url of the Breadcrumb item that will be activated when clicked.
   */
  url?: string;

  /**
   * Defines a class/multiple classes separated by a space for the item that is used to include an icon.
   */
  iconCss?: string;

  /**
   * Enable or disable the breadcrumb item, when set to true, the breadcrumb item will be disabled.
   *
   * @default false
   */
  disabled?: boolean;

  onItemClick?: (options: PropOptions<BreadcrumbFieldModel>) => void;
}

interface IIcon {
  fontSet: string;
  fontIcon: string;
}

interface IBaseMenu {
  name: string;
  icon?: IIcon
}

export interface IMenuWithRoute extends IBaseMenu {
  route: string;
  children?: never; // Không được có children
}

export interface IMenuWithChildren extends IBaseMenu {
  route?: never; // Không được có route
  children: TMenu[];
}

export type TMenu = IMenuWithRoute | IMenuWithChildren;
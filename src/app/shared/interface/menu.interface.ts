export interface IMenu {
  name: string;
  icon?: string;
  route: string;
  children?: IMenu[];
}
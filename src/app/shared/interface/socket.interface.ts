export interface ISocketDataChange {
  route: 'logo' | 'album' | 'hightlightMarketing';
  action: 'create' | 'modify' | 'delete';
  data: any;
}
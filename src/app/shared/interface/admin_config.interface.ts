import { ISuccess } from "./success.interface"

export interface IConfig {
  serverTime: number
}
export interface IAdminConfigResponse extends ISuccess {
  metaData: IConfig
}
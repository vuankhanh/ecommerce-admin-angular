import { Success } from "./success.interface"

export interface IConfig {
  serverTime: number
}
export interface IAdminConfigResponse extends Success {
  metaData: IConfig
}
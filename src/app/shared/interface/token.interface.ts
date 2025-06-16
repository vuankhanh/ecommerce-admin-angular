import { Success } from "./success.interface"

export type Token = IAccessToken & IRefreshToken

export interface IAccessToken {
  accessToken: string
}

export interface IRefreshToken {
  refreshToken: string
}

export interface ITokenResponse extends Success {
  metaData: Token
}

export interface IRefreshTokenResponse extends Success {
  metaData: IAccessToken
}
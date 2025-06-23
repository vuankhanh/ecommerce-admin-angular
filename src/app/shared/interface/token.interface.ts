import { ISuccess } from "./success.interface"

export type Token = IAccessToken & IRefreshToken

export interface IAccessToken {
  accessToken: string
}

export interface IRefreshToken {
  refreshToken: string
}

export interface ITokenResponse extends ISuccess {
  metaData: Token
}

export interface IRefreshTokenResponse extends ISuccess {
  metaData: IAccessToken
}
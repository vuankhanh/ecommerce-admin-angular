export interface IJwtDecoded {
  email: string,
  name: string,
  avatar: string,
  exp: number,
  iat: number
}

export interface IUserInformation {
  email: string,
  name: string,
  avatar: string,
  phoneNumber: string,
  customerCode: string,
  createdAt: string,
  updatedAt: string
}

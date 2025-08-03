import { IMongodbDocument } from "./mongo.interface";
import { AuthenticationProvider, UserRole } from "../constant/user.constant";

export interface IJwtDecoded {
  email: string,
  name: string,
  avatar: string,
  exp: number,
  iat: number
}

export interface IUserInformation {
  email: string;
  emailVerified: boolean;
  hasPassword: boolean;
  password?: string;
  googleId?: string;
  facebookId?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  name: string;
  avatar?: string;
  role: `${UserRole}`
  createdByProvider: `${AuthenticationProvider}`;
}

export type TUserInformationModel = IUserInformation & IMongodbDocument;

export interface ICurrentUser {
  id: string;
  email: string;
}

export interface AddedBy {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  createdDate?: Date;
  updatedAt?: Date;
  lastLoginDate?: Date;
  emailVerified?: boolean;
  inviteAcceptedOn?: Date;
  inviteAccepted?: boolean;
  defaultPasswordChanged?: boolean;
  invitedBy?: AddedBy | string;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export type StatusStrings = keyof typeof Status;

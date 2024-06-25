import {
  IsEmailOptions,
  IsMobilePhoneOptions,
  MobilePhoneLocale,
  StrongPasswordOptions,
  UUIDVersion,
} from "validator";

export interface VSchema {
  email?: { message?: string; options?: IsEmailOptions };
  phone?: {
    message?: string;
    locale: MobilePhoneLocale;
    options?: IsMobilePhoneOptions;
  };
  password?: {
    message?: string;
    options?: StrongPasswordOptions & { returnScore: false };
  };
  data_uri?: {
    message?: string;
  };
  required?: { message?: string };
  options?: { items: (string | number)[]; message?: string };
  regex?: { pattern: RegExp; message?: string };
  uuid?: { version?: UUIDVersion; message?: string };
  equal?: { type: "static" | "dynamic"; value: string; message?: string };
  number?: { min?: number; max?: number; message?: string };
}

export type ValidationSchema = {
  [key: string]:
    | VSchema
    | VSchema[]
    | {
        object?: ValidationSchema | ValidationSchema[];
        string?: VSchema | VSchema[];
      };
};

export type ValidationResultMeta = {
  is_empty: boolean;
  field_count: number;
};

export type ValidationResult = {
  errors: {
    [key: string]:
      | string
      | {
          [key: string]: string;
        }[]
      | {
          [key: string]: {
            [key: string]: string;
          };
        };
  };
  valid: {
    [key: string]:
      | boolean
      | {
          [key: string]: boolean;
        }[]
      | {
          [key: string]: {
            [key: string]: boolean;
          };
        };
  };
  meta: ValidationResultMeta;
};

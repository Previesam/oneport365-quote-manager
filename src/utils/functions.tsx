import validator from "validator";
import {
  VSchema,
  ValidationResult,
  ValidationSchema,
} from "../types/validation";

export function escapeRegExp(string: string) {
  return string?.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function formatNumber(
  num: string | number,
  opts?: Intl.NumberFormatOptions
) {
  if ([0, "", null, undefined]?.includes(num)) return "0.00";
  let result = Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...(opts || {}),
  }).format(
    typeof num == "string"
      ? parseFloat(
          num?.replaceAll(",", "")?.replaceAll("+", "")?.replace(/-$/, "") ||
            "0"
        )
      : num
  );
  if (typeof num == "string" && /^-$/.test(num)) {
    result = "-";
  }
  return result;
}

export function readFileAsDataURL(file: File) {
  return new Promise((res, rej) => {
    try {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        res(e?.target?.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      rej(err);
    }
  });
}

export function readDataURLAsFileSync(dataUri: string, name?: string) {
  try {
    const type = dataUri.split(";")[0].split(":")[1];
    const content = dataUri
      .split(";")[1]
      .split(",")
      ?.filter((i, idx) => idx !== 0)
      ?.join(",");
    const result = new File([content], name || new Date().toISOString(), {
      type: type,
    });
    return result;
  } catch (err) {
    console.log(err);
    return "";
  }
}

export function readDataURLAsFile(dataUri: string, name?: string) {
  return new Promise((res: (file: File) => void, rej) => {
    try {
      const type = dataUri.split(";")[0].split(":")[1];
      const content = dataUri
        .split(";")[1]
        .split(",")
        ?.filter((i, idx) => idx !== 0)
        ?.join(",");
      const result = new File([content], name || new Date().toISOString(), {
        type: type,
      });
      res(result);
    } catch (err) {
      rej(err);
    }
  });
}

export function delay(timeout: number) {
  return new Promise((res) => {
    setTimeout(res, timeout);
  });
}

export function isIterable(obj: any) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}

export function padLeadingZero(num: number) {
  const val = num.toString();
  return val.length < 2 ? "0" + val : val;
}

export function arraysAreEqual(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value: any, index: any) => value === arr2[index]);
}

export function validateForm<T>(
  data: T | any,
  schema: ValidationSchema,
  field?: string
): { errors: ValidationResult["errors"]; valid: ValidationResult["valid"] } {
  const errors: ValidationResult["errors"] = {};
  const valid: ValidationResult["valid"] = {};

  if (!data) {
    return {
      errors,
      valid,
    };
  }

  for (const key of Object.keys(data || {})) {
    let activeSchema = (schema as any)[key] as VSchema;
    let value =
      typeof data?.[key] === "number"
        ? data?.[key]?.toString() || ""
        : data?.[key] || "";

    if (["object"].includes(typeof value)) {
      if (Array.isArray(value)) {
        const array = [];
        const valids = [];
        for (const [idx, item] of (value || []).entries()) {
          if (typeof item == "object") {
            const result = validateForm(
              item,
              (activeSchema as any)?.object,
              field
            );
            if (result.errors && Object.keys(result.errors)?.length > 0) {
              array.push(result.errors);
            } else {
              array.push("");
            }
            valids.push(result.valid);
          } else {
            const result = validateForm(
              { [idx]: item },
              { [idx]: (activeSchema as any)?.string },
              field
            );
            const message = result?.errors?.[idx?.toString()];
            if (message) {
              array.push(message);
            } else {
              array.push("");
            }
            valids.push(result.valid?.[idx?.toString()]);
          }
        }
        if ([...array].filter((i) => i).length > 0 && errors) {
          (errors as any)[key] = array;
        }
        (valid as any)[key] = valid;
      } else {
        const result = validateForm(value, (schema as any)[key], field);
        if (result.errors && Object.keys(result?.errors)?.length > 0) {
          (errors[key] as any) = result?.errors;
        }
        (valid as any)[key] = result.valid;
      }
    } else if (!["boolean"].includes(typeof value)) {
      let message = "";
      let result = true;

      value = value?.toString();

      if (Array.isArray(activeSchema)) {
        activeSchema = activeSchema.find((i) =>
          arraysAreEqual(Object.keys(i), Object.keys(data))
        );
      }

      if (!activeSchema) {
        result = true;
        if (field?.includes(key)) {
          console.warn(
            "Could not determine the right validation schema for field " + key
          );
          message = "";
        }
      } else if (activeSchema && Object.keys(activeSchema)?.length < 1) {
        result = true;
        if (field?.includes(key)) {
          message = "";
        }
      } else if (activeSchema?.required && validator.isEmpty(value)) {
        result = false;
        if (field?.includes(key)) {
          message = activeSchema?.required?.message || "Field is required";
        }
      } else if (
        activeSchema?.regex?.pattern &&
        !activeSchema?.regex?.pattern?.test(value)
      ) {
        result = false;
        if (field?.includes(key)) {
          message =
            activeSchema?.regex?.message ||
            "Field value did not match regex " +
              activeSchema?.regex?.pattern?.source;
        }
      } else if (
        activeSchema?.options?.items &&
        !activeSchema?.options?.items?.includes(value)
      ) {
        result = false;
        if (field?.includes(key)) {
          message =
            activeSchema?.options?.message ||
            `Field must match one of ${activeSchema?.options?.items?.join(
              ", "
            )}`;
        }
      } else if (
        activeSchema?.email &&
        !validator.isEmail(value, activeSchema?.email?.options)
      ) {
        result = false;
        if (field?.includes(key)) {
          message = activeSchema?.email?.message || "Invalid email address";
        }
      } else if (
        activeSchema?.phone &&
        !validator.isMobilePhone(value, activeSchema?.phone?.locale, {
          strictMode: true,
          ...activeSchema?.phone?.options,
        })
      ) {
        result = false;
        if (field?.includes(key)) {
          message =
            activeSchema?.phone?.message ||
            "Invalid phone number, please input with country code";
        }
      } else if (
        activeSchema?.password &&
        !validator.isStrongPassword(value, {
          minLength: 6,
          minUppercase: 1,
          minLowercase: 1,
          minNumbers: 1,
          ...activeSchema?.password?.options,
        })
      ) {
        result = false;
        if (field?.includes(key)) {
          message =
            activeSchema?.password?.message ||
            "Weak password, must be atleast 6 characters long, with minimum of one uppercase, one lowercase, and one number";
        }
      } else if (activeSchema?.data_uri && !validator.isDataURI(value)) {
        result = false;
        if (field?.includes(key)) {
          message = activeSchema?.data_uri?.message || "Invalid data uri";
        }
      } else if (
        activeSchema?.uuid &&
        !validator.isUUID(value, activeSchema?.uuid?.version || "all")
      ) {
        result = false;
        if (field?.includes(key)) {
          message = activeSchema?.uuid?.message || "Invalid id";
        }
      } else if (activeSchema?.equal) {
        if (
          activeSchema?.equal?.type == "static" &&
          value !== activeSchema?.equal?.value
        ) {
          result = false;
          if (field?.includes(key)) {
            message =
              activeSchema?.equal?.message ||
              "Field must be equal to " + activeSchema?.equal?.value;
          }
        } else if (
          activeSchema?.equal?.type == "dynamic" &&
          value !== data[activeSchema?.equal?.value]?.toString()
        ) {
          result = false;
          if (field?.includes(key)) {
            message =
              activeSchema?.equal?.message ||
              'Field must be equal to the value of "' +
                activeSchema?.equal?.value +
                '" field';
          }
        }
      } else if (activeSchema?.number) {
        console.log("Validating number", typeof value, value);
        if (
          !validator.isNumeric(value?.replaceAll(",", "")) ||
          (activeSchema?.number?.min !== undefined &&
            parseFloat(value?.replaceAll(",", "")) <
              activeSchema?.number?.min) ||
          (activeSchema?.number?.max !== undefined &&
            parseFloat(value?.replaceAll(",", "")) > activeSchema?.number?.max)
        ) {
          result = false;
          message =
            activeSchema?.number?.message ||
            `Field must be numeric${
              activeSchema?.number?.min !== undefined
                ? " Minimum: " + activeSchema?.number?.min
                : ""
            }${
              activeSchema?.number?.max !== undefined
                ? " Maximum: " + activeSchema?.number?.max
                : ""
            }.`;
        }
      } else {
        result = true;
        message = "";
      }
      valid[key] = result;
      if (message) {
        errors[key] = message;
      }
    }
  }

  console.log({ errors, valid });

  return { errors, valid };
}

export function transformValidationResult({
  errors,
  valid,
}: {
  errors: ValidationResult["errors"];
  valid: ValidationResult["valid"];
}): {
  errors: ValidationResult["errors"] | any;
  valid: ValidationResult["valid"] | any;
  meta: {
    is_empty: boolean;
    field_count: number;
  };
} {
  if (!errors) {
    return {
      errors: errors,
      valid: valid,
      meta: {
        is_empty: true,
        field_count: 0,
      },
    };
  }

  console.log(errors);

  const result: {
    is_empty: boolean;
    field_count: number;
  } = { is_empty: false, field_count: 0 };
  result.is_empty = validator.isEmpty(
    Object?.keys(valid)
      ?.map((i: any) => {
        if (!valid[i]) return "error";
        if (typeof valid[i] == "object") {
          if (Array.isArray(valid[i])) {
            return (valid[i] as any)
              ?.map((h: any) => {
                if (!h) return "error";
                if (typeof h == "object") {
                  return Object?.values(h)
                    ?.map((i) => (i ? "" : "error"))
                    ?.join("");
                } else {
                  if (!h) return "error";
                  return "";
                }
              })
              ?.join("");
          } else {
            return Object.values(valid[i])
              ?.map((i) => (i ? "" : "error"))
              .join("");
          }
        } else {
          if (!valid[i]) return "error";
          return "";
        }
      })
      .join("")
  );
  result.field_count = Object?.keys(errors)
    ?.map((i: any) => {
      if (!errors[i]) return 0;
      if (typeof errors[i] == "object") {
        if (!errors[i]) return 0;
        if (Array.isArray(errors[i])) {
          if (!errors[i]) return 0;
          return (errors[i] as any)
            ?.map((h: any) => {
              if (!h) return 0;
              return typeof h == "string"
                ? h
                  ? 1
                  : 0
                : Object?.values(h)
                    ?.map((k) => (k ? 1 : 0))
                    ?.reduce((prev: number, curr: number) => prev + curr, 0);
            })
            ?.reduce((prev: number, curr: number) => prev + curr, 0);
        } else {
          return Object.values(errors[i])
            .map((k) => (k ? 1 : 0))
            ?.reduce((prev: number, curr: number) => prev + curr, 0);
        }
      } else {
        return errors[i] ? 1 : 0;
      }
    })
    ?.reduce((prev: number, curr: number) => prev + curr, 0);
  return {
    errors,
    valid,
    meta: result,
  };
}

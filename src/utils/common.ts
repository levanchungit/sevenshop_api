import moment from "moment";

export const formatDateTime = (date: Date | string) => {
  return moment(date).format("YYYY-MM-DD");
};

export const getNow = () => {
  return moment().format();
};

export const getNowPlusMinute = (minute: number) => {
  return moment().add(minute, "minutes").format();
};

export const isValidDate = (dateString: string) => {
  return moment(dateString, "YYYY-MM-DD", true).isValid();
};

export const fieldValidation = {
  string: (val: any) => typeof val === "string",
  number: (val: any) => typeof val === "number",
  boolean: (val: any) => typeof val === "boolean",
  array: (val: any) => Array.isArray(val),
  arrayString: (val: any) =>
    Array.isArray(val) && val.every((v) => typeof v === "string"),
  arrayObject: (val: any) =>
    Array.isArray(val) && val.every((v) => typeof v === "object"),
  date: (val: any) => isValidDate(val),
};

export function validateFields(
  body: any,
  fields: {
    name: string;
    type: keyof typeof fieldValidation;
    required?: boolean;
  }[]
): string | undefined {
  const errors: string[] = [];
  fields.forEach((field) => {
    if (field.required && body[field.name] === undefined) {
      errors.push(`${field.name} is required`);
    }
    if (body[field.name] !== undefined) {
      const validator = fieldValidation[field.type];
      if (!validator(body[field.name])) {
        errors.push(`${field.name} must be a ${field.type}`);
      }
    }
  });
  return errors.length > 0 ? errors.join(", ") : undefined;
}

import moment from 'moment';

export function isInteger(value: string) {
  return /^\d+$/.test(value);
}

export function isBoolean(value: string) {
  return value === 'true' || value === 'false';
}

export function isDateAble(value: string) {
  return moment(value).isValid();
}

export function isObject(variable: any) {
  return typeof variable === 'object' && variable !== null;
}

export function parseString(val: string) {
  let convertedVal;
  if (val === 'null') {
    convertedVal = null;
  } else if (val === 'true' || val === 'false') {
    convertedVal = val === 'true';
  } else if (!isNaN(Number(val))) {
    convertedVal = Number(val);
  } else {
    convertedVal = String(val);
  }

  return convertedVal;
}

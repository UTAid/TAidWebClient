import { ValidatorResult } from './validator-result';

/**
* Contains a list of frequent validators to be used to create column validators
*/

const EMAIL_REGEX = new RegExp([
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))/,
  /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
].map((r) => r.source).join(''));

/**
* Checks for valid email. Uses RegEx provided by chrome.
*
* - `email`: email string
* - `errMsg?`: Optional custom error message. Defaults to 'Invalid Email'.
*/
export function emailValidator(email: string, errMsg = 'Invalid Email') {
  if (EMAIL_REGEX.test(email)) {
    return new ValidatorResult(true, 'OK');
  } else {
    return new ValidatorResult(false, errMsg);
  }
}

/**
* Check for non-empty/non-null string.
*
* - `str`: String to validate.
* - `errMsg?`: Optional custom error message. Defaults to 'Cannot be empty'
*/
export function nonEmptyValidator(str: string, errMsg = 'Cannot be empty') {
  if (str) {
    return new ValidatorResult(true, 'OK');
  } else {
    return new ValidatorResult(false, errMsg);
  }
}

export class ValidatorResult {
  /**
  * Carries the result of column validators to various components.
  *
  * - `isValid` true if validator is happy, false otherwise.
  * - `msg` contains a message returned by the validator to be displayed to
  *   user.
  */
  constructor (public isValid: boolean, public msg: string) {}
}

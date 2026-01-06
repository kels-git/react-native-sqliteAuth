const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&;]{8,20}$/;

const NUMBER_REGEXP = /^(0|[1-9][0-9]*)$/;

const NAME = /^[A-Za-z]+([A-Za-z\s'.-]*[A-Za-z])?$/

const EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;

const ALLOWED_CHARS_FOR_NORMAL_TEXT = "a-zA-Z0-9\\s,'/-";

export const REGEXVALIDATORS = {
  password: PASSWORD_REGEXP,
  number: NUMBER_REGEXP,
  name: NAME,
  email: EMAIL,
  ALLOWED_CHARS_FOR_NORMAL_TEXT: ALLOWED_CHARS_FOR_NORMAL_TEXT,
};

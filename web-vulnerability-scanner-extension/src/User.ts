export default class User {
  firstName: string;
  lastName: string;
  email: string;
  isDeveloper: boolean;
  darkModeDefault: boolean;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    isDeveloper: boolean,
    darkMode: boolean
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isDeveloper = isDeveloper;
    this.darkModeDefault = darkMode;
  }
}

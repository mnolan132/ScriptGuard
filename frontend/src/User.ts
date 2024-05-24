export class User {
  email: string;
  first_name: string;
  id: string;
  is_developer: string;
  last_name: string;

  constructor(
    email: string,
    first_name: string,
    id: string,
    is_developer: string,
    last_name: string
  ) {
    this.email = email;
    this.first_name = first_name;
    this.id = id;
    this.is_developer = is_developer;
    this.last_name = last_name;
  }
}

export function isValidEmail(email: string): boolean {
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  return regex.test(email) && email === email.toLowerCase();
}

export function isValidName(name: string): boolean {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(name);
}

export function isValidEmail(email: string): boolean {
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  return regex.test(email) && email === email.toLowerCase();
}

export function isValidName(name: string): boolean {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(name);
}

export function formatDate(date: Date) {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

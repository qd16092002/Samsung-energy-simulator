import * as bcrypt from 'bcrypt';

const saltOrRounds: number = 10;
export const bcryptHash = async (password: string) => {
  return bcrypt.hash(password, saltOrRounds);
};

export const isMatchPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashPassword);
};

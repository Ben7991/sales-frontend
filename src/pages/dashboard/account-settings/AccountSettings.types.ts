export type PersonalInformationInputs = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export type ChangePasswordInputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

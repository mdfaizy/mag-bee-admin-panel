


export interface SignInFormData {
  identifier: string;
  password: string;
  isChecked: boolean;
  showPassword: boolean;
}


export interface RoleOption {
  value: string;
  label: string;
}
export interface Role {
  id: number;
  name: string;
}
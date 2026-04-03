export type FieldType = 'TEXT' | 'LIST' | 'RADIO';

export interface FormFieldConfig {
  id: number;
  name: string;
  fieldType: FieldType;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  required?: boolean;
  listOfValues1?: string[];
}

export interface FormConfig {
  data: FormFieldConfig[];
}

export interface FormSubmission {
  timestamp: string;
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  product?: Product;
}

export interface User {
  fullName: string;
  email: string;
  password: string;
  gender: string;
}

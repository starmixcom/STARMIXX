export interface UserLead {
  name: string;
  email: string;
}

export type Variant = 'A' | 'B';

export interface OrderDetails {
  name: string;
  phone: string;
  city: string;
  neighborhood: string;
  quantity: number; // 1 = Pack Promo (2+1)
  variant: Variant; // Pour le tracking A/B testing
}

export enum Step {
  CAPTURE = 'capture',
  SALES = 'sales',
  THANK_YOU = 'thank-you'
}
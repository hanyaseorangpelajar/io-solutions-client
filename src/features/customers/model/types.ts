export interface CustomerDto {
  customerId: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  address: string | null;
  note: string | null;
}

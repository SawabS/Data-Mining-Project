export type CRUDReturn = { message: string; data?: any };

export type DataTypes = any;

export type PaginationObject<T extends DataTypes | Partial<DataTypes>> = {
  data: T[];
  next: boolean;
  total: number;
  total_page: number;
  page: number;
  limit: number;
  hasMore?: boolean;
  nextCursor?: string;
};

export type PaginationType<T extends DataTypes | Partial<DataTypes>> =
  PaginationObject<T>;

export type RegularTypeArray<T extends DataTypes | Partial<DataTypes>> = {
  data: T[] | Partial<T>[];
};
export type RegularType<T extends DataTypes | Partial<DataTypes>> = {
  data: T | Partial<T>;
};

export type PaginationParams = { page: number; limit: number; cursor?: string };
export type QueryParam = {
  filter?: string;
  itemType?: string;
  role?: string;
  expenseType?: string;
  city?: string;
  state?: string;
  user?: string;
  search?: string;
  to?: string;
  from?: string;
  brands: string;
  deleted?: string;
  topRatings?: string;
  fromCustomer?: string;
  newArrival?: string;
  comingSoon?: string;
  topSales?: string;
  table?: string;
  selectedValueIds: number[];
  report?: string;
  date?: string;
  customer?: string;
  revenueType?: string;
  priceMin?: number;
  priceMax?: number;
  offerType: string;
  paymentMethod: string;
  tags: string;
  special: string;
  brand: string;
  orderStatus?: 'PENDING' | 'RETURNED' | 'CANCELLED' | 'REJECTED' | 'DELIVERED';
  orderPaymentStatus?: 'PAID' | 'UNPAID' | 'REFUNDED';
  orderPaymentType?: 'CASH' | 'CARD';
  // Time frame filters
  year?: string;
  month?: string;
  dayOfWeek?: string;
  timeOfDay?: 'day' | 'night' | 'all';
  // Accident specific filters
  severity?: string;
};

export interface CartItemResponse {
  bookId: number;
  bookName: string;
  bookImage: string;
  countItemInCart: number;
  stockQuantity: number;
  totalPrice: number;
}

export interface CartDetailResponse {
  cartId: number;
  cartItems: CartItemResponse[];
}
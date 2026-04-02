export interface Category { id: number; name: string; }
export interface Product { id: number; name: string; categoryId: number; categoryName: string; price: number; defaultDiscount?: number; isActive: boolean; }
export interface BillItem { productId: number; quantity: number; price: number; total: number; productName: string; }
export interface Bill { id: number; invoiceNumber: string; createdAt: string; totalAmount: number; discountAmount: number; taxAmount: number; finalAmount: number; items: BillItem[]; }
export interface Insight { id: number; name: string; value: number; }

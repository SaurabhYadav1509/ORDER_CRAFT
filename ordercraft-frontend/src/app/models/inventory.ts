export interface Inventory {
  id?: number;
  materialName: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
}

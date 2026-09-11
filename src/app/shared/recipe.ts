export interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    category_id: number;
    user_id: number;
    image_url?: string;
}

export interface RestaurantForList {
    readonly id: number;
    readonly placeId: string;
    readonly displayName: string;
    readonly thumbnailPhotoUrl: string;
    readonly rating: number;
    readonly userRatingCount: number;
    readonly purposeLunch: boolean;
    readonly purposeDinner: boolean;
    readonly purposeCafe: boolean;
    readonly openingDays: OpeningDays;
}

export interface OpeningDays {
    readonly monday: boolean;
    readonly tuesday: boolean;
    readonly wednesday: boolean;
    readonly thursday: boolean;
    readonly friday: boolean;
    readonly saturday: boolean;
    readonly sunday: boolean;
}

export interface RestaurantForDetail {
    readonly id: number;
    readonly placeId: string;
    readonly displayName: string;
    readonly priceLevel: PriceLevel;
    readonly rating: number;
    readonly userRatingCount: number;
    readonly reservable?: boolean;
    readonly purposeLunch?: boolean;
    readonly purposeDinner?: boolean;
    readonly purposeCafe?: boolean;
    readonly photoUrls: string[];
    readonly description?: string;
    readonly websiteUrl?: string;
    readonly googleMapUrl: string;
    readonly phoneNumber: string;
    readonly reviews: Review[];
    readonly openingHours: OpeningHour[];
    readonly location: Location;
}

export const PriceLevel = {
    PRICE_LEVEL_UNSPECIFIED: "PRICE_LEVEL_UNSPECIFIED",  // 指定なしor不明
    PRICE_LEVEL_FREE: "PRICE_LEVEL_FREE",  // 無料
    PRICE_LEVEL_INEXPENSIVE: "PRICE_LEVEL_INEXPENSIVE",  // 安価
    PRICE_LEVEL_MODERATE: "PRICE_LEVEL_MODERATE",  // 手頃
    PRICE_LEVEL_EXPENSIVE: "PRICE_LEVEL_EXPENSIVE",  // 高い
    PRICE_LEVEL_VERY_EXPENSIVE: "PRICE_LEVEL_VERY_EXPENSIVE",  // 高級
} as const;

export type PriceLevel = typeof PriceLevel[keyof typeof PriceLevel];

export interface Review {
    readonly reviewId: string;
    readonly authorName: string;
    readonly publishTime: Date;
    readonly rating: number;
    readonly comment: string;
}

export interface OpeningHour {
    readonly open: HourDetail;
    readonly close: HourDetail;
}

export interface HourDetail {
    readonly day: number;
    readonly hour: number;
    readonly minute: number;
}
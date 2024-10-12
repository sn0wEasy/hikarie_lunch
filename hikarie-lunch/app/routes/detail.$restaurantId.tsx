import { useLoaderData } from "@remix-run/react";
import { Bubble, Globe, MapPin, Phone, StarRatingComponent } from "~/components/ui/components";
import { OpeningHour, PriceLevel, RestaurantForDetail } from "~/entity/Restaurant";
import { formatNumberWithCommas } from "~/utils/utils";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import invariant from "tiny-invariant";
// import { ClientOnly } from "remix-utils/client-only";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
    invariant(params.restaurantId, "Missing restaurantId param");
    const env = context.cloudflare.env;
    try {
        const response = await fetch(`${env.HOST_NAME}/api/restaurants/detail/${params.restaurantId}`);
        if (!response.ok) {
            throw new Response("Not Found", { status: 404 });
        }
        const detail: RestaurantForDetail = await response.json();
        return json({ detail });
    } catch (error) {
        console.error(`Error fetching restaurant detail: ${error}`);
        throw new Response("Error fetching restaurant detail", { status: 400 });
    }
}


export default function RestaurantDetail() {
    const { detail } = useLoaderData<typeof loader>();
    return (
        <div className="max-w-4xl mx-auto bg-[#FFF8F6] shadow-lg rounded-lg overflow-hidden h-screen overflow-y-auto">
            <div className="p-4">
                <div className="flex items-center mb-2">
                    <h1 className="text-2xl font-bold">{detail.displayName}</h1>
                    {detail.priceLevel ?
                        <button className="bg-gray-200 px-3 py-1 ml-4 rounded-full text-sm">{priceLevelConverter(detail.priceLevel)}</button> : null}
                </div>

                <div className="flex items-center mb-2">
                    <StarRatingComponent rating={detail.rating} />
                    <span className="mr-2 font-bold">{detail.rating}</span>
                    <Bubble className="ml-4 w-4 h-4" />
                    <span className="ml-1 text-sm">{formatNumberWithCommas(detail.userRatingCount)}</span>
                </div>

                <div className="flex mb-2">
                    <div>今日の営業時間</div>
                    <div className="font-bold ml-2">{calcTodaysOpeningHour(detail.openingHours)}</div>
                    <div className="font-bold ml-2">{reservableConverter(detail.reservable)}</div>
                </div>

                <div className="flex space-x-4 mb-4">
                    <span>ランチ {detail.purposeLunch ? "○" : "-"}</span>
                    <span>ディナー {detail.purposeDinner ? "○" : "-"}</span>
                    <span>カフェ {detail.purposeCafe ? "○" : "-"}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                    <div className="md:col-span-2 md:row-span-2 aspect-[4/3]">
                        <img src={detail.photoUrls[0]} alt="Main" className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="aspect-[4/3]">
                        <img src={detail.photoUrls[1]} alt="Sub 1" className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="aspect-[4/3]">
                        <img src={detail.photoUrls[2]} alt="Sub 2" className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="aspect-[4/3]">
                        <img src={detail.photoUrls[3]} alt="Sub 3" className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="aspect-[4/3]">
                        <img src={detail.photoUrls[4]} alt="Sub 4" className="w-full h-full object-cover rounded" />
                    </div>
                </div>

                <p className="mb-4">{detail.description}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        {detail.websiteUrl ?
                            <a href={detail.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{detail.websiteUrl}</a> : "掲載なし"}
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        <a href={detail.googleMapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Googleマップで表示</a>
                    </div>
                    <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-2" />
                        <span>{detail.phoneNumber}</span>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-2">最新の口コミ</h2>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-4">
                        <div className="flex justify-between">
                            <span className="font-bold">{detail.reviews[i].authorName}</span>
                            <span className="text-gray-500">{utcToJtcConverter(detail.reviews[i].publishTime)}</span>
                        </div>
                        <p className="text-sm line-clamp-3">{detail.reviews[i].comment}</p>
                    </div>
                ))}

                <div className="flex mb-24">
                    <div className="flex flex-col w-1/2 mr-24">
                        <h2 className="text-xl font-bold mb-2">営業時間</h2>
                        <table className="w-full mb-4">
                            <tbody>
                                {calcOpeningHours(detail.openingHours).map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                        <td className="py-1 px-2">{item.day}</td>
                                        <td className="py-1 px-2">{item.hours}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* <ClientOnly fallback={<div>Loading</div>}>
                        {() => <GoogleMapComponent />}
                    </ClientOnly> */}
                </div>
            </div>
        </div>
    );
};



const priceLevelConverter = (priceLevel?: string) => {
    switch (priceLevel) {
        case PriceLevel.PRICE_LEVEL_UNSPECIFIED:
            return "不明";
        case PriceLevel.PRICE_LEVEL_FREE:
            return "無料";
        case PriceLevel.PRICE_LEVEL_INEXPENSIVE:
            return "安め";
        case PriceLevel.PRICE_LEVEL_MODERATE:
            return "お手頃";
        case PriceLevel.PRICE_LEVEL_EXPENSIVE:
            return "高め";
        case PriceLevel.PRICE_LEVEL_VERY_EXPENSIVE:
            return "高級";
        default:
            return "";
    }
}

const reservableConverter = (reservable?: boolean) => {
    if (reservable == null) {
        return "";
    }
    return reservable ? "予約可" : "予約不可";
}

const calcTodaysOpeningHour = (openingHours: OpeningHour[]) => {
    const today = new Date().getDay();
    const openingHour = openingHours.find((hour) => hour.open.day === today);
    if (!openingHour) {
        return "定休日";
    }
    const padZero = (num: number) => num.toString().padStart(2, '0');
    return `${padZero(openingHour.open.hour)}:${padZero(openingHour.open.minute)} ~ ${padZero(openingHour.close.hour)}:${padZero(openingHour.close.minute)}`;
}

const utcToJtcConverter = (utc: string) => {
    const date = new Date(utc);
    const padZero = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}/${padZero(date.getMonth() + 1)}/${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

const calcOpeningHours = (openingHours: OpeningHour[]) => {
    const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
    return daysOfWeek.map((day, index) => {
        const adjustedIndex = (index + 1) % 7; // Adjust index to start from Monday and end with Sunday
        const openingHour = openingHours.find((hour) => hour.open.day === adjustedIndex);
        if (!openingHour) {
            return {
                day,
                hours: "定休日"
            };
        }
        const padZero = (num: number) => num.toString().padStart(2, '0');
        return {
            day,
            hours: `${padZero(openingHour.open.hour)}:${padZero(openingHour.open.minute)} ~ ${padZero(openingHour.close.hour)}:${padZero(openingHour.close.minute)}`
        };
    });
}
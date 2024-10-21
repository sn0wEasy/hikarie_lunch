import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";


import "./tailwind.css";
import { RestaurantForList } from "./entity/Restaurant";
import { Bubble, StarRatingComponent } from "./components/ui/components";
import { formatNumberWithCommas } from "./utils/utils";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "hikarie-lunch" },
    { name: "description", content: "Welcome to Hikarie lunch" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env;
  try {
    const response = await fetch(`${env.HOST_NAME}/api/restaurants`);
    if (!response.ok) {
      throw new Response("Not Found", { status: 404 });
    }
    const restaurants: RestaurantForList[] = await response.json();
    return json({ restaurants });
  } catch (error) {
    console.error(`Error fetching restaurants: ${error}`);
    return json({ restaurants: [] as RestaurantForList[] });
  }
}

export default function App() {
  const { restaurants } = useLoaderData<typeof loader>();
  const [isDetailPage, setIsDetailFlag] = useState<boolean>(false);

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          {/* PC版 */}
          {RestaurantListForWeb(restaurants)}
          {/* モバイル版 */}
          {RestaurantListForMobile(isDetailPage, setIsDetailFlag, restaurants)}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html >
  );
}

const HeaderForWeb = () => {
  return (
    <div className="h-24 px-4 pt-4 pb-2 bg-gray-800 text-white">
      <NavLink to="/">
        <div className="text-4xl pb-2">Hikarie Workers Lunch</div>
      </NavLink>
      <div className="flex justify-between">
        <div className="text-xs">ヒカリエで働くひとのための、いい感じの飲食店がわかるサイト。</div>
      </div>
    </div>
  );
};

const HeaderForMobile = () => {
  return (
    <div className="h-24 px-4 pt-4 pb-2 bg-gray-800 text-white">
      <NavLink to="/">
        <div className="text-4xl pb-2">Hikarie Workers Lunch</div>
      </NavLink>
      <div className="flex justify-between">
        <div className="text-xs">ヒカリエで働くひとのための、いい感じの飲食店がわかるサイト。</div>
      </div>
    </div>
  );
};

const RestaurantList = ({ restaurants, setIsDetailFlag, className = "" }: { restaurants: RestaurantForList[], setIsDetailFlag?: React.Dispatch<React.SetStateAction<boolean>>, className?: string }) => {
  const [clickedRestaurantId, setClickedRestaurantId] = useState<string>("");

  return (
    <>
      <div className={`${className} px-4 pt-4 pb-2 bg-red-100`}>
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive
                    ? "active"
                    : isPending
                      ? "pending"
                      : ""
                }
                to={`detail/${restaurant.id}`}
              >
                <RestaurantCard restaurant={restaurant} isClicked={clickedRestaurantId === restaurant.id} setClickedRestaurantId={setClickedRestaurantId} setIsDetailFlag={setIsDetailFlag} />
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}


interface RestaurantCardProps {
  restaurant: RestaurantForList;
  isClicked: boolean;
  setClickedRestaurantId: React.Dispatch<React.SetStateAction<string>>;
  setIsDetailFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RestaurantCard = ({ restaurant, isClicked, setClickedRestaurantId, setIsDetailFlag }: RestaurantCardProps) => {

  const handleClick = () => {
    setClickedRestaurantId(restaurant.id);
    if (setIsDetailFlag !== undefined) {
      setIsDetailFlag(true);
    }
  }

  const cardStyle = `${isClicked ? "bg-[#F1E3A8]" : "bg-[#FFF8F6] cursor-pointer"} p-4 mb-2 rounded-lg shadow-md border border-black" : "p-4 mb-2 rounded-lg shadow-md border border-black"`;

  return (
    <div className={cardStyle} onClick={handleClick}>
      <div className="flex items-start space-x-4">
        <img src={restaurant.thumbnailPhotoUrl} alt="Restaurant" className="w-36 h-36 object-cover rounded aspect-square" />
        <div className="flex flex-1 flex-col">
          <div className="text-base font-bold">{restaurant.displayName}</div>
          <div className="flex items-center mb-3">
            <StarRatingComponent rating={restaurant.rating} />
            <span className="ml-1 text-base font-bold">{restaurant.rating}</span>
            <Bubble className="ml-4 w-4 h-4" />
            <span className="ml-1 text-sm">{formatNumberWithCommas(restaurant.userRatingCount)}</span>
          </div>
          <div className="flex space-x-2 text-sm mb-2">
            <span>ランチ {restaurant.purposeLunch ? "○" : "-"}</span>
            <span>ディナー {restaurant.purposeDinner ? "○" : "-"}</span>
            <span>カフェ {restaurant.purposeCafe ? "○" : "-"}</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['月', '火', '水', '木', '金', '土', '日'].map(day => (
                  <th key={day} className="py-1 px-2 text-center border border-black">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {restaurant.openingDays != undefined ? Object.values(restaurant.openingDays).map((flag, idx) => (
                  <td key={idx} className="py-1 px-2 text-center border border-black">
                    {flag ? '○' : '-'}
                  </td>
                )) : ['-', '-', '-', '-', '-', '-', '-'].map((day, idx) => (
                  <td key={idx} className="py-1 px-2 text-center border border-black">
                    {day}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function RestaurantListForMobile(isDetailPage: boolean, setIsDetailFlag: React.Dispatch<React.SetStateAction<boolean>>, restaurants: ({ readonly id: string; readonly placeId: string; readonly displayName: string; readonly thumbnailPhotoUrl: string; readonly rating: number; readonly userRatingCount: number; readonly purposeLunch: boolean; readonly purposeDinner: boolean; readonly purposeCafe: boolean; readonly openingDays: { readonly monday: boolean; readonly tuesday: boolean; readonly wednesday: boolean; readonly thursday: boolean; readonly friday: boolean; readonly saturday: boolean; readonly sunday: boolean; } & {}; } & {})[]) {
  return (
    <>
      <div className="block xl:hidden">
        <HeaderForMobile />
        <div className="flex flex-1 flex-col">
          {isDetailPage ? (
            <>
              <div className="py-2 bg-blue-100">
                <button onClick={() => setIsDetailFlag(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="w-full h-[calc(100vh-6rem)] px-4 pb-4 bg-blue-100">
                <Outlet />
              </div>
            </>
          ) : (
            <RestaurantList restaurants={restaurants} setIsDetailFlag={setIsDetailFlag} className="w-full h-[calc(100vh-6rem)]" />
          )}
        </div>
      </div>
    </>);
}

function RestaurantListForWeb(restaurants: ({ readonly id: string; readonly placeId: string; readonly displayName: string; readonly thumbnailPhotoUrl: string; readonly rating: number; readonly userRatingCount: number; readonly purposeLunch: boolean; readonly purposeDinner: boolean; readonly purposeCafe: boolean; readonly openingDays: { readonly monday: boolean; readonly tuesday: boolean; readonly wednesday: boolean; readonly thursday: boolean; readonly friday: boolean; readonly saturday: boolean; readonly sunday: boolean; } & {}; } & {})[]) {
  return <div className="hidden xl:block">
    <HeaderForWeb />
    <div className="flex flex-1">
      <RestaurantList restaurants={restaurants} className="hidden xl:block xl:w-1/3 h-[calc(100vh-6rem)] overflow-y-auto" />
      <div className="w-full xl:w-2/3 h-[calc(100vh-6rem)] px-4 py-4 bg-blue-100 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  </div>;
}


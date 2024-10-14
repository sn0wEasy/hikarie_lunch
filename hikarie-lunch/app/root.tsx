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
          <Header />
          <div className="flex flex-1">
            <RestaurantList restaurants={restaurants} className="hidden xl:block xl:w-1/3 h-[calc(100vh-6rem)] overflow-y-auto" />
            <div className="w-full xl:w-2/3 h-[calc(100vh-6rem)] px-4 py-4 bg-blue-100 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <div className="h-24 px-4 pt-4 pb-2 bg-gray-800 text-white">
      <NavLink to="/">
        <div className="text-4xl pb-2">Hikarie Workers Lunch</div>
      </NavLink>
      <div className="flex justify-between">
        <div className="text-xs">ヒカリエで働くひとのための、いい感じの飲食店がわかるサイト。</div>
        {/* <div className="text-xs">このサービスについて</div> */}
      </div>
    </div>
  );
};

const RestaurantList = ({ restaurants, className = "" }: { restaurants: RestaurantForList[], className?: string }) => {
  const [clickedRestaurantId, setClickedRestaurantId] = useState<string>("");

  return (
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
              <RestaurantCard restaurant={restaurant} isClicked={clickedRestaurantId === restaurant.id} setClickedRestaurantId={setClickedRestaurantId} />
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}


interface RestaurantCardProps {
  restaurant: RestaurantForList;
  isClicked: boolean;
  setClickedRestaurantId: React.Dispatch<React.SetStateAction<string>>;
}

const RestaurantCard = ({ restaurant, isClicked, setClickedRestaurantId }: RestaurantCardProps) => {

  const handleClick = () => {
    setClickedRestaurantId(restaurant.id);
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


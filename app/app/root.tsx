import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, type MetaFunction } from "@remix-run/node";


import "./tailwind.css";
import { RestaurantForList } from "./entity/Restaurant";
import { Bubble, StarRatingComponent } from "./components/ui/components";
import { formatNumberWithCommas } from "./utils/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "hikarie-lunch" },
    { name: "description", content: "Welcome to Hikarie lunch" },
  ];
};

export const loader = async () => {
  const response = await fetch("http://localhost:3001/api/restaurants");
  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }
  const restaurants: RestaurantForList[] = await response.json();
  return json({ restaurants });
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
        <div className="flex flex-col">
          <Header />
          <div className="flex justify-between">
            <RestaurantList restaurants={restaurants} />
            <div className="w-2/3 h-screen px-4 pt-4 bg-blue-100">
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
    <div className="px-4 pt-4 pb-2 bg-gray-800 text-white">
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

const RestaurantList = ({ restaurants }: { restaurants: RestaurantForList[] }) => {
  return (
    <div className="w-1/3 h-screen px-4 pt-4 pb-2 bg-red-100  h-screen overflow-y-auto">
      <div className="text-2xl pb-2">飲食店一覧</div>
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
              <RestaurantCard restaurant={restaurant} />
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}


const RestaurantCard = ({ restaurant }: { restaurant: RestaurantForList }) => {
  return (
    <div className="bg-[#FFF8F6] p-4 mb-2 rounded-lg shadow-md border border-black">
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


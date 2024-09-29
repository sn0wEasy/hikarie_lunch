import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useHydrated } from 'remix-utils/use-hydrated';
import 'dotenv/config';

export function GoogleMapComponent() {
    const isHydrated = useHydrated();

    if (!isHydrated) {
        return <div>Loading map...</div>; // または代替のSSRコンポーネント
    }

    console.log(process.env.GOOGLE_MAPS_API_KEY);

    return (
        <div>GoogleMapComponent</div>
        // <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY ?? ""}>
        //     <Map
        //         defaultCenter={{ lat: 35.6812362, lng: 139.7671248 }}
        //         defaultZoom={14}
        //     />
        // </APIProvider>
    );
}
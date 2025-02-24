import { getRegionById } from "../fetchData";

export default async function RegionPage({ params }) {
    const { regionId } = await params;
    const region = await getRegionById(regionId);

    const { name, information, obs } = region[0];

    return (
        <div>
            REGION
            <h2>{name}</h2>
            <p>{information}</p>
            <p>{obs}</p>
        </div>
    );
}

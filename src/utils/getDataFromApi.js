import { API_URL } from "variables";

export const getDataFromApi = async (search) => {
    const res = await fetch(`${API_URL}/api/${search}`);
    const data = await res.json();
    return data;
};
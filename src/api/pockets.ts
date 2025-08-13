import api from "../config";

export const getPocketsBalance = async (
  userId?: number | null,
  groupId?: number | null,
  pocketId?: number | null,
  start_date?: string | null,
  end_date?: string | null
): Promise<number> => {
    const basePath = groupId ? `/${groupId}` : `/${userId}`;

    const queryParams = [
      pocketId !== null && pocketId !== undefined ?
        `pocket_id=${pocketId}` :
        "",
      start_date ? `from=${start_date}` : "",
      end_date ? `to=${end_date}` : ""
    ]
      .filter(Boolean)
      .join("&");

    const queryString = queryParams ? `?${queryParams}` : "";
    const response = await api.get(`${basePath}/pockets/balance${queryString}`);

   return response.data.balance;

};
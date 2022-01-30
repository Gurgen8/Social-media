import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);

export async function searchGifs(searchKeyword, limit, offset) {
  return await gf.search(searchKeyword, {
    sort: "relevant",
    limit,
    offset
  });
}

import { api } from "./api.js";

async function requestHandler(fn, param) {
  let response = await fn(param);
  let data = await response.json();

  if (!response.ok && data.type !== "TokenExpiredError") {
    throw data;
  }

  if (data.type === "TokenExpiredError") {
    // Try to renew tokens
    response = await api.renewTokens();
    data = await response.json();

    if (!response.ok) throw data;
    if (data.type === "TokenExpiredError") {
      throw { message: "Login is required", type: "LoginRequiredError" };
    }

    // Retry original request
    response = await fn(param);
    data = await response.json();

    if (!response.ok) throw data;
    return data;
  }

  return data;
}

export default requestHandler;
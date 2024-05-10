import { queryOptions } from "@tanstack/react-query";

async function getIncomingRequests() {
  return fetch("/api/get-incoming-requests").then((res) =>
    res.json(),
  ) as Promise<{ count: number }>;
}

export const getIncomingRequestsQuery = queryOptions({
  queryKey: ["incoming-requests"],
  queryFn: getIncomingRequests,
});

import { useQuery } from "react-query";
import { getTableAll } from "../../api/api";
import { ALL_TABLES_KEY } from "../queryKeys/queryKeys";

const useTablesQuery = () => {
  const { data: tablesData, isLoading } = useQuery({
    queryFn: getTableAll,
    queryKey: ALL_TABLES_KEY,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return { tablesData, isLoading };
};

export { useTablesQuery };
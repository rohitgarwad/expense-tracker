import { useLocalStorage } from "./useLocalStorage";

export function useFilter(dataList, callback) {
    const [query, setQuery] = useLocalStorage('query', '')

    const filteredData = dataList.filter((data) => callback(data).includes(query))

    return [filteredData, query, setQuery]
}
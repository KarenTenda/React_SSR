import { useState } from "react";

interface SortOptions {
    key: string;
    label: string;
}

interface UseSearchAndSortProps<T> {
    items: T[];
    searchKeys: (keyof T)[];
    initialSortKey: keyof T;
    sortOptions: SortOptions[];
}

const useNavbarComponents = <T extends object>({
    items,
    searchKeys,
    initialSortKey,
    sortOptions,
}: UseSearchAndSortProps<T>) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<keyof T>(initialSortKey);
    const [sortOrder, setSortOrder] = useState<"ascending" | "descending">("ascending");

    // Filtered and Sorted Items
    const filteredAndSortedItems = items
        .filter((item) =>
            searchKeys.some((key) =>
                String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .sort((a, b) => {
            let comparison = 0;

            if (typeof a[sortKey] === "string" && typeof b[sortKey] === "string") {
                comparison = (a[sortKey] as string).localeCompare(b[sortKey] as string);
            } else if (typeof a[sortKey] === "number" && typeof b[sortKey] === "number") {
                comparison = (a[sortKey] as number) - (b[sortKey] as number);
            }

            return sortOrder === "ascending" ? comparison : -comparison;
        });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleSortChange = (key: keyof T) => {
        setSortKey(key);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) =>
            prevOrder === "ascending" ? "descending" : "ascending"
        );
    };

    return {
        filteredAndSortedItems,
        searchQuery,
        sortKey,
        sortOrder,
        sortOptions,
        handleSearch,
        handleSortChange,
        toggleSortOrder,
    };
};

export default useNavbarComponents;

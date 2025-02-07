'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ClickableIconButton from "../custom/buttons/ClickableIconButton";
import { ascendingIcon, descendingIcon } from "@/public/assets/Icons";

interface SortOption<T> {
    key: keyof T; // Sort key must be a property of T
    label: string; // Label displayed in the dropdown
}

interface NavbarProps<T> {
    pageName: string;
    searchPlaceholder: string;
    sortOption: keyof T;
    sortOptions: SortOption<T>[];
    onSortChange: (key: keyof T) => void;
    onAddClick?: () => void;
    addButtonText?: string;
    isAddButtonDisabled?: boolean;
    onSearch?: (query: string) => void;
    sortOrder: 'ascending' | 'descending';
    onSortOrderChange?: () => void;
}

const Navbar = <T extends object>({
    pageName,
    searchPlaceholder,
    sortOption,
    sortOptions,
    onSearch,
    onSortChange,
    onSortOrderChange,
    sortOrder,
    onAddClick,
    addButtonText,
    isAddButtonDisabled,
}: NavbarProps<T>) => {
    // const [currentSortOption, setCurrentSortOption] = useState(sortOption);

    // const handleSortChange = (option: string) => {
    //     setCurrentSortOption(option);
    //     if (onSortChange) {
    //         onSortChange(option);
    //     }
    // };
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col w-full relative">
                <div className="inline-flex relative w-full h-auto gap-3 flex-row items-center justify-between px-3 md:px-5">
                    <h1 className="!m-0 font-medium text-xl text-gray-700 dark:text-gray-300">{pageName}</h1>
                </div>
            </div>

            <div className="flex w-full flex-row gap-2 px-3 md:px-5 items-start lg:items-center justify-between">

                <div className="dont-diff flex flex-row flex-wrap items-center justify-start gap-2 lg:justify-end lg:gap-3">
                    <div className="relative w-full sm:w-36 lg:w-60">
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="relative w-full sm:w-36 lg:w-60"
                            onChange={(e) => onSearch && onSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row flex-nowrap gap-1">
                        <select
                            value={String(sortOption)} // Convert sortOption to string for dropdown
                            onChange={(e) => onSortChange(e.target.value as keyof T)} // Cast to keyof T
                            className="border rounded px-3 py-2"
                        >
                            {sortOptions.map((option) => (
                                <option key={String(option.key)} value={String(option.key)}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ClickableIconButton
                        Icon={sortOrder === 'ascending' ? ascendingIcon : descendingIcon}
                        onClick={onSortOrderChange}
                        tooltipText={sortOrder === 'ascending' ? 'Sort Descending' : 'Sort Ascending'}
                        disabled={false}
                    />

                </div>


                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={onAddClick}
                        disabled = {!isAddButtonDisabled || false} 
                    className="bg-[#FA8072] text-white"
                    >
                        + {addButtonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

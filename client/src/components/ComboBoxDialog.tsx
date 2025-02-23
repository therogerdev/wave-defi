"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface ComboBoxDialogProps {
  title?: string;
  description?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

export function ComboBoxDialog({
  title = "Select Option",
  description = "Choose an item from the list",
  options,
  placeholder = "Search...",
  defaultValue = "",
  onSelect,
}: ComboBoxDialogProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue === value ? "" : selectedValue);
    if (onSelect) {
      onSelect(selectedValue);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative flex h-[66px] w-[350px] rounded-full bg-[#232323] px-[28px]">
            <div className="flex justify-center items-center hover:cursor-pointer hover:border-accent hover:bg-accent hover:opacity-60 bg-transparent absolute h-16 z-50 w-20 hover:rounded-tr-full hover:rounded-br-full right-0">
              <PlusIcon className="h-5 w-5 text-white" />
            </div>
            <div
              className="flex relative flex-1 flex-row-reverse items-center gap-5 cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <span className="text-left w-full text-white">
                {value ? options.find((opt) => opt.value === value)?.label : "Select Option"}
              </span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] h-[600px] rounded-lg lg:rounded-3xl bg-white dark:bg-[#232323] border-none">
          <DialogHeader className="-mb-20 h-full">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Command className="bg-white dark:bg-[#232323] ">
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup className="bg-white dark:bg-[#232323] min-h-64">
                {options.map((option) => (
                  <CommandItem
                    className="h-12 hover:cursor-pointer hover:rounded-full px-4"
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                    <CheckIcon
                      className={cn("ml-auto", value === option.value ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter>
            <Button className="bg-accent" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// components/product/mobile-filter-drawer.tsx
"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterSidebar } from "./filter-sidebar";

export function MobileFilterDrawer() {
  return (
    <div className="lg:hidden w-full mb-6">
      <Sheet>
        <SheetTrigger className="w-full border border-ink-200 p-4 flex items-center justify-between uppercase tracking-widest text-sm font-medium hover:bg-ink-50 transition-colors">
          <span>Filter Products</span>
          <Filter className="w-4 h-4" />
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[80vh] overflow-y-auto rounded-t-2xl"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-left font-serif text-2xl">
              Filters
            </SheetTitle>
          </SheetHeader>
          <FilterSidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}

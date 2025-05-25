"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { UseCase } from "@/utils/textProcessing"; // Make sure UseCase still excludes 'technical'
import { ChevronDown, Settings } from "lucide-react"
import { useEffect, useState } from "react"; // Added React and useEffect

interface ContentTypeSelectorProps {
  useCase: UseCase
  customPrompt: string
  onUseCaseChange: (useCase: UseCase, customPrompt?: string) => void
  isMobile: boolean // isMobile is kept but v0 design doesn't explicitly use it for this component
}

// Adjusted v0 options to exclude 'technical' and match existing UseCase type
const useCaseOptions = [
  { value: "professional" as UseCase, label: "Professional/CV", description: "Business documents, resumes" },
  { value: "academic" as UseCase, label: "Academic", description: "Research papers, essays" },
  { value: "creative" as UseCase, label: "Creative", description: "Stories, blogs, creative writing" },
  { value: "casual" as UseCase, label: "Casual", description: "Social media, informal text" },
  // { value: "technical" as UseCase, label: "Technical", description: "Documentation, manuals" }, // Kept excluded
  { value: "custom" as UseCase, label: "Custom", description: "Define your own style" },
]

export default function ContentTypeSelector({
  useCase,
  customPrompt,
  onUseCaseChange,
  isMobile, // Kept in props
}: ContentTypeSelectorProps) {
  const [tempCustomPrompt, setTempCustomPrompt] = useState(customPrompt)
  const [isCustomOpen, setIsCustomOpen] = useState(false)

  // Sync tempCustomPrompt if the prop changes from outside
  useEffect(() => {
    setTempCustomPrompt(customPrompt || '');
  }, [customPrompt]);

  const currentOption = useCaseOptions.find((option) => option.value === useCase)

  const handleUseCaseSelect = (newUseCase: UseCase) => {
    if (newUseCase === "custom") {
      // If custom is already selected and popover is open, this click might be to close it via outside click
      // or if it's to open, ensure temp prompt is current
      if(useCase === "custom") {
        setTempCustomPrompt(customPrompt);
      }
      setIsCustomOpen(true)
    } else {
      onUseCaseChange(newUseCase)
      setIsCustomOpen(false) // Close custom popover if another type is selected
    }
  }

  const handleCustomSubmit = () => {
    onUseCaseChange("custom", tempCustomPrompt)
    setIsCustomOpen(false)
  }
  
  const handleCustomCancel = () => {
    setTempCustomPrompt(customPrompt); // Reset to original custom prompt on cancel
    setIsCustomOpen(false);
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[140px] justify-between">
            {currentOption?.label || "Select Type"} {/* Fallback text */}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Content Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {useCaseOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleUseCaseSelect(option.value)}
              className="flex flex-col items-start gap-1 p-3 cursor-pointer" // Added cursor-pointer
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Popover - only triggerable if useCase is already custom OR if custom is selected from dropdown */}
      {(useCase === "custom" || isCustomOpen) && (
        <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
          <PopoverTrigger asChild>
            {/* This button is more of a visual indicator when custom is selected; popover opens via Dropdown or if already custom */}
            <Button variant="outline" size="icon" disabled={useCase !== 'custom' && !isCustomOpen} className={useCase === 'custom' ? 'ring-2 ring-blue-500' : ''}>
              <Settings className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-prompt">Custom Instructions</Label>
                <Input
                  id="custom-prompt"
                  placeholder="e.g., Make it sound like a teenager..."
                  value={tempCustomPrompt}
                  onChange={(e) => setTempCustomPrompt(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCustomSubmit} size="sm" className="flex-1">
                  Apply
                </Button>
                <Button variant="outline" onClick={handleCustomCancel} size="sm" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
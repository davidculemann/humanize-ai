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
import type { UseCase } from "@/utils/textProcessing"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

interface ContentTypeSelectorProps {
  useCase: UseCase
  customPrompt: string
  onUseCaseChange: (useCase: UseCase, customPrompt?: string) => void
  isMobile: boolean
}

const useCaseOptions = [
  { value: "professional" as UseCase, label: "Professional/CV", description: "Business documents, resumes" },
  { value: "academic" as UseCase, label: "Academic", description: "Research papers, essays" },
  { value: "creative" as UseCase, label: "Creative", description: "Stories, blogs, creative writing" },
  { value: "casual" as UseCase, label: "Casual", description: "Social media, informal text" },
  { value: "custom" as UseCase, label: "Custom", description: "Define your own style" },
]

export default function ContentTypeSelector({
  useCase,
  customPrompt,
  onUseCaseChange,
  isMobile,
}: ContentTypeSelectorProps) {
  const [tempCustomPrompt, setTempCustomPrompt] = useState(customPrompt)

  useEffect(() => {
    setTempCustomPrompt(customPrompt || '');
  }, [customPrompt]);

  const currentOption = useCaseOptions.find((option) => option.value === useCase)

  const handleUseCaseSelect = (newUseCase: UseCase) => {
    if (newUseCase === "custom") {
      onUseCaseChange("custom", customPrompt);
    } else {
      onUseCaseChange(newUseCase);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto min-w-[160px] justify-between">
            {currentOption?.label || "Select Type"}
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
              className="flex flex-col items-start gap-1 p-3 cursor-pointer"
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {useCase === "custom" && (
        <div className="w-full sm:flex-grow mt-2 sm:mt-0">
          <Input
            type="text"
            placeholder="Describe your custom style..."
            value={tempCustomPrompt}
            onChange={(e) => {
              setTempCustomPrompt(e.target.value);
              onUseCaseChange("custom", e.target.value);
            }}
            className="w-full sm:w-[244px]"
          />
        </div>
      )}
    </div>
  )
}
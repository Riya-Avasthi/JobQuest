"use client";
import React from "react";
import { useGlobalContext } from "@/context/globalContext";
import { Separator } from "@/Components/ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

function JobTitle() {
  const { jobTitle, handleTitleChange, activeEmploymentTypes, setActiveEmploymentTypes } = useGlobalContext();

  const employmentTypes = ["Full Time", "Part Time", "Contract", "Internship"];

  const handleEmploymentTypeChange = (type) => {
    if (activeEmploymentTypes.includes(type)) {
      setActiveEmploymentTypes(
        activeEmploymentTypes.filter((t) => t !== type)
      );
    } else {
      setActiveEmploymentTypes([...activeEmploymentTypes, type]);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Job Title</h3>
          <Label
            htmlFor="jobTitle"
            className="text-sm text-muted-foreground mt-2"
          >
            A job title is a specific designation of a post in an organization.
          </Label>
        </div>
        <Input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={handleTitleChange}
          className="flex-1 w-full mt-2"
          placeholder="Enter Job Title"
        />
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Employment Type</h3>
          <Label
            htmlFor="employmentType"
            className="text-sm text-muted-foreground mt-2"
          >
            Select the type of employment.
          </Label>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {employmentTypes.map((type) => (
            <div
              key={type}
              className="flex items-center space-x-2 border border-input rounded-md p-2"
            >
              <Checkbox
                id={type}
                checked={activeEmploymentTypes.includes(type)}
                onCheckedChange={() => handleEmploymentTypeChange(type)}
              />
              <Label
                htmlFor={type}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobTitle;
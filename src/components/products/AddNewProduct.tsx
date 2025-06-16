"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
// import { ChevronLeftIcon } from "@/icons";
// import Link from "next/link";
import React, { } from "react";
// import DropzoneComponent from "../form/form-elements/DropZone";
import TextArea from "../form/input/TextArea";
// import SelectInputs from "../form/form-elements/SelectInputs";
// import React from "react";
// import CheckboxComponents from "@/components/form/form-elements/CheckboxComponents";
// import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
// import FileInputExample from "@/components/form/form-elements/FileInputExample";
// import InputGroup from "@/components/form/form-elements/InputGroup";
// import InputStates from "@/components/form/form-elements/InputStates";
// import RadioButtons from "@/components/form/form-elements/RadioButtons";
// import SelectInputs from "@/components/form/form-elements/SelectInputs";
// import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
// import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import ChipInput from "../form/input/ChipInput";
import Select from "../form/Select";
// import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";

export default function AddNewProduct() {
     const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
    return (
        <div className="flex flex-col flex-1 lg:w-11/12 w-full overflow-y-auto no-scrollbar mx-auto justify-center items-center">
            <div className="flex flex-col justify-center flex-1 w-full  mx-auto bg-white p-2">
                <div>
                    <h1 className="text-center uppercase ">Add a product</h1>
                    <div>
                        <div className="relative py-3 sm:py-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                            </div>
                        </div>
                        <form>
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="">
                                        <Label>
                                            Product Name<span className="text-error-500">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="categoryName"
                                            name="categoryName"
                                            placeholder="Enter your category name"
                                        />
                                    </div>
                                   
                                   

                <div className="relative">
  <Select
    options={options}
    placeholder="Select Option"
    // onChange={handleSelectChange}
    className="dark:bg-dark-900 appearance-none pr-10"
  />
  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
    <ChevronDownIcon className="w-4 h-4" />
  </span>
</div>


                                    <div>
                                        <Label>
                                            Description<span className="text-error-500">*</span>
                                        </Label>
                                        <TextArea
                                            id="categoryName"
                                            name="categoryName"
                                            placeholder="Enter your category name"
                                        />
                                    </div>
                                    {/* <InputStates /> */}
                                </div>
                                <div className="space-y-6">
                                    {/* <InputGroup /> */}

                                    <div className="gap-2 grid grid-cols-1 xl:grid-cols-3  p-2  sm:grid-cols-1">

                                        <div className="">
                                            <Label>
                                                Orignal Price<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                id="categoryName"
                                                name="categoryName"
                                                placeholder="Enter OrignalPrice"
                                            />
                                        </div>
                                        <div className="">
                                            <Label>
                                                Offer in Percetage<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                id="categoryName"
                                                name="categoryName"
                                                placeholder="Enter offer"
                                            />
                                        </div>
                                        <div className="">
                                            <Label>
                                                Price<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                id="categoryName"
                                                name="categoryName"
                                                placeholder="Enter Price"
                                            />
                                        </div>
                                        <div className="">
                                            <Label>
                                                Quantity<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                id="categoryName"
                                                name="categoryName"
                                                placeholder="Product quantity"
                                            />
                                        </div>
                                    </div>

                                    <ChipInput
                                        id="keywords"
                                        label="Keywords"
                                        placeholder="e.g. adc x, bfd x"
                                        onChange={(chips) => console.log("Chips:", chips)}
                                    />


                                    {/* <FileInputExample /> */}
                                    {/* <CheckboxComponents />
                                    <RadioButtons />
                                    <ToggleSwitch /> */}
                                    <DropzoneComponent />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button className="flex items-center mt-4 justify-center w-auto px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                                    Sumbit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}



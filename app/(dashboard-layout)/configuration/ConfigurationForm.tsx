"use client";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage,useZodForm } from "@/components/ui/form";
import { ConfigurationFormType } from "./configuration.schema";
import { ConfigurationsSchema } from "./configuration.schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { enqueueDialog } from "@/features/dialogs-provider/DialogProvider";
import { Label } from "@radix-ui/react-label";
import { config } from "process";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { ConfigurationType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { SubmitButton } from "@/features/form/SubmitButton";

export type ConfigurationFormProps = {
    configurations : ConfigurationFormType[];
}

export const ConfigurationForm = (props: ConfigurationFormProps) => {
    const form = useZodForm({
        schema: z.object({
            configurations: ConfigurationsSchema,
        }) ,
        defaultValues:{
            configurations: props.configurations
        } 
    });

    const handleSubmit = useMutation({
        mutationFn: async(values: ConfigurationFormType[])=>{}
    })
    return <Form form={form}
        className="flex flex-col gap-8"
    onSubmit={async(v)=>handleSubmit.mutateAsync(v.configurations)}>
        <div className="flex flex-col gap-6">
            {form.watch("configurations").map((config, index) => (
                <fieldset key={index}
                className="relative flex flex-col gap-4 p-4 border boder-border rounded-lg shadow-md">

                    <legend className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Configutation {index}</h3>
                        <Button type="button" className="size-6 p-0 bg-warning" variant="ghost" 
                        onClick={()=>{
                            enqueueDialog({
                                title: "Delete Configuration",
                                description: "Are you sure you want to delete this configuration?",
                                action: {
                                    label: "Delete",
                                    onClick:() =>{
                                        const filteredConfiguration = form.watch("configurations").filter((_, i) => i !== index);
                                        form.setValue("configurations",filteredConfiguration);
                                    }
                                }
                            })
                        }}>
                            <Trash2 />
                        </Button>
                    </legend>

                    <div className="flex items-start gap-2">
                        <FormField
                            control={form.control}
                            name={`configurations.${index}.type`}
                            render={({ field }) => (
                                <FormItem className="w-[200px]">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                <FormField
                            control={form.control}
                            name={`configurations.${index}.type`}
                            render={({ field }) => (
                                <FormItem className="w-[200px]">
                                    <FormLabel>Data type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Data type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {Object.keys(ConfigurationType).map(type =>{
                        const textMapping : Record<string, string> = {
                            "STRING": "Text",
                            "NUMBER": "Number",
                            "BOOLEAN": "True/False",
                        }
                    
                        return(
                        
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                            );
                            })}
                </SelectContent>
              </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

<FormField
                            control={form.control}
                            name={`configurations.${index}.description`}
                            render={({ field }) => (
                                <FormItem className="w-[200px]">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button size="sm" variant={"ghost"} onClick={() =>{
                        form.setValue("configurations", [
                            ...form.watch("configurations"),
                            {
                                name: "",
                                type: ConfigurationType.STRING,
                                description: "",
                            }
                        ])
                    }}>
                        <Plus size={16} className="ml-2"/>
                        Add Configuration
                        
                    </Button>

                    <SubmitButton className="w-full" size="sm">
                        Save
                    </SubmitButton>
                </fieldset>
            ))}
        </div>

    </Form>
}
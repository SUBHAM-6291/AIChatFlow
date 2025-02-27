"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { verifySchema } from "@/Schema/Verify.Schema";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ApiResponse } from "@/Types/ApiResponse";
import axios from "axios";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      console.log({
        title: "Success",
        description: response.data.message || "Verification successful",
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verification of user:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Verification failed";

      console.error({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-black rounded-xl shadow-2xl border border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Verify Your Account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Username: <span className="font-medium text-gray-200">{params.username || "No username provided"}</span>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="code"
                      type="text"
                      placeholder="Enter code"
                      className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
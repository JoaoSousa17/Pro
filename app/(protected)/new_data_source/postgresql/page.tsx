"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { insertConnection } from "./actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PostgreSQLConnectionForm() {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      type:"postgresql",
      host: "",
      port: "5432",
      name: "",
      username: "",
      password: "",
    },
  });

  const {
    control,
    formState: { errors },
  } = form;

  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const onSubmit = (values: any) => {
    setError("");
    setSuccess(false);

    startTransition(async () => {
      const result = await insertConnection(values);
      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error || "Failed to create connection");
      }
    });
  };

  return (
    // Flex container to center the card in the screen
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">PostgreSQL Connection</CardTitle>
          <CardDescription>
            Provide your server details to connect to PostgreSQL.
          </CardDescription>
        </CardHeader>

        {/* Spread the entire form object so child components have access */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Host Name / Server Address */}
              <FormField
                control={control}
                name="host"
                rules={{ required: "Host is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host Name / Server Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. localhost or 192.168.1.1"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the address of your PostgreSQL server.
                    </FormDescription>
                    <FormMessage>{errors.host?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Port */}
              <FormField
                control={control}
                name="port"
                rules={{ required: "Port is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder="5432" {...field} />
                    </FormControl>
                    <FormDescription>
                      Default PostgreSQL port is 5432.
                    </FormDescription>
                    <FormMessage>{errors.port?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Database Name */}
              <FormField
                control={control}
                name="name"
                rules={{ required: "Database name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Database Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. my_database" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of your PostgreSQL database.
                    </FormDescription>
                    <FormMessage>{errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={control}
                name="username"
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="postgres" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your PostgreSQL username.
                    </FormDescription>
                    <FormMessage>{errors.username?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your PostgreSQL password.
                    </FormDescription>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-red-600 font-medium text-sm mt-2">{error}</p>
              )}
              {success && (
                <p className="text-green-600 font-medium text-sm mt-2">
                  Connection saved!
                </p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col items-center mt-6">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Connecting..." : "Connect"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

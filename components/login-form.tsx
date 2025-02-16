"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { useToast } from "@/hooks/use-toast";
import { api } from "@/app/api";
import { setCookie } from "cookies-next";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { toast } = useToast();

  const login = async () => {
    try {
      const response = await api.post("/user/login", { email, password });
      console.log(response.data);
      setCookie("token", response.data, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast({
        description: "Connexion réussie",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      });
      window.location.href = "";
    } catch (error) {
      console.error(error)
      toast({
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login();
  }

  return (
      <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Connectez-vous à votre compte</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Entrez votre email ci-dessous pour vous connecter à votre compte
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email"
                   name="email"
                   id="email"
                   placeholder="example@example.com"
                   value={email}
                   onChange={(e) => setemail(e.target.value)}
                   required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input type="password"
                   name="password"
                   id="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setpassword(e.target.value)}
                   required />
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </div>
      </form>
  )
}
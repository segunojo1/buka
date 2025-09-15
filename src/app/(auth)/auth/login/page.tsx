"use client";

import { Input } from "@/components/ui/input";
import authService from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authService.login(form);
      toast("Login successful!");

      console.log(response);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="font-ojuju text-4xl font-bold tracking-tight text-buka-black">
          Welcome Back!
        </h2>
        <p className="mt-2 text-sm">
          Login to continue your journey.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          required
        /> 
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          required
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
          disabled={loading}
          className="disabled:bg-[#434242]"
        >
          {loading ? "Loading...": "Login"}
        </button>
      </form> 
      <p className="text-sm mt-5 ">Dont have an account? <Link href="/auth/register" className="underline ">Sign up</Link></p>
    </div>
  );
};

export default Login;

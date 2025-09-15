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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(form);
      toast("Login successful!");

      console.log(response);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "2px solid #5f5d5d",
        borderRadius: 8,
        color: "#000"
      }}
    >
      <h2 style={{ marginBottom: 24 }} className="text-black font-bold">Login</h2>
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
        >
          Login
        </button>
      </form> 
      <p className="text-xl mt-5 ">Dont have an account? <Link href="/register" className="">Sign up</Link></p>
    </div>
  );
};

export default Login;

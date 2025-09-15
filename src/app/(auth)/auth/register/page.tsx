"use client";

import { Input } from "@/components/ui/input";
import authService from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    preferredLanguage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.register(form);
      toast("Signup successful!");
      console.log(response);
      router.push("/");
    } catch (error) {
      console.log(error);
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
          name="firstName"
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          required
        />
        <Input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          required
        />
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
        <Input
          name="phoneNumber"
          type="tel"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        <Input
          name="preferredLanguage"
          type="text"
          placeholder="Preferred Language"
          value={form.preferredLanguage}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
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
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
      <p className="text-sm font-medium transition-colors mt-5">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;

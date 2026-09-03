"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserById, updateUserById } from "@/services/authService";

export default function EditUserPage() {

  const params = useParams();
  const router = useRouter();

//   const id = params.id;

  const id = params.id as string;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const loadUser = async () => {

      const res = await fetchUserById(id);

      setUser(res.user || res);

    };

    loadUser();

  }, [id]);

  const handleChange = (e:any) => {

    const { name, value } = e.target;

    setUser((prev:any) => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    await updateUserById(user,"");

    router.push(`/users/${id}`);

  };

  if (!user) return <p>Loading...</p>;

  return (

    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-xl font-semibold mb-4">
        Edit User
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          value={user.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="email"
          value={user.email}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="phone_number"
          value={user.phone_number}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>

      </form>

    </div>

  );

}
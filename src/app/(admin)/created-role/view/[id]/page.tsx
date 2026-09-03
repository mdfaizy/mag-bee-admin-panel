"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiConnector } from "@/services/apiConnector";

export default function ViewRolePage() {

  const params = useParams<{ id: string }>();
  const id = params.id;

  const [role, setRole] = useState<any>(null);

  useEffect(() => {

    const loadRole = async () => {

      const res = await apiConnector("GET", `/role/${id}`);

      setRole(res.data);

    };

    loadRole();

  }, [id]);

  if (!role) return <p>Loading...</p>;

  return (

    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        Role Details
      </h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">

        <p className="text-lg font-semibold">{role.name}</p>
        <p className="text-gray-500">{role.description}</p>

      </div>

      <div className="bg-white shadow rounded-lg p-6">

        <h2 className="font-semibold mb-4">
          Privileges
        </h2>

        <div className="flex flex-wrap gap-2">

          {role.privileges.map((p:any) => (

            <span
              key={p.id}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
            >
              {p.name}
            </span>

          ))}

        </div>

      </div>

    </div>

  );

}
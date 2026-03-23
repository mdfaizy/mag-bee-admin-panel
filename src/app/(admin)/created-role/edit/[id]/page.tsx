"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiConnector } from "@/services/apiConnector";

export default function EditRolePage() {

  const params = useParams<{ id: string }>();
  const id = params.id;

  const [role, setRole] = useState<any>(null);
  const [allPrivileges, setAllPrivileges] = useState<any[]>([]);

  useEffect(() => {

    const loadData = async () => {

      const roleRes = await apiConnector("GET", `/role/${id}`);
      const privilegeRes = await apiConnector("GET", `/privileges`);

      setRole(roleRes.data);
      setAllPrivileges(privilegeRes.data.data);

    };

    loadData();

  }, [id]);

  const togglePrivilege = (privilegeId:number) => {

    const exists = role.privileges.some((p:any)=>p.id === privilegeId);

    if (exists) {

      setRole({
        ...role,
        privileges: role.privileges.filter((p:any)=>p.id !== privilegeId)
      });

    } else {

      const privilege = allPrivileges.find(p=>p.id === privilegeId);

      setRole({
        ...role,
        privileges:[...role.privileges, privilege]
      });

    }

  };

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    const privilegeIds = role.privileges.map((p:any)=>p.id);

    await apiConnector("POST","/roles/assign-privileges",{
      roleId: role.id,
      privilegeIds
    });

    alert("Privileges updated");

  };

  if (!role) return <p>Loading...</p>;

  return (

    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-xl font-semibold mb-6">
        Edit Role
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>

          <label className="block mb-2 font-medium">
            Role Name
          </label>

          <input
            value={role.name}
            className="border p-2 w-full"
            readOnly
          />

        </div>

        <div>

          <label className="block mb-3 font-medium">
            Privileges
          </label>

          <div className="grid grid-cols-2 gap-2">

            {allPrivileges.map((p)=>{

              const checked = role.privileges.some((rp:any)=>rp.id === p.id);

              return (

                <label key={p.id} className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={()=>togglePrivilege(p.id)}
                  />

                  {p.name}

                </label>

              );

            })}

          </div>

        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Privileges
        </button>

      </form>

    </div>

  );

}
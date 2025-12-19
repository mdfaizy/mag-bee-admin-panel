
import { AppDispatch } from "@/redux/store";
import { apiConnector } from "./apiConnector";
import { BASE_URL, endpoints } from "./apis";
// import { setToken } from "@/redux/authSlice";
// import { setUser } from "@/redux/profileSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setToken, setRefreshToken, setUser } from "@/redux/authSlice";
type AppRouter = ReturnType<typeof useRouter>;

const { LOGIN_API, SIGNUP_API, USER_LIST_API } = endpoints;



interface SignupParams {
  name: string;
  username: string;
  mobileNo: string;
  roleId: number;
  email: string;
  password: string;
  router: AppRouter;
}
interface ErrorResponse {
  message?: string;
}

interface SignupResponse {
  message: string;
  success?: boolean;
}
export const signup = ({
  name,
  username,
  mobileNo,
  roleId,
  email,
  password,
  router,
}: SignupParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Registering...");

    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const permissions = user?.permissions || [];

      if (!permissions.includes("CREATE_USER")) {
        toast.error("You do not have permission to create users.");
        return;
      }

      const res = await apiConnector<SignupResponse>(
        "POST",
        SIGNUP_API,
        {
          name,
          username,
          phone_number: mobileNo,
          role_id: roleId,
          email,
          password,
          is_active: true,
        },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );

      if (!res.data.message?.toLowerCase().includes("register")) {
        throw new Error(res.data.message || "Registration failed.");
      }

      toast.success("Registration successful!");
      router.push("/");

    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || error.message || "Signup failed.");
    } finally {
      toast.dismiss(toastId);
    }
  };
};
interface LoginParams {
  identifier: string;
  password: string;
  router: AppRouter;
}

export const login = ({ identifier, password, router }: LoginParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await apiConnector<any>("POST", LOGIN_API, {
        identifier,
        password,
      });

      const { token, refreshToken, user, message } = res.data;

      if (!message.includes("successful")) {
        throw new Error(message);
      }

      const userImage =
        user?.image ||
        (user?.name
          ? `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
            user.name
          )}`
          : "");

      dispatch(setToken(token));
      dispatch(setUser({ ...user, image: userImage }));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const updatedUser = { ...user, image: userImage };

      // dispatch(setToken(token));
      // dispatch(setUser(updatedUser));

      dispatch(setToken(token));
      dispatch(setRefreshToken(refreshToken));
      dispatch(setUser(updatedUser));

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(updatedUser));


      // Save updated user with image to localStorage
      // localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.message);
    } finally {
      toast.dismiss(toastId);
    }
  };
};


export const fetchAllUsers = async () => {
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  const res = await apiConnector("GET", USER_LIST_API, undefined, {
    Authorization: `Bearer ${token}`,
  });
  return res.data;
};

export async function toggleUserStatus(id: number) {
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");

  return await apiConnector(
    "PATCH",
    `${BASE_URL}/customers/${id}/toggle`,
    undefined,
    {
      Authorization: `Bearer ${token}`,
    }
  );
}



export const logout = () => (dispatch: AppDispatch) => {
  // dispatch(setToken(null));
  // dispatch(setUser(null));

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toast.success("Logged Out");
};


interface CreateRoleParams {
  name: string;
  description: string;
  router: AppRouter;
}

const CREATE_ROLE_API = `${BASE_URL}/roles`;

export const createRole = ({ name, description, router }: CreateRoleParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Creating role...");

    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";

      const permissions = JSON.parse(localStorage.getItem("user") || "{}")?.permissions || [];

      if (!permissions.includes("CREATE_ROLE")) {
        toast.error("You do not have permission to create roles.");
        return;
      }

      const res = await apiConnector(
        "POST",
        CREATE_ROLE_API,
        {
          name,
          description,
        },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );

      if (!res.data.message?.toLowerCase().includes("created")) {
        throw new Error(res.data.message || "Role creation failed.");
      }

      toast.success("Role created successfully!");
      router.push("/admin/roles");
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.message || "Something went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };
};


export async function getRolesAndPrivileges(token: string) {
  const [rolesRes, privilegesRes] = await Promise.all([
    fetch(`${BASE_URL}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${BASE_URL}/privileges`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (!rolesRes.ok || !privilegesRes.ok) {
    throw new Error("Failed to fetch roles or privileges");
  }

  const roles = await rolesRes.json();
  const privileges = await privilegesRes.json();

  return { roles, privileges };
}

export async function assignPrivilegesToRole({
  token,
  roleId,
  privilegeIds,
}: {
  token: string;
  roleId: string;
  privilegeIds: number[];
}) {
  const response = await fetch(
    `${BASE_URL}/roles/assign-privileges`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleId, privilegeIds }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to assign privileges");
  }

  return true;
}
import { User } from "../utils/type";
import axios from "axios";
export const updateUserById = async (user: User, token: string): Promise<User> => {
  const response = await axios.put(`${BASE_URL}/user/${user.id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteUserById = async (userId: number, token: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

import { AppDispatch } from "@/redux/store";
import { apiConnector } from "./apiConnector";
import { endpoints } from "./apis";
import { setToken } from "@/redux/authSlice";
import { setUser } from "@/redux/profileSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom"; 

const { LOGIN_API, SIGNUP_API ,USER_LIST_API} = endpoints;



interface SignupParams {
  name: string;
  username: string;
  mobileNo: string;
  roleId: number;
  email: string;
  password: string;
  router: any;
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
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const permissions = JSON.parse(localStorage.getItem("user") || "{}")?.permissions || [];

      // ✅ Check permission before sending API request
      if (!permissions.includes("CREATE_USER")) {
        toast.error("You do not have permission to create users.");
        return;
      }

      const res = await apiConnector<any>(
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

      // if (!res.data.success) {
      //   throw new Error(res.data.message || "Registration failed.");
      // }

      if (!res.data.message?.toLowerCase().includes("register")) {
        throw new Error(res.data.message || "Registration failed.");
      }


      toast.success("Registration successful!");
      router.push("/");

    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.response?.data?.message || error.message || "Signup failed.");
    } finally {
      toast.dismiss(toastId);
    }
  };
};

interface LoginParams {
  identifier: string;
  password: string;
  router: NextRouter;
}

export const login = ({ identifier, password, router }: LoginParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await apiConnector<any>("POST", LOGIN_API, {
        identifier,
        password,
      });

      const { token, user, message } = res.data;

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

dispatch(setToken(token));
dispatch(setUser(updatedUser));

// Save updated user with image to localStorage
localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.response?.data?.message || error.message);
    } finally {
      toast.dismiss(toastId);
    }
  };
};


export const fetchAllUsers = async () => {
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  const res = await apiConnector("GET", USER_LIST_API, null, {
    Authorization: `Bearer ${token}`,
  });
  return res.data;
};



export const logout = () => (dispatch: AppDispatch) => {
  dispatch(setToken(null));
  dispatch(setUser(null));

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toast.success("Logged Out");
};


interface CreateRoleParams {
  name: string;
  description: string;
  router: any;
}

const CREATE_ROLE_API = "/api/roles"; // ⬅️ Your backend route here

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
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };
};
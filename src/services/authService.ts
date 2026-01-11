
import { AppDispatch } from "@/redux/store";
import { apiConnector } from "./apiConnector";
import { BASE_URL, endpoints } from "./apis";
// import { setToken } from "@/redux/authSlice";
// import { setUser } from "@/redux/profileSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/authSlice";
type AppRouter = ReturnType<typeof useRouter>;

const { LOGIN_API, SIGNUP_API, USER_LIST_API } = endpoints;



interface SignupParams {
  name: string;
  username: string;
  mobileNo: string;
  roleId: number;
  email: string;
  // password: string;
  router: AppRouter;
}
interface ErrorResponse {
  message?: string;
}

interface SignupResponse {
  message: string;
  emailSent?: boolean;
  success?: boolean;
}
// export const signup = ({
//   name,
//   username,
//   mobileNo,
//   roleId,
//   email,
//   password,
//   router,
// }: SignupParams) => {
//   return async (dispatch: AppDispatch) => {
//     const toastId = toast.loading("Registering...");
//     try {
//       const res = await apiConnector<SignupResponse>(
//         "POST",
//         SIGNUP_API,
//         {
//           name,
//           username,
//           phone_number: mobileNo,
//           role_id: roleId,
//           email,
//           password,
//           is_active: false,
//         },
//       );
//       // toast.success("Registration successful!");
//       if (res.data?.emailSent) {
//   toast.success(res.data.message || "Verification email sent 📧");
// } else {
//   toast.success("Registration successful");
// }
//       router.push("/");

//     } catch (err) {
//       const error = err as AxiosError<ErrorResponse>;
//       toast.error(error.response?.data?.message || error.message || "Signup failed.");
//     } finally {
//       toast.dismiss(toastId);
//     }
//   };
// };

export const signup = ({
  name,
  username,
  mobileNo,
  roleId,
  email,
  router,
}: SignupParams) => {
  return async (_dispatch: AppDispatch) => {
    const toastId = toast.loading("Creating user...");
    try {
      const res = await apiConnector<SignupResponse>(
        "POST",
        SIGNUP_API,
        {
          name,
          username,
          phone_number: mobileNo,
          role_id: roleId,
          email,
        }
      );

      toast.success(
        res.data?.message || "User created. Verification email sent 📧"
      );

      // ✅ best UX
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "User creation failed"
      );
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

// export const login = ({ identifier, password, router }: LoginParams) => {
//   return async (dispatch: AppDispatch) => {
//     const toastId = toast.loading("Logging in...");
//     try {
//       const res = await apiConnector("POST", LOGIN_API, {
//         identifier,
//         password,
//       });

//       if (!res.data?.user) {
//         throw new Error(res.data?.message || "Invalid credentials");
//       }

//       const { user, message } = res.data;

//       if (!message?.toLowerCase().includes("successful")) {
//         throw new Error(message || "Login failed");
//       }

//       const userImage =
//         user?.image ||
//         `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
//           user.name
//         )}`;

//       const updatedUser = { ...user, image: userImage };

//       dispatch(setUser(updatedUser));
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       toast.success("Login successful");

//       // ✅ IMPORTANT: replace not push
//       router.replace("/");

//       // } 
//     } catch (err: any) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data?.errors?.[0]?.message ||
//         err.message ||
//         "Login failed";

//       toast.error(errorMessage);


//     } finally {
//       toast.dismiss(toastId);
//     }
//   };
// };


export const login = ({ identifier, password, router }: LoginParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Logging in...");

    try {
      const res = await apiConnector("POST", LOGIN_API, {
        identifier,
        password,
      });

      // 🔴 Single source of truth
      if (!res.data?.user) {
        throw new Error(res.data?.message || "Invalid credentials");
      }

      const user = res.data.user;

      const userImage =
        user.image ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
          user.name
        )}`;

      const updatedUser = { ...user, image: userImage };

      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Login successful");

      // ✅ redirect ONLY on success
      router.replace("/");

    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      toast.error(errorMessage);
      return; // 🔥 IMPORTANT (stop flow)
    } finally {
      toast.dismiss(toastId);
    }
  };
};







export const fetchAllUsers = async () => {

  const res = await apiConnector("GET", USER_LIST_API);
  return res.data;
};

export async function toggleUserStatus(id: number) {
  return await apiConnector(
    "PATCH",
    `/users/${id}/toggle`,);
}



export const logout = () => async (dispatch: AppDispatch) => {
  // dispatch(setToken(null));
  // dispatch(setUser(null));
  await apiConnector("POST", "/logout");
  // dispatch(setUser(null));
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
      const res = await apiConnector(
        "POST",
        CREATE_ROLE_API,
        {
          name,
          description,
        },
      );
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


interface Role { id: number; name: string }
interface Privilege { id: number; name: string }

export async function getRolesAndPrivileges(): Promise<{
  roles: Role[];
  privileges: Privilege[];
}> {
  const [rolesRes, privilegesRes] = await Promise.all([
    apiConnector<Role[]>("GET", "/roles"),
    apiConnector<Privilege[]>("GET", "/privileges"),
  ]);

  return {
    roles: rolesRes.data,
    privileges: privilegesRes.data,
  };
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
  // const response = await fetch(
  //   `${BASE_URL}/roles/assign-privileges`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ roleId, privilegeIds }),
  //   }
  // );
  const res = await axiosInstance.post(
    "/roles/assign-privileges",
    { roleId, privilegeIds }
  );

  return res.data;

  // if (!response.ok) {
  //   const text = await response.text();
  //   throw new Error(text || "Failed to assign privileges");
  // }

  // return true;
}
import { User } from "../utils/type";
// import axios from "axios";
import axiosInstance from "./axiosInstance";
export const updateUserById = async (user: User, token: string): Promise<User> => {
  const res = await axiosInstance.put(`/user/${user.id}`, user);
  return res.data;
};

export const deleteUserById = async (userId: number, token: string): Promise<void> => {
  await axiosInstance.delete(`/user/${userId}`);
};


export const forgotPassword = (
  email: string,
  setEmailSent: (val: boolean) => void
) => {
  return async (_dispatch: AppDispatch) => {
    const toastId = toast.loading("Sending reset email...");

    try {
      const res = await apiConnector(
        "POST",
        endpoints.FORGOT_PASSWORD_API,
        { email }
      );

      toast.success(
        res.data?.message || "Reset password email sent 📧"
      );

      setEmailSent(true);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to send reset email"
      );
    } finally {
      toast.dismiss(toastId);
    }
  };
};


export const resetPassword = (
  password: string,
  confirmPassword: string,
  token: string | null,
  setResetComplete: (val: boolean) => void
) => {
  return async (_dispatch: AppDispatch) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    const toastId = toast.loading("Resetting password...");

    try {
      const res = await apiConnector(
        "POST",
        endpoints.RESET_PASSWORD_API,
        {
          token,
          password,
          confirmPassword,
        }
      );

      toast.success(
        res.data?.message || "Password reset successfully ✅"
      );

      setResetComplete(true);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset password"
      );
    } finally {
      toast.dismiss(toastId);
    }
  };
};

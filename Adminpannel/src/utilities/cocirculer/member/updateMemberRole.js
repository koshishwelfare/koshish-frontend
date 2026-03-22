import axios from "axios";
import { toast } from "react-toastify";

const updateMemberRole = async (backendURL, id, role, cirToken) => {
  try {
    const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
    const config = {
      withCredentials: true,
      headers: hasJwt ? { authCociculertoken: cirToken } : {}
    };

    const { data } = await axios.patch(
      backendURL + `/api/cocirculer/member/role/${id}`,
      { role },
      config
    );

    if (data.success) {
      toast.success(data.message || 'Role updated');
      return true;
    }

    toast.error(data.message || 'Unable to update role');
    return false;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

export default updateMemberRole;
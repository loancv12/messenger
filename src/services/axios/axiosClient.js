import { createPrivateAxios } from "./createPrivateAxios";
import { createPublicAxios } from "./createPublicAxios";

export const axiosPrivate = createPrivateAxios();

export const axiosPublic = createPublicAxios();

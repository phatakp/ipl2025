"use server";

import { ProfileParams } from "@/app/types";
import userService from "@/services/user.services";

export const getAllUsers = async () => {
    return await userService.getAllUsers();
};

export const getCurrUser = async () => {
    return await userService.getCurrUser();
};

export const getRank = async () => {
    return await userService.getRank();
};

export const createProfile = async (values: ProfileParams) => {
    return await userService.createProfile(values);
};

export const updateProfile = async (values: ProfileParams) => {
    return await userService.updateProfile(values);
};

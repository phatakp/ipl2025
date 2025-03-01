"use server";

import { ProfileParams } from "@/app/types";
import userService from "@/services/user.services";

export const getAllUsers = async () => await userService.getAllUsers();

export const getCurrUser = async () => await userService.getCurrUser();

export const getRank = async () => await userService.getRank();

export const createProfile = async (values: ProfileParams) =>
    await userService.createProfile(values);

export const updateProfile = async (values: ProfileParams) =>
    await userService.updateProfile(values);

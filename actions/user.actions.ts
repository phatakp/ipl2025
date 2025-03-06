"use server";

import { z } from "zod";

import { ProfileParams } from "@/app/types";
import { profileIdSchema } from "@/db/schema/profiles.schema";
import userService from "@/services/user.services";

export const getAllUsers = async () => await userService.getAllUsers();

export const getProfileById = async (values: z.infer<typeof profileIdSchema>) =>
    await userService.getProfileById(values);

export const getCurrUser = async () => await userService.getCurrUser();

export const getRank = async () => await userService.getRank();

export const createProfile = async (values: ProfileParams) =>
    await userService.createProfile(values);

export const updateProfile = async (values: ProfileParams) =>
    await userService.updateProfile(values);

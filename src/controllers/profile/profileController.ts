import { Request, Response } from "express";
import { prisma } from "../..";

export const viewProfile = async (req: Request, res: Response) => {};

export const currentUser = async (req: Request, res: Response) => {
  const id = req.params.userId;
  try {
    const currentProfile = await prisma.profile.findUnique({
      where: {
        id,
      },
    });
  } catch (e) {
    console.error(e, "Have not profile ");
  }
};

export const getExplore = async (req: Request, res: Response) => {
  let filter = {};
  const searchQuery = req.query.search;

  if (searchQuery) {
    filter = {
      where: {
        name: {
          startsWith: searchQuery,
        },
      },
    };
  }
  try {
    const explore = await prisma.profile.findMany(filter);
    res.json(explore);
  } catch (e) {
    console.error(e, " We have not profile");
  }
};

export const createProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { name, about, avatarImage, socialMediaURL } = req.body;
  try {
    const newProfile = await prisma.profile.create({
      data: {
        userId,
        name,
        about,
        avatarImage,
        socialMediaURL,
      },
    });
    res.json({ message: "Successfully add new profile", newProfile });
  } catch (e) {
    console.error(e, "Check your hosoo");
  }
};

export const profiles = async (req: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany();
    res.json(profiles);
  } catch (e) {
    console.error(e, "error here --->");
  }
};

export const editProfile = async (req: Request, res: Response) => {
  const id = req.params.profileId;
  try {
    const { name, about, avatarImage, socialMediaURL } = req.body;
    const edit = await prisma.profile.update({
      where: {
        id,
      },
      data: {
        name: name,
        about: about,
        avatarImage: avatarImage,
        socialMediaURL: socialMediaURL,
      },
    });
    res.json({ message: "Successfull edited " });
  } catch (e) {
    console.error(e, "Check your info");
  }
};

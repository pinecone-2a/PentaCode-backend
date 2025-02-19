import { Request, Response } from "express";
import { prisma } from "../..";
import { Prisma } from "@prisma/client";

export const viewProfile = async (req: Request, res: Response) => {
  const { profileId } = req.params;

  try {
    const view = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });
    console.log(view);
    res.json(view);
  } catch (e) {
    console.error(e, " Hereglegch baisangue");
  }
};

export const currentUser = async (req: Request, res: Response) => {
  const id = req.params.userId;
  try {
    console.log("calling");
    const currentProfile = await prisma.profile.findUnique({
      where: {
        userId: id,
      },
    });
    console.log(currentProfile);
    res.json(currentProfile);
  } catch (e) {
    console.error(e, "Have not profile ");
  }
};

export const getExplore = async (req: Request, res: Response) => {
  try {
    const searchQuery =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const filter: Prisma.ProfileFindManyArgs = searchQuery
      ? {
          where: {
            name: {
              startsWith: searchQuery,
            },
          },
        }
      : {};

    const explore = await prisma.profile.findMany(filter);

    console.log(searchQuery);
    res.json(explore);
  } catch (e) {
    console.error(e, "Error fetching profiles");
    res
      .status(500)
      .json({ message: "An error occurred while fetching profiles" });
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

export const editProfile = async (req: Request, res: Response) => {
  const id = req.params.profileId;
  const { name, about, avatarImage, socialMediaURL, backgroundImage } =
    req.body;
  try {
    console.log(id);
    const edit = await prisma.profile.update({
      where: {
        userId: id,
      },
      data: {
        name: name,
        about: about,
        avatarImage: avatarImage,
        socialMediaURL: socialMediaURL,
        backgroundImage,
      },
    });
    res.json({ message: "Successfull edited " });
  } catch (e) {
    console.error(e, "Aldaa bnaa broda sain shalgaarai");
  }
};
export const viewProfileForHome = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const view = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });
    console.log(view);
    res.json(view);
  } catch (e) {
    console.error(e, " Hereglegch baisangue");
  }
};

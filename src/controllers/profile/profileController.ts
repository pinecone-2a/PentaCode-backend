import { prisma } from "../.."

export const createProfile = async (  ) => {
    const addProfile = await prisma.profile.create({
       data : {
            name:"baaska" ,
            about : " nanao",
            avatarImage : "src",
            socialMediaURL : " sdfsdf" ,
            userId : "dsad"
        } 
    } 
     )
   
}
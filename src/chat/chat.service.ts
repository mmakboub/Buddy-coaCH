import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
        let resourceType = "auto"; 
      
        if (file.mimetype.startsWith('image/') || 
            (file.originalname.endsWith('.jpg') || 
             file.originalname.endsWith('.jpeg') || 
             file.originalname.endsWith('.png'))) {
            resourceType = "image"; 
        } else if (file.mimetype.startsWith('audio/') || file.originalname.endsWith('.mp3')) {
            resourceType = "video"; // Treat audio files as video resources
        } else {
           
            reject(new Error("Unsupported file type"));
            return;
        }

        cloudinary.uploader.upload_stream(
          { resource_type: resourceType as  "image" | "video"  }, 
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(file.buffer);
    });
}
  async findAllMsg(roomId: string) {
    try {
      const msgs = await this.prisma.message.findMany({
        where: { roomId: roomId },
      });
      return msgs;
    } catch (e) {
      console.log(e);
    }
  }
  async getRoomsForUser( userId: number) {
    const rooms = await this.prisma.room.findMany({
      where: {
        usermember: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        usermember: true,  
        coachmember: true, 
        msgs: true,
      },
    });
    return rooms;
  }
  async getUniqueRoom( roomId: number) {
    const rooms = await this.prisma.room.findMany({
      where: {
        usermember: {
          some: {
            id: roomId
          },
        },
      },
      include: {
        usermember: true,  
        coachmember: true, 
        msgs: true,
      },
    });
    return rooms;
  }
}

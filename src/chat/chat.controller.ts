import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MsgType, Sender } from '.prisma/client';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/creat-room.dto';

@Controller('Chat')
export class ChatController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}
  @Post('create-room')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    const { userId, coachId } = createRoomDto;
    const existingRoom = await this.prisma.room.findFirst({
      where: {
        usermember: { some: { id: userId } },
        coachmember: { some: { id: coachId } },
      },
    });

    if (existingRoom) {
      throw new BadRequestException('La salle existe déjà.');
    }
    const room = await this.prisma.room.create({
      data: {
        usermember: {
          connect: { id: userId },
        },
        coachmember: {
          connect: { id: coachId },
        },
      },
    });

    return room;
  }

  @Post('create-msg')
  @UseInterceptors(FileInterceptor('file'))
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const { msg, msgType, userId, time, coachId, sender, roomId } =
      createMessageDto;

    const userIdInt =
      typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const coachIdInt =
      typeof coachId === 'string' ? parseInt(coachId, 10) : coachId;

    console.log('createMessageDto:', createMessageDto);
    console.log(
      'Types - userId:',
      typeof userIdInt,
      'coachId:',
      typeof coachIdInt,
    );

    let fileUrl = null;

    if (msgType === 'IMAGE' || msgType === 'AUDIO') {
      if (file) {
        const uploadedFile = await this.chatService.uploadFile(file);
        fileUrl = uploadedFile.url;
      } else {
        throw new BadRequestException(
          'Un fichier est requis pour le type de message spécifié.',
        );
      }
    } else if (msgType === 'TEXT') {
      if (!msg || msg.trim() === '') {
        throw new BadRequestException(
          'Le texte est requis pour le type de message spécifié.',
        );
      }
    } else {
      throw new BadRequestException('Type de message invalide.');
    }

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        usermember: true,
        coachmember: true,
      },
    });

    if (!room) {
      throw new BadRequestException("La salle spécifiée n'existe pas.");
    }
    const isUserInRoom = room.usermember.some(
      (member) => member.id === userIdInt,
    );
    const isCoachInRoom = room.coachmember.some(
      (member) => member.id === coachIdInt,
    );

    if (!isUserInRoom) {
      throw new BadRequestException(
        "L'utilisateur spécifié n'est pas membre de cette salle.",
      );
    }

    if (!isCoachInRoom) {
      throw new BadRequestException(
        "Le coach spécifié n'est pas membre de cette salle.",
      );
    }

    const message = await this.prisma.message.create({
      data: {
        msg: msgType === 'TEXT' ? msg : fileUrl,
        msgType,
        sender,
        senderId: sender === 'USER' ? userIdInt : coachIdInt, // Ensure these are integers
        room: {
          connect: {
            id: room.id,
          },
        },
        time,
      },
    });

    return message;
  }
}

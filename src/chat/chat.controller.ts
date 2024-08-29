import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { startCallDto } from './dto/start-call-dto.dto';
import { endCallDto } from './dto/end-call-dto.dto';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/creat-room.dto';
import { ApiTags } from '@nestjs/swagger';
import { differenceInSeconds, parseISO } from 'date-fns';




@Controller('Chat')
@ApiTags('Chat')

export class ChatController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}


  //------------------------ROOMS--------------------------------//
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

   //--------------------------//

  @Get('get-unique-room/:roomId')
  async getUniqueRoom(@Param('roomId') roomId: string) {
    const roomIdInt = parseInt(roomId, 10);
    if (isNaN(roomIdInt)) {
      throw new BadRequestException('ID de salle invalide.');
    }
    const room = await this.chatService.getUniqueRoom(roomIdInt);
    return room;
  }

  //--------------------------//

  @Get('get-rooms-for-user/:userId')
  async getRoomsForUser(@Param('userId') userId: string) {
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      throw new BadRequestException('ID utilisateur invalide.');
    }
    const rooms = await this.chatService.getRoomsForUser(userIdInt);
    return rooms;
  }

  //--------------------------//
  
  @Get('get-rooms-for-user-with-last-msg/:userId')
  async getAllRoomsForUserWithLastMsg(@Param('userId') userId: string) {
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      throw new BadRequestException('ID utilisateur invalide.');
    }
    const rooms = await this.chatService.getAllRoomsWithLastMsg(userIdInt);
    return rooms;
  }

  //------------------------MESSAGES--------------------------------//

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
        senderId: sender === 'USER' ? userIdInt : coachIdInt,
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

  //--------------------------//

  @Get('get-all-msg/:roomId')
  async findAllMsg(@Param('roomId') roomId: string) {
    const msgs = await this.chatService.findAllMsg(roomId);
    return msgs;
  }

  //------------------------CALLS--------------------------------//
 
  
  @Post('start-call')
  async startCall(@Body() startCallDto: startCallDto) {
    const call = await this.prisma.call.create({
      data: {
        userId: startCallDto.userId,
        coachId: startCallDto.coachId,
        startedAt: startCallDto.startedAt,
        callType: startCallDto.callType,
      },
    });
  
    return call;
  }
  
  @Post('end-call')
  async endCall(@Body() endCallDto: endCallDto) {
    const call = await this.prisma.call.findUnique({
      where: { id: endCallDto.CallId },
    });
  
    if (!call) {
      throw new HttpException('Call not found', HttpStatus.NOT_FOUND);
    }
    if(call.endedAt){
      throw new HttpException('Call already ended', HttpStatus.BAD_REQUEST);
    }
    const endedAt = endCallDto.endedAt;
    const startedAt = call.startedAt;
    
    const durationSeconds = parseTimeToSeconds(endedAt) - parseTimeToSeconds(startedAt);
  
    // Format the duration based on time
    let formattedDuration: string;
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
  
    if (hours > 0) {
      formattedDuration = `${hours}h${minutes > 0 ? minutes + 'min' : ''}`;
    } else if (minutes > 0) {
      formattedDuration = `${minutes}min${seconds > 0 ? seconds + 's' : ''}`;
    } else {
      formattedDuration = `${seconds}s`;
    }
  
    const updatedCall = await this.prisma.call.update({
      where: { id: endCallDto.CallId },
      data: {
        endedAt: endedAt,
        duration: formattedDuration,
      },
    });
  
    return updatedCall;
  }

  //--------------------------//


  @Get('get-all-calls-for-user')
  async getAllCallsForUser(@Param('userId') userId: string)
  {
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      throw new BadRequestException('ID utilisateur invalide.');
    }
    const rooms = await this.chatService.getAllCallsForUser(userIdInt);
    return rooms;
  }
  
 
}
function parseTimeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + (seconds || 0);
}

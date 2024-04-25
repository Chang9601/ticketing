import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiResponse,
  AuthUser,
  Code,
  JwtAuthGuard,
  UserPayload,
} from '@app/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketDto } from './dto/ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { diskStorage } from 'multer';

@Controller('/api/v1/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  /*
    파일 업로드를 처리하기 위해 NestJS는 ExpressJS의 multer 미들웨어를 기반으로 한 내장 모듈을 제공한다. 
    Multer는 주로 POST 요청을 통해 파일을 업로드하는 데 사용되는 multipart/form-data 형식으로 게시된 데이터를 처리한다. 
    Multer는 지원되는 멀티파트 형식(multipart/form-data)이 아닌 데이터를 처리할 수 없다. 
    FileInterceptor() 인터셉터를 라우트 핸들러에 연결하고 @UploadedFile() 데코레이터를 사용하여 요청에서 파일을 추출한다.

    하나의 필드 이름으로 식별된 파일 배열을 업로드하려면 FilesInterceptor() 인터셉터를 사용한다.
    FilesInterceptor() 인터셉터는 3개의 인자를 사용한다.
    1. fieldName은 파일을 보유하는 HTML 폼의 필드 이름을 제공하는 문자열.
    2. maxCount은 받아들일 파일의 최대 수를 정의하는 숫자로 선택사항.
    3. options은 MulterOptions 객체로 선택사항.
    FilesInterceptor() 인터셉터를 사용할 때, 요청에서 파일을 추출하기 위해 @UploadedFiles() 데코레이터를 사용한다.
  */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({ destination: '/upload' }),
    }),
  )
  @UseGuards(JwtAuthGuard)
  public async createTicket(
    @AuthUser() user: UserPayload,
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ApiResponse<TicketDto>> {
    const ticketDto = await this.ticketService.create(user, createTicketDto);

    return ApiResponse.handleSuccess(
      Code.CREATED.code,
      Code.CREATED.message,
      ticketDto,
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getTicket(@Param() id: number): Promise<ApiResponse<TicketDto>> {
    const ticketDto = await this.ticketService.findOne(id);

    return ApiResponse.handleSuccess(Code.OK.code, Code.OK.message, ticketDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getTickets(): Promise<ApiResponse<TicketDto[]>> {
    const ticketDtos = await this.ticketService.findAll();

    return ApiResponse.handleSuccess(Code.OK.code, Code.OK.message, ticketDtos);
  }

  @Put(':/id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async updateTicket(
    @Param() id: number,
    @AuthUser() user: UserPayload,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<ApiResponse<TicketDto>> {
    const ticketDto = await this.ticketService.update(
      id,
      user,
      updateTicketDto,
    );

    return ApiResponse.handleSuccess(
      Code.CREATED.code,
      Code.CREATED.message,
      ticketDto,
    );
  }
}

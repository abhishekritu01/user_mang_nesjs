// import { Module, OnModuleInit } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { InjectConnection } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';
// import { UserModule } from './user/user.module';
// import { CacheModule } from '@nestjs/cache-manager';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         uri: configService.get<string>('MONGODB_URI'),
//       }),
//       inject: [ConfigService],
//     }),
//     UserModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule implements OnModuleInit {
//   constructor(@InjectConnection() private readonly connection: Connection) {}
//   async onModuleInit() {
//     try {
//       await this.connection;
//       console.log('MongoDB connection successful.');
//     } catch (error) {
//       console.error('MongoDB connection error:', error);
//     }
//   }
// }

import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  async onModuleInit() {
    try {
      await this.connection;
      console.log('MongoDB connection successful.');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }
}

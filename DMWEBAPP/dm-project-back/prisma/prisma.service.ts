import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ log: [{ emit: 'event', level: 'query' }] });

    Object.assign(
      this,
      this.$extends({
        result: {
          accident: {
            startLat: {
              compute(accident) {
                return accident.startLat instanceof Decimal
                  ? accident.startLat.toNumber()
                  : accident.startLat;
              },
            },
            startLng: {
              compute(accident) {
                return accident.startLng instanceof Decimal
                  ? accident.startLng.toNumber()
                  : accident.startLng;
              },
            },
            windSpeed: {
              compute(accident) {
                return accident.windSpeed instanceof Decimal
                  ? accident.windSpeed.toNumber()
                  : accident.windSpeed;
              },
            },
          },
        },
      }),
    );
  }

  async onModuleInit() {
    await this.$connect();
    console.log(`🚀 Database Connected`);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

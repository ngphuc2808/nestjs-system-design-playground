import { Module } from '@nestjs/common';
import { RedisLuaNaiveService } from './services/redis-lua-naive.service';
import { RedisLuaOptimizedService } from './services/redis-lua-optimized.service';
import { RedisLuaNaiveController } from './controllers/redis-lua-naive.controller';
import { RedisLuaOptimizedController } from './controllers/redis-lua-optimized.controller';

@Module({
  controllers: [RedisLuaNaiveController, RedisLuaOptimizedController],
  providers: [RedisLuaNaiveService, RedisLuaOptimizedService],
  exports: [RedisLuaNaiveService, RedisLuaOptimizedService],
})
export class RedisLuaModule {}

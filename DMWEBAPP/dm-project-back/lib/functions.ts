import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CRUDReturn, PaginationParams, QueryParam } from 'src/types/global';

export interface PaginationMeta {
  total: number;
  total_page: number;
  next: boolean;
  page: number;
  limit: number;
}

export function buildPagination(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const safePage = Math.max(0, Number(page) || 0);
  const safeLimit = Math.max(1, Number(limit) || 100);

  const total_page = Math.ceil(total / safeLimit);

  const next = safePage < total_page - 1;

  return {
    total,
    total_page,
    next,
    page: safePage,
    limit: safeLimit,
  };
}

interface Pagination {
  page: number;
  limit: number;
}

export const changeDataStatePrisma = async (
  prismaModel: any,
  state: 'soft_delete' | 'restore',
  ids: number[],
): Promise<CRUDReturn> => {
  const updates: Record<string, any> = {};

  if (state === 'soft_delete') {
    updates.deleted = true;
    updates.deletedAt = new Date();
  } else if (state === 'restore') {
    updates.deleted = false;
    updates.deletedAt = null;
  } else throw new Error(`Invalid state: ${state}`);

  return await prismaModel.updateMany({
    where: { id: { in: ids } },
    data: updates,
  });
};

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationParams => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, limit = 10, cursor } = request.query;

    return {
      page: Number(page),
      limit: Number(limit),
      cursor: cursor as string | undefined,
    };
  },
);

export const Queries = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): QueryParam => {
    const request = ctx.switchToHttp().getRequest();
    const { page, limit, ...other } = request.query;
    return Object.fromEntries(
      Object.entries({
        ...other,
      }).filter(([_, value]) => value !== undefined),
    ) as QueryParam;
  },
);

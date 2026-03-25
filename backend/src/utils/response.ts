import { Context } from 'hono';

// 统一响应格式
export const response = {
  success: (c: Context, data: any = null, message = '操作成功') => {
    return c.json({
      code: 0,
      message,
      data,
    });
  },
  
  error: (c: Context, message = '操作失败', code = 1, statusCode = 400) => {
    return c.json({
      code,
      message,
      data: null,
    }, statusCode);
  },
  
  paginate: (c: Context, list: any[], total: number, page: number, pageSize: number) => {
    return c.json({
      code: 0,
      message: '操作成功',
      data: {
        list,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  },
};

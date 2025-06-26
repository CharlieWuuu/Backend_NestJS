// 這是 NestJS 提供的核心裝飾器與參數注入器，屬於框架基本功能
// Controller: 控制器裝飾器，用來定義路由
// Get, Post: 路由裝飾器，用來定義 HTTP 方法
// Req, Res: HTTP 請求與回應物件裝飾器，用來獲取 HTTP 請求與回應
// Body: 用來獲取請求體中的資料
import { Controller, Get, Post, Req, Res, Body } from '@nestjs/common';

// 這是直接從 Express 套件匯入的類型（TypeScript 型別），不是 Nest 提供的
// 但 Nest 是建構在 Express（或 Fastify）之上的，所以可以直接用。
import { Response, Request } from 'express';

// 這是用來定義 Swagger API 文件的裝飾器
import { ApiBody } from '@nestjs/swagger';

// 這是 NestJS 的裝飾器，用來定義控制器
@Controller('cookie')
// 這是控制器的類別，負責處理與 Cookie 相關的請求
export class TestController {
  // 這是用來處理設定 Cookie 的 POST 請求
  @Post('setCookie')
  // @Body('value') 用來獲取請求體中的 'value' 欄位
  // @Res() 用來獲取 Express 的 Response 物件
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'string', example: 'hello-cookie' },
      },
    },
  })
  setCookie(@Body('value') value: string, @Res() res: Response) {
    // 假設這裡設定了一個名為 'test_cookie' 的 cookie，設定 Cookie 的有效期為 10 秒
    res.cookie('test_cookie', value, { maxAge: 10 * 1000 });
    // 回傳一個 JSON 物件，表示 Cookie 已經設定成功
    res.json({ message: 'Cookie 已設定', cookie: value });
  }

  // 這是用來處理查看 Cookie 的 GET 請求

  @Get('seeCookie')
  // @Req() 用來獲取 Express 的 Request 物件
  seeCookie(@Req() req: Request, @Res() res: Response) {
    // 假設這裡從請求中獲取 cookie
    const cookieValue = req.cookies;
    // 回傳一個 JSON 物件，包含 cookie 的值
    res.json({ message: 'Cookie 是這個：' + JSON.stringify(cookieValue) });
  }

  // 這是用來處理刪除 Cookie 的 POST 請求
  @Post('dropCookie')
  // @Res() 用來獲取 Express 的 Response 物件
  dropCookie(@Res() res: Response) {
    // 假設這裡刪除名為 'test_cookie' 的 cookie，並設定路徑為 '/'，代表這個 Cookie 在整個網站上都有效
    // 注意：如果沒有設定路徑，可能會導致 Cookie 無法正確刪除
    // 因為 Cookie 的路徑可能會影響到 Cookie 的存取範圍
    // 這裡的路徑設定是為了確保 Cookie 在整個網站上都能被正確刪除
    res.clearCookie('test_cookie', { path: '/' });
    // 回傳一個 JSON 物件，表示 Cookie 已經刪除
    res.json({ message: 'Cookie 已刪除' });
  }
}

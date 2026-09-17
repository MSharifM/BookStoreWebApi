using System.Net;
using System.Text.Json;
using BookStore.Application.Exceptions;

namespace BookStore.Api.Middlewares
{
    public class GlobalExceptionHandler
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionHandler(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var response = new ErrorResponse();

            if (exception is AppException appEx)
            {
                context.Response.StatusCode = MapToHttpStatusCode(appEx.Code);
                response.Message = appEx.Message;
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Message = "یک خطای داخلی در سرور رخ داده است.";
            }

            var result = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(result);
        }

        private static int MapToHttpStatusCode(ErrorCode code) => code switch
        {
            ErrorCode.BadRequest => (int)HttpStatusCode.BadRequest,
            ErrorCode.NotFound => (int)HttpStatusCode.NotFound,
            ErrorCode.Forbidden => (int)HttpStatusCode.Forbidden,
            ErrorCode.Unauthorized => (int)HttpStatusCode.Unauthorized,
            ErrorCode.Conflict => (int)HttpStatusCode.Conflict,
            _ => (int)HttpStatusCode.InternalServerError
        };
    }

    public class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
    }
}
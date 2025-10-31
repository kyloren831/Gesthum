using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GesthumServer.Filters
{
    public class ApiExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            ObjectResult result;

            switch (exception)
            {
                case HttpRequestException:
                    result = new ObjectResult(new { Message = "Error communicating with external service" })
                    {
                        StatusCode = StatusCodes.Status503ServiceUnavailable
                    };
                    break;
                case InvalidOperationException:
                    result = new ConflictObjectResult(new { Message = exception.Message });
                    break;
                case KeyNotFoundException:
                    result = new NotFoundObjectResult(new { Message = exception.Message });
                    break;

                case ArgumentException:
                    result = new BadRequestObjectResult(new { Message = exception.Message });
                    break;

                default:
                    result = new ObjectResult(new { Message = "Unexpected error occurred" })
                    {
                        StatusCode = StatusCodes.Status500InternalServerError
                    };
                    break;
            }

            context.Result = result;
            context.ExceptionHandled = true;

        }
    }
}

package com.artsail.admin.exception;


import com.artsail.admin.common.ErrorCode;
import com.artsail.admin.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHander {

    @ExceptionHandler(BusinessException.class)
    public Result  handleBusinessException(BusinessException e){
        log.error("业务异常"+e.getMessage(),e);
        return Result.error(e.getCode(),e.getMessage(),e.getDescription());
    }
    @ExceptionHandler(RuntimeException.class)
    public Result handleRuntimeException(RuntimeException e){
        log.error("运行时异常");
        return Result.error(ErrorCode.SYSTEM_ERROR,e.getMessage());
    }

}

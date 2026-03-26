package com.artsail.admin.common;

import lombok.Getter;

import java.io.NotActiveException;

/**
 * 错误码
 *
 * @author 13372
 */
@Getter
public enum ErrorCode {
    FARAMS_ERROR (408,"请求参数错误",""),
    FARAMS_NULL_ERROR (409,"请求参数为空",""),
    Not_AUTH(401,"无权限",""),
    SYSTEM_ERROR(500,"系统内部错误","");

    private final int code;
    private final String message;
    private final String description;

    ErrorCode(int code, String message, String description) {
        this.code = code;
        this.message = message;
        this.description = description;
    }

    ErrorCode(ErrorCode errorCode){
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.description = errorCode.getDescription();
    }


}

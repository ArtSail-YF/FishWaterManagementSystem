package com.artsail.env.service;

import com.artsail.env.model.domain.EnvWq;
import com.artsail.env.model.vo.EnvWqDictVO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface EnvWqService extends IService<EnvWq> {

    /** 查询所有塘口水质（带塘口名称和基地名称） */
    List<EnvWq> getAllWithNames();

    /** 获取水质看板字典数据（下拉选项） */
    EnvWqDictVO getDict();
}

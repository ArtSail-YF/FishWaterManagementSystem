package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.IotDevice;
import com.artsail.aquaculture.model.domain.Query.IotDeviceQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IotDeviceService extends IService<IotDevice> {

    /** 联表分页查询 */
    Page<IotDevice> search(Page<IotDevice> page, IotDeviceQuery query);

    /** 根据基地ID获取在线设备列表（用于发布弹窗下拉选择） */
    List<IotDevice> getByBaseId(Long baseId);

    /** 根据设备类型ID和基地ID获取设备 */
    List<IotDevice> getByTypeAndBase(Long typeId, Long baseId);
}

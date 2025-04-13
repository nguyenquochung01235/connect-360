const { Op, where } = require('sequelize');
const database = require('../../models');
const e = require('express');

const DeviceModel = database.deviceModel;
const DeviceService = {};

DeviceService.getDeviceByID = async function(id_device) {
   if (id_device == null || id_device == "") {
      return false;
   }
   const device = await DeviceModel.findOne({
      where: {
         id_device: id_device
      }
   }).then(async function(data) {
      if (data == null) { return false }
      return data;
   }).catch(err => {
      return false
   });
   return device;
}

DeviceService.isDeviceExist = async function(channel){
   try {
    const device = await DeviceModel.findOne({
      where:{
         channel: channel
      }
    })
    if(device == null){
      return false;
    }else{
      return true;
    }
   } catch (error) {
    return false;
   }
}

DeviceService.getDeviceByListChannel = async function(channelList){
   const deviceList = [];
   try {
    const deviceList = await DeviceModel.findAll({
      where:{
         channel: {
            [Op.in]: channelList
         }
      }
    })
    return deviceList;
   } catch (error) {
    return deviceList;
   }
}

DeviceService.searchDevice = async function(channel){
   try {
    const deviceList = await DeviceModel.findAll({
      where:{
         channel: {
            [Op.like]: `%${channel}%`, 
         }
      },
      limit: 20
    })
    return deviceList;
   } catch (error) {
    return false;
   }
}

DeviceService.getAllDevicesPaginate = async function(page,search) {
    limit = 10
    if(page == null || page < 1){
        page = 1
    }
    if(search == null || search == "") {
        search = ""
    }
    search = search.toLowerCase();
    const where = {
      [Op.or]: [
        {
          device_name: {
            [Op.like]: `%${search}%`
          }
        },
        {
          channel: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
    const offset = (page - 1) * limit;
    const totalDevices = await DeviceModel.count({where: where});
    const totalPages =   Math.ceil(totalDevices / limit);
    const devices = await DeviceModel.findAll({
        where: where,
        order: [
            ['updated_at', 'DESC']
        ],
        limit: limit,
        offset: offset
    }).then( async function(data) {
        if(data.length == 0){return false}
        return data;

    }).catch(err=>{
        return false
    });
    
    return data = {
        devices: devices,
        totalPages: totalPages,
        currentPage: page,
        totalDevices: totalDevices
    };

    
}   

DeviceService.createDevice = async function(device_name, channel, description, active) {
   const error = [];
   const t = await database.sequelize.transaction();
   if(device_name == null || device_name == "") {
      error.push("Device Name is required");
   }
   if(channel == null || channel == "") {
      error.push("Channel is required");
   }
   if (active == null || active == "" || (active != 0 && active != 1)) {
      error.push("Active value only 0 or 1");
   }
   if (await this.isDeviceExist(channel)) {
      error.push("Device channel already existed");
   }
   if(error.length > 0) {
      return {
         success: false,
         message: error
      }
   }
   try {
      const device = await DeviceModel.create({
         device_name: device_name,
         channel: channel,
         description: description,
         active: active
      }, { transaction: t });
      await t.commit();
      return {
         success: true,
         message: "Device created successfully"
      }
   } catch (error) {
      console.log(error);
      await t.rollback();
      return {
         success: false,
         message: "Transaction failed"
      }
   }

}

DeviceService.updateDevice = async function(id_device, device_name, channel, description, active) {
   const error = [];
   const t = await database.sequelize.transaction();
   if(device_name == null || device_name == "") {
      error.push("Device Name is required");
   }
   if(channel == null || channel == "") {
      error.push("Channel is required");
   }
   if (active == null || active == "" || (active != 0 && active != 1)) {
      error.push("Active value only 0 or 1");
   }
   const isChannelExisted = await DeviceModel.findOne({
      where: {
         channel: channel,
         id_device: {
            [Op.ne]: id_device
         }
      }
   });
   if(isChannelExisted != null) {
      error.push("Device channel already existed");
   }
   if(error.length > 0) {
      return {
         success: false,
         message: error
      }
   }
   try {
      const device = await DeviceModel.update({
         device_name: device_name,
         channel: channel,
         description: description,
         active: active
      }, {
         where: {
            id_device: id_device
         }
      }, { transaction: t });
      await t.commit();
      return {
         success: true,
         message: "Device update successfully"
      }
   } catch (error) {
      console.log(error);
      await t.rollback();
      return {
         success: false,
         message: "Transaction failed"
      }
   }

}
module.exports = DeviceService;
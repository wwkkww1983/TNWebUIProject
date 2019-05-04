function queryDailyProductionPlantSlctFun(flag) {
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getindustrialplant",
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		processData: true,
		success: function(dataRes) {

			$("#industrialPlantSlct").find('option').remove();
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#industrialPlantSlct').append(("<option value=" + models[i].id + ">" + models[i].name.toString()  + "</option>").toString())
				}
				$('#industrialPlantSlct').selectpicker('refresh');
				$('#industrialPlantSlct').selectpicker('render');   
				// $('#industrialPlantSlct').selectpicker('mobile');

				if($.cookie('plantID') != null && $.cookie('plantID') != 'undefined' && $.cookie('plantID').toString().length > 0) {
					var numbers = $('#industrialPlantSlct').find("option"); //获取select下拉框的所有值
					for(var j = 0; j < numbers.length; j++) {
						if($(numbers[j]).val().toString().split("###")[0] == $.cookie('plantID')) {
							$(numbers[j]).attr("selected", "selected");
							$('#industrialPlantSlct').selectpicker('hide');

							$("#industrialPlantLabel").css("display", "none");
						}
					}
					$('#industrialPlantSlct').selectpicker('refresh');
					$('#industrialPlantSlct').selectpicker('render'); 

				}

			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
	if(flag = "1") {
		queryDailyProductionProcessSlctFun();
	}
};

function productionStatisBatteryTypeSlctFun(flag) {
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getmaterialbyprocess?processID=1008",
		type: "GET",

		//contentType: "application/json",
		//dataType: "json",
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		//processData: true,
		processData: false,
		contentType: false,
		async: false,
		success: function(dataRes) {

			$("#batterytype").find('option').remove();

			if(dataRes.status == 1) { 

				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#batterytype').append(("<option value=" + models[i].id + ">" + models[i].name.toString()  + "</option>").toString());
				}
				$('#batterytype').selectpicker('refresh');
				$('#batterytype').selectpicker('render');   
				// $('#batterytype').selectpicker('mobile');
				$('#batterytype').selectpicker('hide');
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	}); 
};

function queryDailyProductionProcessSlctFun() {
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getproductionprocess",
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		processData: true,
		success: function(dataRes) {
			$("#productionProcessSlct").find('option').remove();

			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#productionProcessSlct').append(("<option value=" + models[i].id + ">" + models[i].name.toString()  + "</option>").toString())
				}
				//console.log($('#productionProcessSlct'));
				$('#productionProcessSlct').selectpicker('refresh');
				$('#productionProcessSlct').selectpicker('render');   
				// $('#productionProcessSlct').selectpicker('mobile');

				if($.cookie('processID') != null && $.cookie('processID') != 'undefined' && $.cookie('processID').toString().length > 0) {
					var numbers = $('#productionProcessSlct').find("option"); //获取select下拉框的所有值
					for(var j = 0; j < numbers.length; j++) {
						if($(numbers[j]).val().toString().split("###")[0] == $.cookie('processID')) {
							$(numbers[j]).attr("selected", "selected");
							$('#productionProcessSlct').selectpicker('hide');

							$("#productionProcessLabel").css("display", "none");
						}
					}
					$('#productionProcessSlct').selectpicker('refresh');
					$('#productionProcessSlct').selectpicker('render'); 

				}
				queryDailyProductionLineSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function queryDailyProductionLineSlctFun() {
	//	return true;
	//	if(!($.isEmptyObject(first)) && first.toString().length > 1) {
	//
	//		return;
	//	}
	//alert("生产线选择");
	var formData = new FormData();
	formData.append("plantID", document.PlantToLineSelectForm.industrialPlantSlct.value.toString());
	formData.append("processID", document.PlantToLineSelectForm.productionProcessSlct.value.toString());
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getproductionline",
		type: "POST",
		data: formData,
		//contentType: "application/json",
		//dataType: "json",
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		//processData: true,
		processData: false,
		contentType: false,
		success: function(dataRes) {

			$("#productionLineSlct").find('option').remove();
			$('#productionLineSlct').append(("<option value=" + "-1" + ">" + "全部产线"  + "</option>").toString());

			if(dataRes.status == 1) { 

				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#productionLineSlct').append(("<option value=" + models[i].id + ">" + models[i].name.toString()  + "</option>").toString());
				}
				$('#productionLineSlct').selectpicker('refresh');
				$('#productionLineSlct').selectpicker('render');  
				$('#productionLineSlct').selectpicker('hide');   
				// $('#productionLineSlct').selectpicker('mobile');
				queryDailyProductionWorkingLocationSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function queryDailyProductionWorkingLocationSlctFun() {
	var formData = new FormData();
	formData.append("plantID", document.PlantToLineSelectForm.industrialPlantSlct.value.toString());
	formData.append("processID", document.PlantToLineSelectForm.productionProcessSlct.value.toString());
	formData.append("lineID", document.PlantToLineSelectForm.productionLineSlct.value.toString());
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getworklocation",
		type: "POST",
		data: formData,
		//contentType: "application/json",
		//dataType: "json",
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		//processData: true,
		processData: false,
		contentType: false,
		success: function(dataRes) {

			$("#workingkLocationSlct").find('option').remove();

			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#workingkLocationSlct').append(("<option value=" + models[i].id +
						">" + models[i].name + "</option>").toString());
				}
				$('#workingkLocationSlct').selectpicker('refresh');
				$('#workingkLocationSlct').selectpicker('render');   
				$('#workingkLocationSlct').selectpicker('hide');   
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function getDailyProduction() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	if(document.PlantToLineSelectForm.queryType.value.toString() == 'byStaff' ||
		document.PlantToLineSelectForm.queryType.value.toString() == 'byStaffAndMaterial') {
		columnsArray.push({
			width: 300,
			"title": "员工",
			"field": "inputer"
		});
	}
	if(document.PlantToLineSelectForm.queryType.value.toString() == 'byLine') {
		columnsArray.push({
			width: 300,
			"title": "产线",
			"field": "inputLineID",
			formatter: function(value, row, index) {
				return $("#productionLineSlct option[value='" + row.inputLineID + "']").text();
			}
		});
	}
	if(document.PlantToLineSelectForm.queryType.value.toString() == 'byMaterial' ||
		document.PlantToLineSelectForm.queryType.value.toString() == 'byStaffAndMaterial') {
		columnsArray.push({
			width: 300,
			"title": "物料",
			"field": "materialNameInfo"
		});
	}
	if(document.PlantToLineSelectForm.queryType.value.toString() == 'byWorkingLocation') {
		columnsArray.push({
			width: 300,
			"title": "工位",
			"field": "inputWorkLocationID",
			formatter: function(value, row, index) {
				return $("#workingkLocationSlct option[value='" + row.inputWorkLocationID + "']").text();
			}
		});
	}

	columnsArray.push({
		width: 300,
		"title": "日期",
		"field": "orderDay"
	});
	console.log(document.PlantToLineSelectForm.queryType.value.toString().indexOf('And') );
	if(document.PlantToLineSelectForm.queryType.value.toString().indexOf('And') == -1) {
		columnsArray.push({
			width: 300,
			"title": "班次",
			"field": "orderHour"
		});
	}

	columnsArray.push({
		width: 300,
		"title": "总产量",
		"field": "sumProduction"
	});

	var urlStr = window.serviceIP + "/api/dashboard/getdailyproduction?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&queryTypeID=" + document.PlantToLineSelectForm.queryType.value.toString() +
		"&startTime=" + document.getElementById("startTime").value + " 02:00:00" + "&endTime=" + document.getElementById("endTime").value + " 23:00:00";

	$.ajax({
		url: urlStr,
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		processData: true,
		success: function(dataRes) {
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				$('#table').bootstrapTable('destroy').bootstrapTable({
					data: models,
					toolbar: '#toolbar',
					singleSelect: false,
					clickToSelect: true,
					sortName: "orderSplitid",
					sortOrder: "asc",
					pageSize: 15,
					pageNumber: 1,
					pageList: "[10, 25, 50, 100, All]",
					//showToggle: true,
					//showRefresh: true,
					//showColumns: true,
					//search: true,
					pagination: true,
					columns: columnsArray
				});

			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function getOrderInfoDetail() {

	//console.log("gainMaterialByQR" + recordID);
	var recordID = $('#subOrderName').val().trim();
	if(recordID.length < 2) {
		alert("请确认订单!")
		return;
	}

	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		"title": "工单号",
		"field": "subOrderID"
	});
	columnsArray.push({
		"title": "物料名称",
		"field": "materialNameInfo"
	});
	columnsArray.push({
		"title": "数量",
		"field": "number"
	});
	columnsArray.push({
		"title": "入库人员",
		"field": "inputer"
	});
	columnsArray.push({
		"title": "入库时间",
		"field": "inputTime",
		formatter: function(value, row, index) {
			console.log(value);
			if(value) {
				return(new Date(parseInt(value))).format("yyyy-MM-dd hh:mm");
			}

		}
	});
	columnsArray.push({
		"title": "出库人员",
		"field": "outputer"
	});
	columnsArray.push({
		"title": "出库时间",
		"field": "outputTime",
		formatter: function(value, row, index) {
			if(value) {
				return(new Date(parseInt(value))).format("yyyy-MM-dd hh:mm");
			}
		}
	});
	columnsArray.push({
		"title": "投入工单",
		"field": "expendOrderID"
	});

	$.ajax({
		url: window.serviceIP + "/api/material/getmaterialrecorddetailbysuborderid?subOrderID=" + recordID,
		type: "GET",
		processData: true,
		contentType: "application/json",
		dataType: "json",
		//data: formData,
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		//processData: true,
		success: function(dataRes) {
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");

				if(models.length < 1) {
					alert("未获取到物料信息,请核对!" + recordID);
					return;
				}
				$('#table').bootstrapTable('destroy').bootstrapTable({
					data: models,
					toolbar: '#usableMaterialTableToolbar',
					toolbarAlign: "left",
					singleSelect: true,
					clickToSelect: true,
					sortName: "orderSplitid",
					sortOrder: "asc",
					pageSize: 15,
					pageNumber: 1,
					pageList: "[10, 25, 50, 100, All]",
					//showToggle: true,
					//showRefresh: true,
					//showColumns: true,
					search: false,
					searchAlign: 'left',
					pagination: true,
					columns: columnsArray
				});

			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
}

//浇铸目前在窑中数据
function nowInDryingKilnjz() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
			"title": "硬化窑名称",
			"field": "dryingKilnName"
		});
	columnsArray.push({
			"title": "工单批次号",
			"field": "suborderID"
		});
	columnsArray.push({
			"title": "厂区",
			"field": "plantname"
		});
	columnsArray.push({
			"title": "产线",
			"field": "linename"
		});
	columnsArray.push({
			"title": "工位",
			"field": "workLocationName"
		});
	columnsArray.push({
			"title": "入窑人",
			"field": "inputerName"
		});
	columnsArray.push({
			"title": "入窑时间",
			"field": "inputTime"
		});
	columnsArray.push({
			"title": "入窑时间",
			"field": "inputTime"
		});
	columnsArray.push({
			"title": "入窑时间",
			"field": "inputTime"
		});
	columnsArray.push({
			"title": "物料类型",
			"field": "materialName"
		});
	columnsArray.push({
			"title": "物料数量",
			"field": "materialQuantity"
		});
	var urlStr = window.serviceIP + "/api/dashboard/nowInDryingKilnjz?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&queryTypeID=" + document.PlantToLineSelectForm.queryType.value.toString() +
		"&startTime=" + document.getElementById("startTime").value + " 02:00:00" + "&endTime=" + document.getElementById("endTime").value + " 23:00:00";

	$.ajax({
		url: urlStr,
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		processData: true,
		success: function(dataRes) {
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				$('#table').bootstrapTable('destroy').bootstrapTable({
					data: models,
					toolbar: '#toolbar',
					singleSelect: false,
					clickToSelect: true,
					sortName: "orderSplitid",
					sortOrder: "asc",
					pageSize: 15,
					pageNumber: 1,
					pageList: "[10, 25, 50, 100, All]",
					showToggle: true,
					showRefresh: true,
					//showColumns: true,
					search: true,
					pagination: true,
					columns: columnsArray
				});

			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};
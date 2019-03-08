
//获取全局token等信息，放入变量$Global_UserLogin_Info, app_login.html中login登陆方法初始赋值，用户首次登陆成功后设置放入localStorage
var $Global_UserLogin_Info = JSON.parse(localStorage.getItem('$Global_UserLogin_Info'));

function productionStatisticsPlantSlctFun(flag) {
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
				$('#industrialPlantSlct').selectpicker('mobile');

				if($Global_UserLogin_Info.plantID != null && $Global_UserLogin_Info.plantID != 'undefined' && $Global_UserLogin_Info.plantID.toString().length > 0) {
					var numbers = $('#industrialPlantSlct').find("option"); //获取select下拉框的所有值
					for(var j = 0; j < numbers.length; j++) {
						if($(numbers[j]).val().toString().split("###")[0] == $Global_UserLogin_Info.plantID) {
							$(numbers[j]).attr("selected", "selected");
							$('#industrialPlantSlct').selectpicker('hide');

							$("#industrialPlantLabel").css("display", "none");
						}
					}
					$('#industrialPlantSlct').selectpicker('refresh');
					$('#industrialPlantSlct').selectpicker('render'); 

				}

				if(flag = "1") {
					productionStatisBatteryTypeSlctFun();
					productionStatisticsProcessSlctFun();
				} else
					productionStatisticsLineSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
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
				$('#batterytype').selectpicker('mobile');
				$('#batterytype').selectpicker('hide');
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	}); 
};

function productionStatisticsProcessSlctFun() {
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
				$('#productionProcessSlct').selectpicker('mobile');

				if($Global_UserLogin_Info.processID != null && $Global_UserLogin_Info.processID != 'undefined' && $Global_UserLogin_Info.processID.toString().length > 0) {
					var numbers = $('#productionProcessSlct').find("option"); //获取select下拉框的所有值
					for(var j = 0; j < numbers.length; j++) {
						if($(numbers[j]).val().toString().split("###")[0] == $Global_UserLogin_Info.processID) {
							$(numbers[j]).attr("selected", "selected");
							$('#productionProcessSlct').selectpicker('hide');

							$("#productionProcessLabel").css("display", "none");
						}
					}
					$('#productionProcessSlct').selectpicker('refresh');
					$('#productionProcessSlct').selectpicker('render'); 

				}

				productionStatisticsLineSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function productionStatisticsLineSlctFun() {
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
				$('#productionLineSlct').selectpicker('mobile');

			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function productionOutputStatistics() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		width: 300,
		"title": "产线",
		"field": "lineName"
	});
	columnsArray.push({
		width: 300,
		"title": "物料名称",
		"field": "materialName"
	});
	columnsArray.push({
		width: 300,
		"title": "总产量",
		"field": "outputTotal"
	});

	var urlStr = window.serviceIP + "/api/material/orderoutputstatistics?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&lineID=" + document.PlantToLineSelectForm.productionLineSlct.value.toString() +
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

function remnantProductStatistics() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		width: 300,
		"title": "物料名称",
		"field": "name"
	});
	columnsArray.push({
		width: 300,
		"title": "剩余数量",
		"field": "remnantTotalNum"
	});

var endTime = new Date(document.getElementById("endTime").value);
endTime.setDate(endTime.getDate() + 1)
	var urlStr = window.serviceIP + "/api/material/orderremnantproductstatistics?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&lineID=" + document.PlantToLineSelectForm.productionLineSlct.value.toString() +
		"&startTime=" + document.getElementById("startTime").value + " 07:00:00"+ "&endTime=" + endTime.format("yyyy-MM-dd") + " 06:59:59";

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
}

function batteryStatisInventory() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		"title": "盘点时间",
		"field": "updatetime"
	});
	columnsArray.push({
		"title": "电池型号",
		"field": "电池型号",
		formatter: function(value, row, index) {
			return $("#batterytype option[value='" + row.batterytype + "']").text();
		}
	});
	columnsArray.push({
		"title": "batterytype",
		"field": "batterytype",
		visible: false
	});
	columnsArray.push({
		"title": "最新库存",
		"field": "currentstorage"
	});
	columnsArray.push({
		"title": "上次结余",
		"field": "laststorage"
	});
	columnsArray.push({
		"title": "生产入库",
		"field": "dailyproduction"
	});
	columnsArray.push({
		"title": "发货出库",
		"field": "dailyshipmentsnum"
	});
	columnsArray.push({
		"title": "报废数量",
		"field": "scrapnum"
	});
	columnsArray.push({
		"title": "报修数量",
		"field": "repairnum"
	});
	columnsArray.push({
		"title": "维修入库",
		"field": "repairbacknum"
	});

	columnsArray.push({
		"title": "借出数量",
		"field": "loannum"
	});
	columnsArray.push({
		"title": "借入数量",
		"field": "borrownum"
	});
	var endTime = new Date(document.getElementById("endTime").value);
endTime.setDate(endTime.getDate() + 1)
	var urlStr = window.serviceIP + "/api/material/batterystatisinventory?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&lineID=" + document.PlantToLineSelectForm.productionLineSlct.value.toString() +
		"&startTime=" + document.getElementById("startTime").value + " 12:00:00" + "&endTime=" +  endTime.format("yyyy-MM-dd") + " 06:59:59";

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
}

function grantAndExpendStatistics() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		width: 300,
		"title": "物料名称",
		"field": "name"
	});
	columnsArray.push({
		width: 300,
		"title": "领取数量",
		"field": "grantNum"
	});
	columnsArray.push({
		width: 300,
		"title": "投料数量",
		"field": "expendNum"
	});

	var urlStr = window.serviceIP + "/api/material/grantdndexpendstatistics?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&startTime=" + document.getElementById("startTime").value + " 00:00:00" + "&endTime=" + document.getElementById("endTime").value + " 23:59:59";

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
}

function getMaterialInventoryStatistics() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		"title": "物料名称",
		"field": "name"
	});
	columnsArray.push({
		"title": "当前数量",
		"field": "currentNum"
	});
	columnsArray.push({
		"title": "上次结余",
		"field": "lastStorage"
	});
	columnsArray.push({
		"title": "生产入库",
		"field": "productionNum"
	});
	columnsArray.push({
		"title": "其他入库",
		"field": "inNum"
	});
	columnsArray.push({
		"title": "发料数量",
		"field": "expendNum"
	});
	columnsArray.push({
		"title": "其他出库",
		"field": "outNum"
	});
	columnsArray.push({
		"title": "盘点时间",
		"field": "updateTime"
	});

	var endTime = new Date(document.getElementById("endTime").value);
endTime.setDate(endTime.getDate() + 1)

	var urlStr = window.serviceIP + "/api/material/getmaterialinventorystatistics?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&startTime=" + document.getElementById("startTime").value + " 12:00:00"+ "&endTime=" +  endTime.format("yyyy-MM-dd") + " 06:59:59";

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
}

function getSecondaryMaterialInventoryStatistics() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		"title": "物料名称",
		"field": "name"
	});
	columnsArray.push({
		"title": "当前数量",
		"field": "currentNum"
	});
	columnsArray.push({
		"title": "上次结余",
		"field": "lastStorage"
	});
	columnsArray.push({
		"title": "领料入库",
		"field": "gainNum"
	});
	columnsArray.push({
		"title": "其他入库",
		"field": "inNum"
	});
	columnsArray.push({
		"title": "投料数量",
		"field": "expendNum"
	});
	columnsArray.push({
		"title": "其他出库",
		"field": "outNum"
	});
	columnsArray.push({
		"title": "盘点时间",
		"field": "updateTime"
	});
var endTime = new Date(document.getElementById("endTime").value);
endTime.setDate(endTime.getDate() + 1)
	var urlStr = window.serviceIP + "/api/material/getsecondarymaterialinventorystatistics?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&startTime=" + document.getElementById("startTime").value + " 12:00:00"+ "&endTime=" +  endTime.format("yyyy-MM-dd") + " 06:59:59";

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
}

function closeQRScanProductionStatistics() {
	$("#myModal").modal('hide');
}
var canvasProductionStatistics = null,
	contextProductionStatistics = null,
	videoProductionStatistics = null;  
var mediaStreamTrackProductionStatistics = null;   

//扫描二维码发料调用方法
function findProductionStatisticsByQR(recordID) {

//	$("#myModal").modal('hide');

	if(recordID.length < 2) {
		alert("请确认已选择物料!")
		return;
	}
	if(document.PlantToLineSelectForm.productionProcessSlct.value.toString() != windowProcessEnum.ZH) {
		alert("当前只有铸焊工段有发料功能!");
		return;
	}
	if(!window.changeConfirmDlg("确认发料?")) {
		return;
	}

	var formData = new FormData();
	formData.append("operator", $Global_UserLogin_Info.username) //$Global_UserLogin_Info.username;
	formData.append("orderSplitID", recordID);
	if($('#ProductionStatisticsScanQRForm #ProductionStatisticsScanQRType').html() == '1') {
		formData.append("orderType", '1');
	} else if($('#ProductionStatisticsScanQRForm #ProductionStatisticsScanQRType').html() == '2') {
		formData.append("orderType", '2');
	} else {
		alert("发料类型获取失败,请刷新页面重试!");
		return;
	}
	$.ajax({
		url: window.serviceIP + "/api/material/addgrantmaterialrecord",
		type: "POST",
		processData: false,
		contentType: false,
		data: formData,
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		//processData: true,
		success: function(dataRes) {
			if(dataRes.status == 1) { 
				grantMaterialDetail();
				alert("发料成功！");
			} else {
				alert("发料失败！" + dataRes.message);
			}
		}
	});
}


function ShowmyModal(ScanQRType){
	alert(ScanQRType)
	$('#ProductionStatisticsScanQRForm #ProductionStatisticsScanQRType').html() == ScanQRType;
	$("#myModal").modal('show');
}

//按条码发料按钮执行方法
function grantMaterialByInputID(ScanQRType) {

//	$("#myModal").modal('hide');

	if($('#grantMaterialOrderInputID').val().trim().length < 2) {
		alert("请确认已输入ID!")
		return;
	}
	if(document.PlantToLineSelectForm.productionProcessSlct.value.toString() != windowProcessEnum.ZH) {
		alert("当前只有铸焊工段有发料功能!");
		return;
	}
	if(!window.changeConfirmDlg("确认发料?")) {
		return;
	}
	var formData = new FormData();
	formData.append("operator", $Global_UserLogin_Info.username) //$Global_UserLogin_Info.username;
	formData.append("orderSplitID", $('#grantMaterialOrderInputID').val().trim());
	if(ScanQRType == '1') {
		formData.append("orderType", '3');
	} else if(ScanQRType == '2') {
		formData.append("orderType", '4');
	} else {
		alert("发料类型获取失败,请刷新页面重试!");
		return;
	}
	$.ajax({
		url: window.serviceIP + "/api/material/addgrantmaterialrecord",
		type: "POST",
		processData: false,
		contentType: false,
		data: formData,
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		//processData: true,
		success: function(dataRes) {
			if(dataRes.status == 1) { 
				grantMaterialDetail();
				alert("发料成功！");
			} else {
				alert("发料失败！" + dataRes.message);
			}
		}
	});
}

//function startScanQRProductionStatistics() {
//	if(contextProductionStatistics) {         
//		contextProductionStatistics.drawImage(videoProductionStatistics, 0, 0, 320, 320);               
//		if(canvasProductionStatistics != null) {            //以下开始编 数据  
//			var imgData = canvasProductionStatistics.toDataURL("image/jpeg");            //将图像转换为base64数据
//			qrcode.decode(imgData);             
//			qrcode.callback = function(imgMsg) {
//				if(imgMsg != null && imgMsg.trim().length > 1 && imgMsg.toString().indexOf("error decoding") == -1) {
//					alert(imgMsg)
//					findProductionStatisticsByQR(imgMsg);
//				} else {
//					setTimeout(startScanQRProductionStatistics(), 500);
//				}
//			}       
//		}          
//	}  
//}

//
var accept_paramQR = null;
function ProductionStatisticsScanQR(paramQR) {
	//执行H5扫描二维码方法
	openBarcode();
	
//	findProductionStatisticsByQR(imgMsg);
	
	
//	startScanQRProductionStatistics()
	
	//扫描二维码后执行龙森的方法
//	startScanQR(webName);
//	accept_webName = webName;
	
	
	
	alert('ProductionStatisticsScanQR')
//	$('#myModal').modal('show');
//
//	$('#ProductionStatisticsScanQRForm #ProductionStatisticsScanQRType').html(paramQR);
//	//alert(paramQR + "   " + $('#ProductionStatisticsScanQRForm #ProductionStatisticsScanQRType').html());
//	if(contextProductionStatistics == null) { 
//		//window.addEventListener("DOMContentLoaded", function() {       
//		try {    
//
//			canvasProductionStatistics = document.getElementById("canvasProductionStatisticsScanQR");           
//			contextProductionStatistics = canvasProductionStatistics.getContext("2d");           
//			videoProductionStatistics = document.getElementById("videoProductionStatisticsScanQR");           
//			var videoObj = {
//				audio: false,
//				"video": true
//			};              
//			//			var videoObj = {
//			//				"video": true
//			//			};    
//			var  flag = true;             
//			var   MediaErr = function(error) {                   
//				flag = false;                   
//				if(error.PERMISSION_DENIED) {                       
//					alert('用户拒绝了浏览器请求媒体的权限', '提示');                   
//				} else if(error.NOT_SUPPORTED_ERROR) {                       
//					alert('对不起，您的浏览器不支持拍照功能，请使用其他浏览器', '提示');                   
//				} else if(error.MANDATORY_UNSATISFIED_ERROR) {                       
//					alert('指定的媒体类型未接收到媒体流', '提示');                   
//				} else {                       
//					alert('系统未能获取到摄像头，请确保摄像头已正确安装。或尝试刷新页面，重试!' + error.name + ": " + error.message, '提示');                   
//				}               
//			};            //获取媒体的兼容代码，目前只支持（Firefox,Chrome,Opera）
//			      
//
//			  
//			if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia()) {                //qq浏览器不支持
//				 
//				try {  
//					navigator.mediaDevices.getUserMedia(videoObj).then(function(stream) { 
//						//mediaStreamTrack = stream;                  
//						//video.src = window.URL.createObjectURL(stream);;                   
//						//video.play();
//						//mediaStreamTrackProductionStatistics = stream;  
//						videoProductionStatistics.srcObject = stream;
//						videoProductionStatistics.onloadedmetadata = function(e) {
//							videoProductionStatistics.play();
//						};
//					}, MediaErr);   
//				} catch(err) {
//					alert(err);
//				}        
//			}    
//			else if(navigator.getUserMedia) { // Standard   
//				navigator.getUserMedia(videoObj, function(stream) {   
//					//mediaStreamTrackProductionStatistics = stream;       
//					videoProductionStatistics.src = stream;
//					videoProductionStatistics.play();
//				}, MediaErr);
//			}           
//			else if(navigator.webkitGetUserMedia) {              
//				navigator.webkitGetUserMedia(videoObj, function(stream) {  
//					mediaStreamTrackProductionStatistics = stream;                  
//					videoProductionStatistics.src = window.webkitURL.createObjectURL(stream);                   
//					videoProductionStatistics.play();      
//				}, MediaErr);           
//			}       
//			else if(navigator.mozGetUserMedia) {              
//				navigator.mozGetUserMedia(videoObj, function(stream) { 
//					mediaStreamTrackProductionStatistics = stream;                   
//					videoProductionStatistics.src = window.URL.createObjectURL(stream);                   
//					videoProductionStatistics.play();               
//				}, MediaErr);           
//			}           
//			else if(navigator.msGetUserMedia) {           
//				navigator.msGetUserMedia(videoObj, function(stream) { 
//					mediaStreamTrackProductionStatistics = stream;                   
//					$(document).scrollTop($(window).height());                   
//					videoProductionStatistics.src = window.URL.createObjectURL(stream);                   
//					videoProductionStatistics.play();               
//				}, MediaErr);           
//			} else {               
//				alert('对不起，您的浏览器不支持拍照功能，请使用其他浏览器');               
//				return false;           
//			}           
//			if(flag) {                // alert('为了获得更准确的测试结果，请尽量将二维码置于框中，然后进行拍摄、扫描。 请确保浏览器有权限使用摄像功能');
//				          }            //这个是拍照按钮的事件，
//			           
//
//			//				$("#snap").click(function() {
//			//					startPat();
//			//				}).show();       
//		} catch(e) {           
//			//printHtml("浏览器不支持HTML5 CANVAS");       
//		}   
//		//}, false);    //打印内容到页面
//	} 
//	//console.log("start");
//	setTimeout(startScanQRProductionStatistics(), 1000) ; 
}

function grantMaterialDetail() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		"title": "物料名称",
		"field": "name"
	});
	columnsArray.push({
		"title": "工单号",
		"field": "orderName"
	});
	columnsArray.push({
		"title": "数量",
		"field": "number"
	});
	columnsArray.push({
		"title": "发料人",
		"field": "operator"
	});
	columnsArray.push({
		"title": "发料时间",
		"field": "grantTime"
	});

	var urlStr = window.serviceIP + "/api/material/getgrantmaterialrecord?plantID=" + document.PlantToLineSelectForm.industrialPlantSlct.value.toString() +
		"&processID=" + document.PlantToLineSelectForm.productionProcessSlct.value.toString() +
		"&startTime=" + document.getElementById("startTime").value + " 00:00:00" + "&endTime=" + document.getElementById("endTime").value + " 23:59:59";

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
}




////////以下是H5+调用摄像头进行扫一扫
// alert(openBarcode())
var img = null;
				var blist = [];
				function scaned(t, r, f){
					// alert('t='+t+'r='+r+'f='+f);
					//获取扫描二维码信息后执行龙森方法
					findProductionStatisticsByQR(r);
//					recognitionQR(accept_webName, r);
// 					var d = new Date();
// 					var h=d.getHours(),m=d.getMinutes(),s=d.getSeconds(),ms=d.getMilliseconds();
// 					if(h < 10){ h='0'+h; }
// 					if(m < 10){ m='0'+m; }
// 					if(s < 10){ s='0'+s; }
// 					if(ms < 10){ ms='00'+ms; }
// 					else if(ms < 100){ ms='0'+ms; }
// 					var ts = '['+h+':'+m+':'+s+'.'+ms+']';
// 					var li=null,hl = document.getElementById('history');
// 					if(blist.length > 0){
// 						li = document.createElement('li');
// 						li.className = 'ditem';
// 						hl.insertBefore(li, hl.childNodes[0]);
// 					} else{
// 						li = document.getElementById('nohistory');
// 					}
// 					li.id = blist.length;
// 					var html = '['+h+':'+m+':'+s+'.'+ms+']'+'　　'+t+'码<div class="hdata">';
// 					html += r;
// 					html += '</div>';
// 					li.innerHTML = html;
// 					li.setAttribute('onclick', 'selected(id)');
// 					blist[blist.length] = {type:t,result:r,file:f};
// 					update(t, r, f);
					
				}
				function selected(id){
					var h = blist[id];
					update( h.type, h.result, h.file );
					if(h.result.indexOf('http://')==0  || h.result.indexOf('https://')==0){
						plus.nativeUI.confirm(h.result, function(i){
							if(i.index == 0){
								plus.runtime.openURL(h.result);
							}
						}, '', ['打开', '取消']);
					} else{
						plus.nativeUI.alert(h.result);
					}
				}
				function update(t, r, f){
					outSet('扫描成功：');
					outLine(t);
					outLine(r);
					outLine('\n图片地址：'+f);
					if(!f || f=='null'){
						img.src = '../../vendor/H5+/img/barcode.png';	
					} else{
						plus.io.resolveLocalFileSystemURL(f, function(entry){
							img.src=entry.toLocalURL();
						});
						//img.src = 'http://localhost:13131/'+f;
					}
				}
				function onempty(){
					if(window.plus){
						plus.nativeUI.alert('无扫描记录');
					} else {
						alert('无扫描记录');
					}
				}
				function cleanHistroy(){
					if(blist.length > 0){
						var hl = document.getElementById('history');
						hl.innerHTML = '<li id="nohistory" class="ditem" onclick="onempty();">无历史记录	</li>';
					}
					plus.io.resolveLocalFileSystemURL('_doc/barcode/', function(entry){
						entry.removeRecursively(function(){
							// Success
						}, function(e){
							//alert( "failed"+e.message );
						});
					});
				}
				// 打开二维码扫描界面 
				function openBarcode(){
					createWithoutTitle('barcode_scan.html', {
						titleNView:{
							type: 'float',
							backgroundColor: 'rgba(215,75,40,0.3)',
							titleText: '扫一扫',
							titleColor: '#FFFFFF',
							autoBackButton: true,
							buttons: [{
								fontSrc: '_www/helloh5.ttf',
								text: '相册',
								fontSize: '18px',
								onclick: 'javascript:scanPicture()'
							}]
						}
					});
				}
				// 打开自定义扫描界面 
				function openBarcodeCustom(){
					createWithoutTitle('barcode_custom.html', {
						titleNView:{
							type: 'float',
							backgroundColor: 'rgba(215,75,40,0.3)',
							titleText: '扫一扫',
							titleColor: '#FFFFFF',
							autoBackButton: true,
							buttons: [{
								// fontSrc: '_www/helloh5.ttf',
								text: '相册',
								fontSize: '18px',
								onclick: 'javascript:switchFlash()'
							}]
						}
					});
				}
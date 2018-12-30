function subOrderIndustrialPlantSlctFun() {
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
			//console.log(dataRes);
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#industrialPlantSlct').append(("<option value=" + models[i].id.toString() + ">" + models[i].name.toString()  + "</option>").toString())

				}
				$('#industrialPlantSlct').selectpicker('refresh');
				$('#industrialPlantSlct').selectpicker('render');   
				$('#industrialPlantSlct').selectpicker('mobile');
				subOrderProductionLineSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function subOrderProductionProcessSlctFun() {
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
					$('#productionProcessSlct').append(("<option value=" + models[i].id.toString() + ">" + models[i].name.toString()  + "</option>").toString())
				}
				//console.log($('#productionProcessSlct'));
				$('#productionProcessSlct').selectpicker('refresh');
				$('#productionProcessSlct').selectpicker('render');   
				$('#productionProcessSlct').selectpicker('mobile');
				subOrderProductionLineSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function subOrderProductionLineSlctFun() {
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

			if(dataRes.status == 1) { 

				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#productionLineSlct').append(("<option value=" + models[i].id.toString() + ">" + models[i].name.toString()  + "</option>").toString());
				}
				$('#productionLineSlct').selectpicker('refresh');
				$('#productionLineSlct').selectpicker('render');   
				$('#productionLineSlct').selectpicker('mobile');
				lineWorkOrderSlct();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function lineWorkOrderSlct() {
	//	return true;
	//	if(!($.isEmptyObject(first)) && first.toString().length > 1) {
	//
	//		return;
	//	}
	//var formData = new FormData();
	//formData.append("lineID", document.PlantToLineSelectForm.productionLineSlct.value.toString());
	//alert("订单选择");
	$.ajax({
		url: window.serviceIP + "/api/order/getworkorderbylineid?lineID=" + document.PlantToLineSelectForm.productionLineSlct.value.toString(),
		type: "GET",
		contentType: "application/json",
		dataType: "json",
		//data: formData,
		//contentType: "application/json",
		//dataType: "json",
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		//async: false,
		processData: true,
		//contentType: false,
		success: function(dataRes) {

			$("#workOrderSlct").find('option').remove();

			if(dataRes.status == 1) { 

				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#workOrderSlct').append(("<option value=" + models[i].id.toString() + ">" + models[i].orderid.toString()  + "</option>").toString())

				}
				$('#workOrderSlct').selectpicker('refresh');
				$('#workOrderSlct').selectpicker('render');   
				$('#workOrderSlct').selectpicker('mobile');
				SelectWorkOrderFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function FinishSubOrder() {
	//使用getSelections即可获得，row是json格式的数据
	var row = $.map($('#table').bootstrapTable('getSelections'), function(row) {
		return row;
	});
	var formData = new FormData();
	if(row.length < 1) {
		alert("请选择行数据!");
		return;
	}
	for(var key in row[0]) {
		if(key == 0) {
			continue;
		}
		if(key == "status") {
			formData.append(key, "3");
		} else {
			formData.append(key, row[0][key]);
		}
		//$("#workOrderManageForm" + " #" + key).attr("value", row[0][key]);
	}
	$.ajax({
		url: window.serviceIP + "/api/order/finishordersplit",
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		data: window.getFormDataToJson(formData),
		//		headers: {
		//			Token: $.cookie('token')
		//		},
		success: function(data) {
			if(data.status == 1) {
				alert('保存成功!');
				SelectSubOrder()

			} else {
				alert("保存失败！" + data.message);
			}
		}
	});
};

function SelectWorkOrderFun() {
	SelectSubOrder();
	SelectMaterialRecord();
}

function SelectSubOrder() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		"title": "工单号",
		"field": "ordersplitid"
	});
	columnsArray.push({
		"title": "产品",
		"field": "materialid"
	});
	columnsArray.push({
		"title": "产量",
		"field": "productionnum"
	});
	columnsArray.push({
		"title": "状态",
		"field": "status"
	});
	columnsArray.push({
		"title": "id",
		"field": "id",
		visible: false
	});
	columnsArray.push({
		"title": "orderid",
		"field": "orderid",
		visible: false
	});
	$.ajax({
		url: window.serviceIP + "/api/order/getordersplit?orderID=" + document.PlantToLineSelectForm.workOrderSlct.value.toString(),
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

function SelectMaterialRecord() {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		"title": "物料号",
		"field": "materialID"
	});
	columnsArray.push({
		"title": "物料工单",
		"field": "orderID"
	});
	columnsArray.push({
		"title": "物料子工单",
		"field": "subOrderID"
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
		"field": "inputtime"
	});
	columnsArray.push({
		"title": "领用人",
		"field": "outputer"
	});
	columnsArray.push({
		"title": "领用时间",
		"field": "outputtime"
	});
	columnsArray.push({
		"title": "id",
		"field": "id",
		visible: false
	});
	columnsArray.push({
		"title": "expendOrderid",
		"field": "expendOrderid",
		visible: false
	});
	$.ajax({
		url: window.serviceIP + "/api/material/getmaterialrecord?expendOrderID=" + document.PlantToLineSelectForm.workOrderSlct.value.toString(),
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

				$('#materialTable').bootstrapTable('destroy').bootstrapTable({
					data: models,
					toolbar: '#materialidToolbar',
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

function getUsableMaterialFun() {
	var formData = new FormData();
	formData.append("plantID", document.PlantToLineSelectForm.industrialPlantSlct.value.toString())
	formData.append("materialID", $("#table").bootstrapTable('getData')[0].materialid)
	//$('#table').dataTable().row.data();

	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		"title": "物料号",
		"field": "materialID"
	});
	columnsArray.push({
		"title": "物料工单",
		"field": "orderID"
	});
	columnsArray.push({
		"title": "物料子工单",
		"field": "subOrderID"
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
		"field": "inputtime"
	});
	columnsArray.push({
		"title": "id",
		"field": "id",
		visible: false
	});
	$.ajax({
		url: window.serviceIP + "/api/material/getusablematerial",
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
				var models = eval("(" + dataRes.data + ")");

				$('#usableMaterialTable').bootstrapTable('destroy').bootstrapTable({
					data: models,
					//toolbar: '#materialidToolbar',
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

function gainMaterialRecord() {
	var formData = new FormData();
	var selectRow = $("#usableMaterialTable").bootstrapTable('getSelections');
	var arrayObj = new Array();
	for(var i = 0; i < selectRow.length; i++) {
		arrayObj.push(selectRow[i].id);
	}

	formData.append("materialIDListStr", JSON.stringify(arrayObj));

	formData.append("expendOrderID", document.PlantToLineSelectForm.workOrderSlct.value.toString());
	formData.append("outputter", "lls") //$.cookie('username');
	$.ajax({
		url: window.serviceIP + "/api/material/gainmaterialrecord",
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
				getUsableMaterialFun();
				SelectMaterialRecord();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
}

function createQRCode() {
	var row = $.map($('#table').bootstrapTable('getSelections'), function(row) {
		return row;
	});
	if(row.length < 1) {
		alert("请选择行数据!");
		return;
	}
	$("#codeHtml").html('<div id="QRCode" ></div>');
	jQuery('#QRCode').qrcode({
		//render: "canva",
		render: "canvas",
		 width: 100, //宽度
         height:100, //高度
		text: row[0]["id"]
	});
}

function printQRCode() {
	createQRCode();
	var img = document.getElementById("QRImage"); /// get image element
	var canvas = document.getElementsByTagName("canvas")[0]; /// get canvas element
	img.src = canvas.toDataURL(); /// update image
document.getElementById("QRImage").style.display="block";
	$("#QRImage").jqprint({
		debug: false,
		importCSS: true,
		printContainer: true,
		operaSupport: false
	});
	document.getElementById("QRImage").style.display="none";
}
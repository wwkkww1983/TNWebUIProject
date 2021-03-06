function LSworkOrderIndustrialPlantSlctFun(flag) {
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getindustrialplant",
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		processData: true,
		success: function(dataRes) {

			$("#industrialplant_id").find('option').remove();
			$('#industrialplant_id').append(("<option value=''>" + "全部"  + "</option>").toString());
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#industrialplant_id').append(("<option value=" + models[i].id +">" + models[i].name.toString()  + "</option>").toString())
				}
				$('#industrialplant_id').selectpicker('refresh');
				$('#industrialplant_id').selectpicker('render');   
				// $('#industrialplant_id').selectpicker('mobile');
				if(flag = "1")
					LSworkOrderProductionProcessSlctFun();
				else
					LSworkOrderProductionLineSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function LSworkOrderProductionProcessSlctFun() {
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getproductionprocess",
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		processData: true,
		success: function(dataRes) {
			$("#productionprocess_id").find('option').remove();
			$('#productionprocess_id').append(("<option value=''>" + "全部流程"  + "</option>").toString());
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#productionprocess_id').append(("<option value=" + models[i].id + ">" + models[i].name.toString()  + "</option>").toString())
				}
				//console.log($('#productionprocess_id'));
				$('#productionprocess_id').selectpicker('refresh');
				$('#productionprocess_id').selectpicker('render');   
				// $('#productionprocess_id').selectpicker('mobile');
				LSworkOrderProductionLineSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function LSworkOrderProductionLineSlctFun() {
	//	return true;
	//	if(!($.isEmptyObject(first)) && first.toString().length > 1) {
	//
	//		return;
	//	}
	//alert("生产线选择");
	var formData = new FormData();
	formData.append("plantID", document.addUserForm.industrialplant_id.value.toString().split("###")[0]);
	formData.append("processID", document.addUserForm.productionprocess_id.value.toString().split("###")[0]);
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getproductionline",
		type: "POST",
		data: formData,
		//contentType: "application/json",
		//dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		//processData: true,
		processData: false,
		contentType: false,
		success: function(dataRes) {

			$("#productionline_id").find('option').remove();
			$('#productionline_id').append(("<option value=" + "-1" + ">" + "全部产线"  + "</option>").toString());

			if(dataRes.status == 1) { 

				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#productionline_id').append(("<option value=" + models[i].id + ">" + models[i].name.toString()  + "</option>").toString());
				}
				$('#productionline_id').selectpicker('refresh');
				$('#productionline_id').selectpicker('render');   
				// $('#productionline_id').selectpicker('mobile');
//				LSgetWorkOrder();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};


function LSsetLineModal() {
	$("#lineid").find('option').remove();

	$("#productionline_id option").each(function() {
		if($(this).val() == "-1") {
			return;
		}
		$('#lineid').append(("<option value=" + $(this).val() + ">" + $(this).text()  + "</option>").toString());
	})
	$('#lineid').selectpicker('refresh');
	$('#lineid').selectpicker('render'); 
	// $('#lineid').selectpicker('mobile');

	$('#status').selectpicker('refresh');
	$('#status').selectpicker('render'); 
	// $('#status').selectpicker('mobile');
	$('#status').selectpicker('hide');

	$('#workshift').selectpicker('refresh');
	$('#workshift').selectpicker('render'); 
	// $('#workshift').selectpicker('mobile');

	$.ajax({
		url: window.serviceIP + "/api/basicdata/getmaterialbyprocess?processID=" +
			document.addUserForm.productionprocess_id.value.toString().split("###")[0],
		type: "GET",

		//contentType: "application/json",
		//dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		//processData: true,
		processData: false,
		contentType: false,
		async: false,
		success: function(dataRes) {

			$("#materialid").find('option').remove();

			if(dataRes.status == 1) { 

				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#materialid').append(("<option value=" + models[i].id + ">" + models[i].name.toString()  + "###" + models[i].eachbatchnumber + "</option>").toString());
				}
				$('#materialid').selectpicker('refresh');
				$('#materialid').selectpicker('render');   
				// $('#materialid').selectpicker('mobile');

			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	}); 
};

function LScreateWorkOrderID() {
	//console.log()
	//alert(document.workOrderManageForm.lineWorkOrderModal.value);
	//document.workOrderManageForm.lineWorkOrderModal.value.toString().split("###")[1];

	var orderID = document.addUserForm.industrialplant_id.value.toString().split("###")[1];
	orderID += document.addUserForm.productionprocess_id.value.toString().split("###")[1];
	orderID += $("#workOrderManageForm" + " #lineid").find("option:selected").selectpicker('val').get('0').value.split("###")[1];
	orderID += $("#workOrderManageForm" + " #workshift").find("option:selected").selectpicker('val').get('0').value;

	orderID += window.stringToDatetimeLocalType(document.getElementById("scheduledstarttime").value, "yyyyMMdd");
	return orderID;
}

function LSlineWorkOrderModalChange() {
	var newOrder = createWorkOrderID();
	$("#workOrderManageForm" + " #orderid").val(newOrder.toString());
}

function LSselectedWorkOrderRow(param) {

	//使用getSelections即可获得，row是json格式的数据
	//	var row1 = $.map($('#table').bootstrapTable('getSelections'), function(row) {
	//		return row;
	//	});
	var optionType = param.getAttribute("id");
	var row = workOrderSelectedRow;
	if(optionType == "workorder_scrap") {
		if(row["status"] > windowOrderStatusEnum.doing) {
			alert("该工单未在生产状态,不能报废!");
			return;
		}
		LScreateScrapModel();
		return;
	}
	setLineModal();

	if(optionType == "workorder_add") {
		//document.getElementById("workOrderManageForm").reset();

		//$(workOrderManageForm.elements).each(function() {
		//			$(this).attr('disabled', false);
		//		});
		$(workOrderManageForm.elements).each(function() {
			if($(this).attr("name") != "orderid")
				$(this).attr('readonly', false);
		});
		$("#workOrderManageForm" + " #orderid").val(createWorkOrderID());
		$("#workOrderManageForm" + " #plantid").val(document.addUserForm.industrialplant_id.value.toString());
		$("#workOrderManageForm" + " #processid").val(document.addUserForm.productionprocess_id.value.toString());
		//$("#workOrderManageForm" + " #lineid").val(document.addUserForm.productionline_id.value.toString());
		$("#workOrderManageForm" + " #scheduledstarttime").val(window.stringToDatetimeLocalType(new Date(), "yyyy-MM-dd"));
		LSlineWorkOrderModalChange();

		$('#myModal').modal('show');
	} else if(optionType == "workorder_edit") {
		if(row == null || row == 'undefined' || row.length < 1) {
			alert("请选择行数据!");
			return;
		}
		//console.log(row);
		if(row["status"] != windowOrderStatusEnum.ordered) {
			alert("该工单已进入生产,不能修改!");
			return;
		}
		for(var key in row) {
			//alert(key +" " +row[key] );
			if(key == 0) {
				continue;
			}
			if(key != "status" && key != "scrapnum") {
				$("#workOrderManageForm" + " #" + key).attr('readonly', true);
			}
			if(key == "scheduledstarttime") {
				$("#workOrderManageForm" + " #" + key).val(window.stringToDatetimeLocalType(row[key], "yyyy-MM-dd"));
				var shiftName = "BB";

				if(window.stringToDatetimeLocalType(row[key], "hh") == "19") {
					shiftName = "YB";
				}
				var numbers = $("#workOrderManageForm" + " #workshift").find("option"); //获取select下拉框的所有值
				for(var j = 0; j < numbers.length; j++) {
					if($(numbers[j]).val().toString() == shiftName) {
						$(numbers[j]).attr("selected", "selected");
					}
				}
				$('#workshift').selectpicker('refresh');
				$('#workshift').selectpicker('render'); 
				$("#workOrderManageForm" + " #workshift").attr('readonly', 'true');
				continue;
			}
			if(key == "status" || key == "lineid" || key == "materialid") {
				//				$("#workOrderManageForm" + " #" + key).selectpicker('deselectAll');
				var numbers = $("#workOrderManageForm" + " #" + key).find("option"); //获取select下拉框的所有值
				for(var j = 0; j < numbers.length; j++) {
					//console.log($(numbers[j]).val().toString().split("###")[0] + " ==== " + row[key]);
					if($(numbers[j]).val().toString().split("###")[0] == row[key]) {
						$(numbers[j]).attr("selected", "selected");
						//$(numbers[j]).selected = true;
					}
				}
				$('#' + key).selectpicker('refresh');
				$('#' + key).selectpicker('render'); 
				continue;
				// $("#workOrderManageForm" + " #" + key).selectpicker('val',"");
			}
			$("#workOrderManageForm" + " #" + key).val(row[key]);

			//$("#workOrderManageForm" + " #" + key).attr("value", row[key]);
		}

		$('#myModal').modal('show');
	} else if(optionType == "workorder_delete") {
		if(row.length < 1) {
			alert("请选择行数据!");
			return;
		}
		LSdeleteWorkOrder(row[0]["id"]);
	}
};

function LSdeleteWorkOrder(orderid) {

}

function LSsaveWorkOrderChange() {

	if(isNaN(parseInt($("#batchnum").val())) || parseInt($("#batchnum").val()) < 1) {
		alert("请正确输入批次数量!");
		return;
	}
	if(isNaN(parseInt($("#totalproduction").val())) || parseInt($("#totalproduction").val()) < 1) {
		alert("请正确输入生产总量!");
		return;
	}
	if($("#materialid").val() == "undefind" || $("#materialid").val() < 1 || $("#materialid").val() == "null") {
		alert("未选择输出物料!");
		return;
	}
	if($("#lineid").val() == "undefind" || $("#lineid").val() < 1 || $("#lineid").val() == "null") {
		alert("未选择产线!");
		return;
	}
	var formData = new FormData($("#workOrderManageForm")[0]);
	formData.append("lineid", formData.get("lineid").split("###")[0]);
	formData.append("plantid", formData.get("plantid").split("###")[0]);
	formData.append("processid", formData.get("processid").split("###")[0]);
	if(formData.get("workshift") == "BB")
		formData.append("scheduledstarttime", formData.get("scheduledstarttime") + " 07:00:00");
	else
		formData.append("scheduledstarttime", formData.get("scheduledstarttime") + " 19:00:00");
	//console.log(window.getFormDataToJson(formData));
	$.ajax({
		url: window.serviceIP + "/api/order/changeworkorder",
		type: "POST",
		contentType: "application/json",
		dataType: "json",

		data: window.getFormDataToJson(formData),
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},

		success: function(data) {
			if(data.status == 1) {
				alert('保存成功!');
				getWorkOrder();
				$("#myModal").modal('hide');
			} else {
				alert("保存失败！" + data.message);
			}
		}
	});
};

var workOrderSelectedRow;

function LSworkOrderRowClick(row) {

	$('.changeTableRowColor').removeClass('changeTableRowColor');
	$(row).addClass('changeTableRowColor');
	$($(row).find("td")[0]).addClass('changeTableRowColor');
}

function LSworkOrderSetCount() {
	if($("#workOrderManageForm" + " #materialid").find("option:selected").text().split("###").length < 2) {
		return;
	}

	var result1 = parseInt($("#workOrderManageForm" + " #materialid").find("option:selected").text().split("###")[1].trim());
	var result2 = parseInt($("#workOrderManageForm" + " #batchnum").val().trim());
	$("#workOrderManageForm" + " #totalproduction").val(result1 * result2);
}

function LScreateScrapModel() {
	var row = workOrderSelectedRow;
	$.ajax({
		url: window.serviceIP + "/api/scrapinfo/getmaterialscrapinfo?materialID=" + row["materialid"] + "&orderID=" + row["id"],
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		processData: true,
		success: function(dataRes) {
			$("#scrapModalForm" + " #orderid").val(row["id"]);
			$("#scrapModalForm" + " #ordername").val(row["orderid"]);
			$("#scrapModalForm" + " #ordertime").val(window.stringToDatetimeLocalType(row["scheduledstarttime"], "yyyy-MM-dd"));
			var htmlInner = "";

			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					htmlInner += "<label >" + models[i].name + "</label>" + "<input type=\"text\" class=\"form-control\" " +
						"onkeyup=\"value=value.replace(/[^0-9|^.]/g,'')\" id=\"" + models[i].id + "###" + models[i].name + "\" name=\"" + models[i].id +
						"###" + models[i].name + "\"  value = \"" + models[i].eachbatchnumber + "\"  placeholder=\"请输入报废数量\">";
				}
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
			//console.log(htmlInner);
			document.getElementById("scrapContent").innerHTML = htmlInner;
			$('#scrapModal').modal('show');
		}
	});
}

function LSsaveScrap() {
	var formData = new FormData($("#scrapModalForm")[0]);

	console.log(window.getFormDataToJson(formData));
	$.ajax({
		url: window.serviceIP + "/api/scrapinfo/savescrapinfo",
		type: "POST",
		contentType: "application/json",
		dataType: "json",

		data: window.getFormDataToJson(formData),
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},

		success: function(data) {
			if(data.status == 1) {
				alert('保存成功!');
				$("#scrapModal").modal('hide');
			} else {
				alert("保存失败！" + data.message);
			}
		}
	});
}

function LSinitSplitDetailWorkOrder(orderID) {
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	columnsArray.push({
		width: 300,
		"title": "工单号",
		"field": "ordersplitid"
	});
	columnsArray.push({
		"title": "产品",
		width: 300,
		"field": "materialName"
	});
	columnsArray.push({
		"title": "产品",
		width: 300,
		"field": "materialid",
		visible: false
	});
	columnsArray.push({
		width: 300,
		"title": "产量",
		"field": "productionnum"
	});
	columnsArray.push({
		width: 300,
		"title": "状态",
		"field": "statusName"
	});
	columnsArray.push({
		width: 300,
		"title": "状态",
		"field": "status",
		visible: false
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
		url: window.serviceIP + "/api/order/getordersplitaftermap?orderID=" + orderID,
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		processData: true,
		success: function(dataRes) {
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				$('#orderSplitTable').bootstrapTable('destroy').bootstrapTable({
					data: models,
					//toolbar: '#toolbar',
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

//调用工位方法
function subOrderWorkingLocationSlctFun() {
	var formData = new FormData();
//	formData.append("plantID", document.PlantToLineSelectForm.industrialPlantSlct.value.toString());
//	formData.append("processID", document.PlantToLineSelectForm.productionProcessSlct.value.toString());
//	formData.append("lineID", document.PlantToLineSelectForm.productionLineSlct.value.toString());
	formData.append("plantID", $("#industrialplant_id").val());
	formData.append("processID", $("#productionprocess_id").val());
	formData.append("lineID", $("#productionline_id").val());
//	console.log(document.addUserForm.industrialplant_id.value.toString())
//	console.log(document.addUserForm.productionprocess_id.value.toString())
//	console.log(document.addUserForm.productionline_id.value.toString())
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getworklocation",
		type: "POST",
		data: formData,
		//contentType: "application/json",
		//dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		//processData: true,
		processData: false,
		contentType: false,
		success: function(dataRes) {
			$("#add_workingkLocationSlct").find('option').remove();

			if(dataRes.status == 1) { 

				var models = eval("(" + dataRes.data + ")");
				if(models.length < 1) {
					$("#add_workingkLocationSlctLabel").hide();//.css("display", "none")
					$('#add_workingkLocationSlct').selectpicker('hide');

				} 
//				else {
//					$("#add_workingkLocationSlctLabel").show();//.attr("display", "block")
//					$('#add_workingkLocationSlct').selectpicker('show');
//				}
				for (var  i  in  models)  {  
					$('#add_workingkLocationSlct').append(("<option value=" + models[i].id +
						">" + models[i].name + "</option>").toString());
				}
				$('#add_workingkLocationSlct').selectpicker('refresh');
				$('#add_workingkLocationSlct').selectpicker('render');   
				// $('#add_workingkLocationSlct').selectpicker('mobile');
				if(localStorage.getItem('workingkLocation') != null && localStorage.getItem('workingkLocation') != 'undefined' && localStorage.getItem('workingkLocation').toString().length > 0) {	
					var numbers = $('#add_workingkLocationSlct').find("option"); //获取select下拉框的所有值
					for(var j = 0; j < numbers.length; j++) {
						if($(numbers[j]).val().toString() == localStorage.getItem('lineID')) {
							$(numbers[j]).attr("selected", "selected");
							//$('#add_workingkLocationSlct').selectpicker('hide');
							//$("#add_workingkLocationSlctLabel").css("display", "true");
						}
					}
					$('#add_workingkLocationSlct').selectpicker('refresh');
					$('#add_workingkLocationSlct').selectpicker('render'); 
				}
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};
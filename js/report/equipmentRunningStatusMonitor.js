function equipStatusMntPlantSlctFun(webName) {
	$.ajax({
		url: window.serviceIP + "/api/basicdata/getindustrialplant",
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		headers: {
			Token: localStorage.getItem('token')
		},
		processData: true,
		success: function(dataRes) {

			$("#equipDataPlantSlct").find('option').remove();
			//console.log(dataRes);
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#equipMngPlantSlct').append(("<option value=" + models[i].id.toString() + ">" + models[i].name.toString()  + "</option>").toString())

				}
				$('#equipMngPlantSlct').selectpicker('refresh');
				$('#equipMngPlantSlct').selectpicker('render');   
				// $('#equipMngPlantSlct').selectpicker('mobile');
				equipStatusMntEquipmentType(webName);
				equipStatusMntProcessSlctFun();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};


function equipStatusMntProcessSlctFun() {
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
			$("#equipMngProcessSlct").find('option').remove();
			$('#equipMngProcessSlct').append(("<option value=" + "-1" + ">" + "全部"  + "</option>").toString())
				
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#equipMngProcessSlct').append(("<option value=" + models[i].id + ">" + models[i].name.toString()  + "</option>").toString())
				}
				//console.log($('#productionProcessSlct'));
				$('#equipMngProcessSlct').selectpicker('refresh');
				$('#equipMngProcessSlct').selectpicker('render');   
				// $('#productionProcessSlct').selectpicker('mobile');


			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function equipStatusMntEquipmentType(webName) {

	$.ajax({
		url: window.serviceIP + "/api/basicdata/getequipmenttype",
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		processData: true,
		success: function(dataRes) {

			$("#equipmentType").find('option').remove();

			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#equipmentType').append(("<option value=" + models[i].id + ">" + models[i].name + "</option>").toString())
				}
				$('#equipmentType').selectpicker('refresh');
				$('#equipmentType').selectpicker('render');   
				// $('#equipmentType').selectpicker('mobile');

				if(webName == "equipmentRunningStatusMonitor")
					equipStatusMntParamType(webName);
				else if(webName == "equipParamRecordShow")
					getEquipmentInfoEquipReport(webName);
				else if(webName == "equipParamRecordTable")
					getEquipmentInfoEquipReport(webName);
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function equipStatusMntParamType(webName) {

	$.ajax({
		url: window.serviceIP + "/api/equipment/getequipmentparam?equipmentTypeID=" +
			document.equipmentSelectForm.equipmentType.value.toString(),
		type: "GET",
		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		processData: true,
		success: function(dataRes) {

			$("#equipmentParamType").find('option').remove();

			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#equipmentParamType').append(("<option value=" + models[i].id + "###" + models[i].units + ">" + models[i].name.toString()  + "</option>").toString())
				}
				$('#equipmentParamType').selectpicker('refresh');
				$('#equipmentParamType').selectpicker('render');   
				// $('#equipmentParamType').selectpicker('mobile');
				//				if(webName == "equipmentRunningStatusMonitor")
				//					equipStatusMntInit()
				//				else if(webName == "equipParamRecordTable") {
				//					equipParamRecordTableInit();
				//					$('#equipmentParamType').selectpicker('hide');   
				//				} else if(webName == "equipParamRecordShow")
				//					equipRecordChartShowInit();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function equipStatusAllParamMntInit(showType) {
	document.getElementById("tempControlerShow").innerHTML = "";
	document.getElementById('circulationGitPicture').src = window.webUiService + "/image/circulationPic.gif";

	$('#circulationPicture').css('display', 'block');
	$.ajax({
		url: window.serviceIP + "/api/equipment/getrecentallparamrecord?equipType=" +
			document.equipmentSelectForm.equipmentType.value.toString() +
			"&plantID=" + document.equipmentSelectForm.equipMngPlantSlct.value.toString() +
			"&processID=" + document.equipmentSelectForm.equipMngProcessSlct.value.toString(),
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		headers: {
			Token: localStorage.getItem('token')
		},
		processData: true,
		success: function(dataRes) {
			var controller = "<h1 id=\"dashboardName\" style=\"text-align:center;color:#FFFFFF;font-weight:bold\">设备运行参数监控看板</h1>";
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				console.log(models)
				for(var i = 0; i < models.length; i++) {
					
					controller += "<div class =\"TempContral\" ";
					

					if("1" == models[i].status) {
						controller += " style =\"background-color:#DAA520 !important;\""
						//alert(controller);
					}

					if("3" == models[i].status) {
						controller += " style =\"background-color:#FF0000  !important;\""
						//alert(controller);
					}
					controller += ">";
					controller += "<label class =\"fontStyle\">  &nbsp;&nbsp;位置：" + models[i].equipName + " &nbsp &nbsp </label><br/>";
					for(var j = 0; j < $('#equipmentParamType').find("option").length; j++) {

						controller += " &nbsp&nbsp" + models[i].showName + " &nbsp&nbsp<br/>"

						i++;
					}
					i = i - 1
					controller += "</div>";
				}
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
	
			document.getElementById("tempControlerShow").innerHTML = controller;
			console.log(controller)
			document.getElementById("dashboardName").innerHTML = $("#equipmentType").find("option:selected").text() + "( 实时 )监控看板";
			$("#tempControlerShow").ready(function() {
				$('#circulationPicture').css('display', 'none');
			});

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//                      alert(XMLHttpRequest.status);
			//                      alert(XMLHttpRequest.readyState);
			//                      alert(textStatus);
		}
	});
	if(!showType) {
		var tmpDate = new Date();
		//console.log(showType);
		$("#refreshID").html(tmpDate.format("yyyy-MM-dd-hh:mm:ss"));
		setTimeout("equipStatusAllParamMntInit('refresh" + document.getElementById("refreshID").innerHTML + "')", 60000 * 6);
	} else if(showType == 'refresh' + document.getElementById("refreshID").innerHTML) {
		var tmpDate = new Date();
		//console.log(showType);
		$("#refreshID").html(tmpDate.format("yyyy-MM-dd-hh:mm:ss"));
		setTimeout("equipStatusAllParamMntInit('refresh" + document.getElementById("refreshID").innerHTML + "')", 60000 * 6);
	}
	//console.log(document.getElementById("refreshID").innerHTML);
}





function equipStatusAllParamMntInitNew(showType) {
	document.getElementById("tempControlerShow").innerHTML = "";
	document.getElementById('circulationGitPicture').src = window.webUiService + "/image/circulationPic.gif";

	$('#circulationPicture').css('display', 'block');
	$.ajax({
		url: window.serviceIP + "/api/equipment/getRecentAllParamRecordNew?equipType=" +
			document.equipmentSelectForm.equipmentType.value.toString() +
			"&plantID=" + document.equipmentSelectForm.equipMngPlantSlct.value.toString() +
			"&processID=" + document.equipmentSelectForm.equipMngProcessSlct.value.toString(),
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		headers: {
			Token: localStorage.getItem('token')
		},
		processData: true,
		success: function(dataRes) {
			var controller = "<h1 id=\"dashboardName\" style=\"text-align:center;font-weight:bold\">设备运行参数监控看板</h1>";
			
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				var running = 0;
				var stop = 0;
				var none =0;
				for(var i = 0; i < models.length; i++) {
					if(models[i].运行状态 == '运行'){running++;}
					if(models[i].运行状态 == '停止'){stop++;}
					if(models[i].运行状态 == '离线'){none++;}
				}
				var str = "";
				str +='<div class="row clearfix"><div class="col-md-12 column"><hr size="2"/></div>'+
				'<div class="col-md-3 column"><font size="6" face="微软雅黑">共计: '+models.length+' 台设备</font></div>'+
				'<div class="col-md-3 column"><font size="6" face="微软雅黑" color="green">运行: '+running+' 台</font></div>'+
				'<div class="col-md-3 column"><font size="6" face="微软雅黑" color="brown">停止: '+stop+' 台</font></div>'+
				'<div class="col-md-3 column"><font size="6" face="微软雅黑" color="brown">离线: '+none+' 台</font></div>'+
//				'<div class="col-md-3 column"><font size="6" face="微软雅黑" color="red">状态未知: '+none+' 台</font></div>'+
				'<div class="col-md-12 column"><hr/></div>'+
				'</div>';
				str +='<div class="row clearfix">';
				for(var i = 0; i < models.length; i++) {
					str = str.concat('<div class="col-md-2 column"><div style="float: left; width: 100%; margin-left: 10px; margin-top: 10px; border: 1px solid #ede6e6; background-color: #fcfcfc;font-size:14px; ">');
					for(var j in models[i]) {
						if(j=='实时温度'&& models[i][j] - 1 > models[i].设定温度){
							str = str.concat("<span style=\"float:left; width:100%;padding:2px;\"><font  color=\"red\">" + j + ":" + "</font><span style=\"color: red;\"><font  color=\"red\">" + models[i][j] + "</font> </span></span>");
							continue;
						}
						if(j=='实时湿度'&&models[i][j] - 1 >models[i].设定湿度){
							str = str.concat("<span style=\"float:left; width:100%;padding:2px;\"><font  color=\"red\">" + j + ":" + "</font><span style=\"color: red;\"><font  color=\"red\">" + models[i][j] + "</font> </span></span>");
							continue;
						}
						if(models[i][j]=='运行'){
							str = str.concat("<span style=\"float:left; width:100%;padding:2px;\">" + j + ":" + "<span style=\"color: green;\">" + models[i][j] + " </span></span>");
							continue;
						}
//						if(models[i][j]=='停止'){
//							str = str.concat("<span style=\"float:left; width:100%;padding:2px;\">" + j + ":" + "<span style=\"color: brown;\">" + models[i][j] + " </span></span>");
//							continue;
//						}
//						if(models[i][j]=='未知'){
//							str = str.concat("<span style=\"float:left; width:100%;padding:2px;\">" + j + ":" + "<span style=\"color: red;\">" + models[i][j] + " </span></span>");
//							continue;
//						}
							str = str.concat("<span style=\"float:left; width:100%;padding:2px;\">" + j + ":" + "<span style=\"color: black;\">" + models[i][j] + " </span></span>");
						
					}
					str += "</div></div>";
				}
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
			str += "</div>";
			document.getElementById("tempControlerShow").innerHTML = controller;
			document.getElementById("equipmentShowListDiv").innerHTML=str;
			//console.log(controller)
			document.getElementById("dashboardName").innerHTML = $("#equipmentType").find("option:selected").text() + "( 实时 )监控看板";
			$("#tempControlerShow").ready(function() {
				$('#circulationPicture').css('display', 'none');
			});

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//                      alert(XMLHttpRequest.status);
			//                      alert(XMLHttpRequest.readyState);
			//                      alert(textStatus);
		}
	});
	if(!showType) {
		var tmpDate = new Date();
		//console.log(showType);
		$("#refreshID").html(tmpDate.format("yyyy-MM-dd-hh:mm:ss"));
		setTimeout("equipStatusAllParamMntInitNew('refresh" + document.getElementById("refreshID").innerHTML + "')", 60000 * 6);
	} else if(showType == 'refresh' + document.getElementById("refreshID").innerHTML) {
		var tmpDate = new Date();
		//console.log(showType);
		$("#refreshID").html(tmpDate.format("yyyy-MM-dd-hh:mm:ss"));
		setTimeout("equipStatusAllParamMntInitNew('refresh" + document.getElementById("refreshID").innerHTML + "')", 60000 * 6);
	}
	//console.log(document.getElementById("refreshID").innerHTML);
}






function equipStatusMntParamType(webName) {

	$.ajax({
		url: window.serviceIP + "/api/equipment/getequipmentparam?equipmentTypeID=" +
			document.equipmentSelectForm.equipmentType.value.toString(),
		type: "GET",
		contentType: "application/json",
		dataType: "json",
		//		headers: {
		//			Token: localStorage.getItem('token')
		//		},
		processData: true,
		success: function(dataRes) {

			$("#equipmentParamType").find('option').remove();

			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#equipmentParamType').append(("<option value=" + models[i].id + "###" + models[i].units + ">" + models[i].name.toString()  + "</option>").toString())
				}
				$('#equipmentParamType').selectpicker('refresh');
				$('#equipmentParamType').selectpicker('render');   
				// $('#equipmentParamType').selectpicker('mobile');
				//				if(webName == "equipmentRunningStatusMonitor")
				//					equipStatusMntInit()
				//				else if(webName == "equipParamRecordTable") {
				//					equipParamRecordTableInit();
				//					$('#equipmentParamType').selectpicker('hide');   
				//				} else if(webName == "equipParamRecordShow")
				//					equipRecordChartShowInit();
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});
};

function equipStatusMntInit() {
	document.getElementById("tempControlerShow").innerHTML = "";
	document.getElementById('circulationGitPicture').src = window.webUiService + "/image/circulationPic.gif";
	$('#circulationPicture').css('display', 'block');
	$.ajax({
		url: window.serviceIP + "/api/equipment/getlatestparamrecord?equipType=" +
			document.equipmentSelectForm.equipmentType.value.toString() +
			"&plantID=" + document.equipmentSelectForm.equipMngPlantSlct.value.toString() +
			"&paramID=" + document.equipmentSelectForm.equipmentParamType.value.toString().split("###")[0],
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		headers: {
			Token: localStorage.getItem('token')
		},
		processData: true,
		success: function(dataRes) {
			var controller = "";
			var units = document.equipmentSelectForm.equipmentParamType.value.toString().split("###")[1];
			if(units == "undefined") {
				units = "";
			}

			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for(var i in models) {
					controller += "<div class =\"TempContral\" ";

					if("1" == models[i].status) {
						controller += " style =\"background-color:#FFD306 !important;\""
						//alert(controller);
					}

					if("3" == models[i].status) {
						controller += " style =\"background-color:#CE0000  !important;\""
						//alert(controller);
					}
					//					controller += ">" + models[i].value + units + "</div><br/><br/><br/>" +
					//						"<label class =\"fontStyle\">&nbsp; 人员：" + models[i].recorder + "</label><label  class =\"fontStyle\">  &nbsp; 时间：" +
					//						models[i].recordTime + "</label><label class =\"fontStyle\">  &nbsp; 名称：" + models[i].equipName + "</label></div>"
					controller += ">" + models[i].value + units + " &nbsp&nbsp<br/>" +
						"<label class =\"fontStyle\">  &nbsp; 名称：" + models[i].equipName + " &nbsp &nbsp</label></div>"
				}
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}

			document.getElementById("tempControlerShow").innerHTML = controller;
			$("#tempControlerShow").ready(function() {
				$('#circulationPicture').css('display', 'none');
			});
			setTimeout("equipStatusMntInit()", 60000 * 5);
		}
	});

	//	var controller = "";
	//	for(var i = 0; i < 30; i++)
	//	{
	//		controller += "<div class =\"TempContral\"><div class =\"TempContralInner\">35℃</div><br/><br/><br/>"
	//		+ "<label class =\"fontStyle\">&nbsp; 人员：** </label><br/><label  class =\"fontStyle\">  &nbsp; 时间： **</label><br/><label class =\"fontStyle\">  &nbsp; 位置： **</label></div>"
	//	}
	//		
	//	document.getElementById("tempControlerShow").innerHTML = controller;
}

function getEquipmentInfoEquipReport(webName) {
	$.ajax({
		url: window.serviceIP + "/api/equipment/getequipmentinfo?typeID=" + document.equipmentSelectForm.equipmentType.value.toString() +
			"&plantID=" + document.equipmentSelectForm.equipMngPlantSlct.value.toString(),
		type: "GET",

		contentType: "application/json",
		dataType: "json",
		headers: {
			Token: localStorage.getItem('token')
		},
		processData: true,
		success: function(dataRes) {

			$("#equipmentInfo").find('option').remove();
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				for (var  i  in  models)  {  
					$('#equipmentInfo').append(("<option value=" + models[i].id.toString() + ">" + models[i].name.toString()  + "</option>").toString())

				}
				$('#equipmentInfo').selectpicker('refresh');
				$('#equipmentInfo').selectpicker('render'); 
				// $('#equipmentInfo').selectpicker('mobile'); 
				equipStatusMntParamType(webName);
			} else {
				alert("初始化数据失败！" + dataRes.message);
			}
		}
	});

};

function equipRecordChartShowInit() {
	var formData = new FormData();

	//var formData = new FormData($("#equipmentSelectForm")[0]);
	formData.append("paramID", document.equipmentSelectForm.equipmentParamType.value.toString().split("###")[0]);
	formData.append("equipID", document.equipmentSelectForm.equipmentInfo.value.toString());
	formData.append("startTime", $("#startTime").val());
	formData.append("endTime", $("#endTime").val() + " 59:59:59");

	$.ajax({
		url: window.serviceIP + "/api/equipment/getoneequipparamrecord",
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
			if(dataRes.status == 1) { 
				var models = eval("(" + dataRes.data + ")");
				//console.log(models);
				var xA = [];
				var yA = [];
				var minNum = 99999;
				var maxNum = 0;

				for(var i in models) {

					xA.push(models[i].recordTime);
					yA.push(models[i].value);
					if(maxNum < models[i].value)
						maxNum = models[i].value;
					if(minNum > models[i].value)
						minNum = models[i].value;
				}
				//			document.getElementById("showDetail").innerHTML = "共称重" + total + "次,低于标准重量" + overMin + "次" +
				//				",高于标准重量" + overMax + ",合格次数为" + (total - overMax - overMin) + "次"
				var myChart = echarts.init(document.getElementById('report'));
				var option = {
					title: {
						text: '设备参数变化趋势图'
					},
					tooltip: {
						trigger: 'axis'
					},
					color: ['#009393', '#ED7C30', '#80FF80', '#FF8096', '#800080'],

					legend: {
						orient: 'vertical', // 'vertical'
						x: 'right', // 'center' | 'left' | {number},
						y: 'top', // 'center' | 'bottom' | {number}
						//          data: ['正板1','正板2','正板3','负板1','负板2','负板3']
						data: ['参数变化趋势图']
					},
					calculable: true,
					xAxis: {
						data: xA
					},
					//				yAxis: [{
					//					type: 'value',
					//					axisLabel: {
					//						formatter: '{value} s'
					//					}
					//				}],
					yAxis: {
						min: parseInt(minNum) - 1,
						max: parseInt(maxNum) + 1,
						splitNumber: 5,
						//						axisLine: {
						//							lineStyle: {
						//								color: '#dc143c'
						//							}
						//						},
						axisLabel: {
							formatter: '{value} '
						}
					},
					series: [{
						itemStyle: {
							normal: {
								lineStyle: {
									color: '#009393'
								}
							}
						},
						name: '参数变化趋势图',
						type: 'line',
						data: yA,
						//showAllSymbol: true,

						markLine: {
							itemStyle: {
								normal: {
									borderWidth: 5,
									lineStyle: {
										type: 'solid',
										color: '#000079'
									},
									label: {
										show: true,
										position: 'end'
									}
								},
							},
							data: [{
								type: 'average',
								name: '平均值'
							}]
						}
					}]
				};
				myChart.setOption(option);
			} else(
				alert("查询失败!" + dataRes.message)
			)
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest + "," + textStatus + "," + errorThrown);
		}
	});
}

function equipParamRecordTableInit() {
	var columMap = {};
	var columnsArray = [];
	columnsArray.push({
		checkbox: true
	});
	var m = 0;
	$("#equipmentParamType option").each(function() {
		columnsArray.push({
			"title": $(this).text(),
			//"field": $(this).val().split("###")[0]
			"field": $(this).text()
		});
		columMap[$(this).val().split("###")[0]] = $(this).text();
		m++;
	});

	columnsArray.push({
		"title": "记录者",
		"field": "记录者"
	});
	columnsArray.push({
		"title": "记录时间",
		"field": "记录时间"
	});
	columnsArray.push({
		"title": "图片记录",
		"field": "图片记录"
	});
	columnsArray.push({
		"title": "status",
		"field": "status",
		visible: false
	});
	var formData = new FormData();
	formData.append("equipID", document.equipmentSelectForm.equipmentInfo.value.toString());
	formData.append("startTime", $("#startTime").val());
	formData.append("endTime", $("#endTime").val() + " 59:59:59");

	$.ajax({

		url: window.serviceIP + "/api/equipment/getequipparamrecordbytime",
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
			var models = eval("(" + dataRes.data + ")");
			var dataShow = [];
			for(var i = 0; i < models.length;) {
				var obj = {};
				var statusID = "0";
				for(var j = 0; j < m; j++) {
					if(j == 0) {
						obj["记录者"] = models[i + j].recorder;
						obj["记录时间"] = models[i + j].recordtime;
						obj["图片记录"] = models[i + j].picturefile;
					}
					if(models[i + j].status > statusID) {
						obj["status"] = models[i + j].status;
					}
					obj[columMap[models[i + j].paramid]] = models[i + j].value;
				}
				dataShow.push(obj);
				i += m;
			}
			$('#table').bootstrapTable('destroy').bootstrapTable({
				data: dataShow,
				toolbar: '#toolbar1',
				singleSelect: true,
				clickToSelect: true,
				sortName: "recordTime",
				sortOrder: "desc",
				pageSize: 15,
				pageNumber: 1,
				pageList: "[10, 25, 50, 100, All]",
				//showToggle: true,
				//showRefresh: true,
				//showColumns: true,
				//search: true,
				pagination: true,
				rowStyle: function(row, index) {
					//这里有5个取值代表5中颜色['active', 'success', 'info', 'warning', 'danger'];
					//					 var style = "";             
					//               style='danger';             
					//           return { classes: style }

					//             var style = {};             
					//               style={css:{'color':'#ed5565'}};                
					//           return style;

					var style = {};
					if(row.status == "2")
						style = {
							css: {
								'background-color': '#B15BFF'
							}
						};
					else if(row.status == "3")
						style = {
							css: {
								'background-color': '#FF0000'
							}
						};
					else {
						if(index % 2 == 0)
							style = {
								css: {
									'background-color': '#d0d0d0'
								}
							};
						else
							style = {
								css: {
									'background-color': '#F0F0F0'
								}
							};
					}
					return style
				},
				columns: columnsArray
			});
		},
		error: function() {
			alert("错误");
		}
	});
}
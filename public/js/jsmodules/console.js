define([
	'jquery'
],
function(
	$
){
	'use-strict';

	var $MOSI = {};
	$MOSI.root = '$MoSiddi';
	$MOSI.ext = ":  ";
	$MOSI.mosi = $MOSI.root + $MOSI.ext;
	$MOSI.inView = $MOSI.mosi;
	$MOSI.pDirectory = [];

	//var DIRECTORY = [ "mwsiddee", "files", "shared"]
	
	$MOSI.SYSTEM = {
			DIRECTORY : { Users  : { "mwsiddee" : "Mohammed_Siddeeq_ADMIN",
									 "guest"	: "Guest_01"
								   },
			  			  DATA   : { "MyDocuments" : {},
			  			  			 "Pictures" : {},
			  			  			 "Music" : {},
			  			  			 "Games" : {"fighters.msdi" : function exec(){initGame();}}
			  					   },
						  Shared : {"Document1.txt":"This is a sample text file...Edit me!"}
						},
			EXECUTABLE: {},

			PARSER    : function parse(str){
							arr = str.split(" ")
							return arr
						},
			COMPILER  : function compile(file){
						
						},
			COMMAND   :{ "RUN" : function run(pgm){},
						 "CD" : function call(path){},
						 "LS" : function list(){},
						 "MD" : function make(dir){},
						 "RM" : function remove(dir){},
						 "HELP" : function help(){},
						},
			LOG		  : {History : [""]},

			RESTRICT  : { "Users" : "No_Delete No_Add",
	  			  		  "DATA" : "No_Delete"
	  					}
	}
	$MOSI.MenuOptions = [
					//{command:"query",detail:"queries records from external db"},
					
					{command:"cd  $dir_path",detail:"calls subdirectory, parent(cd), or root(cd..)"},
					{command:"clear or (esc)",detail:"clears console display"},
					{command:"ls",detail:"lists subdirectories"},
					{command:"help",detail:"displays Menu"},
					{command:"md  $new_dir",detail:"creates subdirectory"},
					{command:"msdi  $file_src_path",detail:"install msdi program"},
					{command:"mstxt  $file_name",detail:"launch text edit program"},
					{command:"rm  $sub_dir",detail:"removes subdirectory or file"},
					{command:"run  $file_name",detail:"runs msdi program"}					
	]
	$MOSI.sysPtr = $MOSI.SYSTEM.DIRECTORY;
	$MOSI.InAccess = false;
	$MOSI.DataAccess = false;
	$MOSI.TextAccess = false;
	$MOSI.index = 0;
	
	//var MWS = $MOSI.SYSTEM.DIRECTORY.Users.mwsiddee;
	//var pars = $MOSI.SYSTEM.PARSER(MWS);

	$(document).ready(function(){	
		$('#input').val($MOSI.mosi);

		
		
		//alert(SYSTEM.LOG.History.length)//pars[0])
		$('#input').keydown(function(e){
			var notAllowed = new RegExp(/^[a-z A-Z 0-9]/g);
			if($MOSI.InAccess && $MOSI.lastKeyCode){
				if($MOSI.lastKeyCode === 17 && e.keyCode === 81){$MOSI.exit101();}////QUIT on ctrl + s
				else if($MOSI.TextAccess && $MOSI.lastKeyCode === 17 && e.keyCode === 83){$MOSI.Functions.saveTxt();}////SAVES on ctrl + q 
			}
			$MOSI.lastKeyCode = e.keyCode;

			if(e.keyCode==16 || e.keyCode==39){////KEY: Shift Right
				////////PASSES THROUGH ALL CHECKS
			}else if(e.keyCode==8){////KEY: Delete
				if((this.selectionStart <= $MOSI.inView.length) || ($('#input').val().lastIndexOf($MOSI.mosi) === $('#input').val().length - $MOSI.mosi.length)){
					e.preventDefault();
				}
			}else if(e.keyCode==13){////KEY: Enter
				e.preventDefault();
			}else if(e.keyCode==37){////KEY: Left
				if(this.selectionStart <= $MOSI.inView.length){
					e.preventDefault();
				}
			}else if($MOSI.Functions.specialAllowedCharacters(e.keyCode)){////Allowed Special Characters
				////////PASSES THROUGH ALL CHECKS
			}else if(!notAllowed.test(String.fromCharCode(e.keyCode))){////Any Non-Allowed Characters
				e.preventDefault();
			}else if(this.selectionStart < $MOSI.inView.length){
				e.preventDefault();
			}
			//////KEY NOT PREVENTED//////
		});
		$('#input').keyup(function(e){
			console.log(e.keyCode);
			if(e.keyCode==13){
				if($MOSI.TextAccess){
					$('#input').val($('#input').val() + "\n");
					$("#input").scrollTop($("#input")[0].scrollHeight);
				}else{
					var input = $('#input').val().slice($('#input').val().lastIndexOf($MOSI.mosi)).replace($MOSI.mosi,'').trim();
					//$MOSI.inView = $('#input').val() + '\n' + $MOSI.mosi;
					//$('#input').val($MOSI.inView);

					if($MOSI.DataAccess){$MOSI.Functions.ShowUser(input)}else{$MOSI.MainState(input);}
					$MOSI.index = 0;
					$("#input").scrollTop($("#input")[0].scrollHeight);
				}
			}
			
			if((e.keyCode==38)&& !$MOSI.InAccess){///KEY: Down
				$MOSI.Functions.nextCommand();
			}
			
			if((e.keyCode==40)&& !$MOSI.InAccess){///KEY: Up
				$MOSI.Functions.prevCommand();
			}

			if((e.keyCode==27)&& !$MOSI.InAccess){////KEY: Esc
				// if($MOSI.InAccess){
				// 	$MOSI.exit101();
				// }else{
					$MOSI.Functions.clearConsole();
				// }
			}
		});

		
		
		
		/* $('#input').keyup(function(e) {
			alert(e.keyCode) 
		}) */
	});
		







	$MOSI.MainState = function MainState(str){///////MAIN STATE MANAGEMENT SYSTEM///////////////////////////////////////////////
			if(str.length>0){$MOSI.Functions.Save(str);}

			if(str.toUpperCase()==="HELP" || str.toUpperCase()==="MENU"){
				$MOSI.Output($MOSI.Functions.Options(),true);
			}else if(str.toUpperCase() === "LS"){
				$MOSI.Functions.listDirectoryContents();
			}else if(str.toUpperCase().indexOf("CD")===0){
				var dir = str.slice(2);
				if(str.toUpperCase() === "CD"){$MOSI.Functions.upfromDirectory();}
				else if(dir&&dir.length>0){$MOSI.Functions.gotoDirectoryPath(dir)}
				else{$MOSI.Functions.parseError();}
			}else if(str.toUpperCase().indexOf("MD ")===0){
				var dir = str.slice(2);
				if(dir&&dir.length>0){$MOSI.Functions.addDirectory(dir)}
				else{$MOSI.Functions.parseError();}
			}else if(str.toUpperCase().indexOf("RM ")===0){
				var dir = str.slice(2);
				if(dir&&dir.length>0){$MOSI.Functions.removeDirectory(dir)}
				else{$MOSI.Functions.parseError();}
			}else if(str.toUpperCase().indexOf("RUN ")===0){
				var pgm = str.slice(3);
				if(pgm&&pgm.length>0){$MOSI.Functions.openExecutable(pgm)}
				else{$MOSI.Functions.parseError();}
			}else if(str.toUpperCase().indexOf("MSDI ")===0){
				var path = str.slice(4);
				if(path&&path.length>0){$MOSI.Functions.loadFilePath(path);}
				else{$MOSI.Functions.parseError();}
			}else if(str.toUpperCase().indexOf("MSTXT")===0){
				var txt = str.slice(5);
				$MOSI.TextEngine(txt);
			}
			// else if(str.toUpperCase().indexOf("QUERY")===0){
			// 	$MOSI.DataAccess = true;
			// 	$MOSI.Output("Enter a name to query or ALL_RECORDS for all records");
			// }
			else if(str.toUpperCase() === "CLEAR"){
				$MOSI.Functions.clearConsole();
			}else if(str.toUpperCase() === "TEST"){
				$MOSI.Functions.termTest();
			}else{
				$MOSI.Output("Invalid Command......(type 'help' for help menu)");
			}
			
	}

	$MOSI.Output = function Output(str,formatted){//Ouptuts text to console
		//$('#output').html('<p id=output>' + str + '</p>');
		var outMessage = str?"\n\t" + str:"";
		if(formatted){
			$('#input').val($('#input').val() + outMessage + '\n' + $MOSI.mosi);
		}else{
			$('#input').val($('#input').val() + $MOSI.Functions.format(outMessage) + '\n' + $MOSI.mosi);
		}
		$MOSI.inView = $('#input').val();
		$("#input").scrollTop($("#input")[0].scrollHeight);
	}

	$MOSI.TextEngine = function TextEngine(txt){//MOSItxt engine, text editor
		if($MOSI.pDirectory.length===0){
			$MOSI.Output("Not permitted to edit this directory");
		}else{
			var fl = txt&&txt.length>3?txt.replace('.txt','').trim() + '.txt':'New Text';
			var content = typeof $MOSI.sysPtr[fl] === 'string' ? $MOSI.sysPtr[fl] : '';
			var file = typeof $MOSI.sysPtr[fl] === 'string' ? fl+'(opened)':fl+'(new)';
			$MOSI.FileName = fl.replace('.txt','');
			$('#input').val($('#input').val() + '\nMOSItxt   save(ctrl+s)  quit(ctrl+q)  :: '+ file +'\n\n~');
			$MOSI.inView = $('#input').val();
			$('#input').val($MOSI.inView + content);
			$MOSI.InAccess = true;
			$MOSI.TextAccess = true;

			////17(ctrl) + 83(s) to save
			////17(ctrl) + 81(q) to quit
		}
	}

	$MOSI.Install = function Install(fl){//adds a directory to SYSTEM.DIRECTORY.DATA
			var name = fl.name.trim().replace(/\s/g,"_");
			var msdi = fl.msdi;
			$MOSI.SYSTEM.EXECUTABLE[name] = fl;
			if(name&&name.length>=3){
				if($MOSI.pDirectory.length===0){
					$MOSI.Output("Not permitted to edit this directory");
				}else{
					if($MOSI.sysPtr[name]){
						$MOSI.Output("Add Directory error: directory already exist");
					}else{
						$MOSI.sysPtr[name] = msdi;
						$MOSI.Output("File Successful Installed");
						var icon = fl.icon?fl.icon:'MoSiddi_2.01/Portfolio/resources/Icons/Samples/Folder_documents.png';
						var gui = '<p><a href="javascript:$MOSI.SYSTEM.EXECUTABLE[\''+name+'\'].msdi();"><img class="projects" id="project'+ ($('.projects').length+1) +'" src="'+icon+'" alt="'+name+'"/></a></p>';
						$('#modules').append(gui);
						$MOSI.Output();
					}
				}
			}else{
				$MOSI.Output("Add Directory error: invalid directory name");
			}
	}


	$MOSI.exit101 = function exit101(){
		$MOSI.InAccess = false;
		$MOSI.DataAccess = false;
		$MOSI.TextAccess = false;
		$MOSI.Output();
		return;
	}


	$MOSI.Functions = {
		format : function (str,len,rows){///////INCONSISTENT, DEBUG!!!!!
			var ret = '';
			var cnt = 0;
			var ptr = len?len:50;
			var strt = 0;
			var fnsh = 0;
			if(str.length>ptr){
				ret = '\n\t';
				while(fnsh<str.length){
					console.log("Finish: "+fnsh);
					var slice = str.slice(strt,strt+ptr);
					console.log(slice);
					var max = (slice.lastIndexOf(" ")<(ptr-10)) || (slice.lastIndexOf(" ")>=ptr) ? ptr : slice.lastIndexOf(" ");
					console.log("Max: "+max);
					fnsh += slice.slice(0,max).length;
					ret += slice.slice(0,max).trim()+"\n\t";
					strt = fnsh;
					console.log("Start: "+strt);
					cnt++;
					if(rows && (cnt > rows)){ret += "(MORE)...........";break;}
				}
			}else{
				ret += str;
			}

			return ret;
		},

		Query : function (str){
			
		},

		addDirectory : function (dir){//adds a directory to SYSTEM.DIRECTORY.DATA
			var dir = dir.trim();
			var dir = dir.replace(/\s/g,"");
			if(dir&&dir.length>0){
				if($MOSI.pDirectory.length===0){
					$MOSI.Output("Not permitted to edit this directory");
				}else{
					if($MOSI.sysPtr[dir]){
						$MOSI.Output("Add Directory error: directory already exist");
					}else{
						$MOSI.sysPtr[dir] = {};
						$MOSI.Output();
					}
				}


			}else{
				$MOSI.Output("Add Directory error: invalid directory name");
			}
		},

		removeDirectory : function (dir){//removes a directory from SYSTEM.DIRECTORY.DATA
			var dir = dir.trim();
			if($MOSI.pDirectory.length===0){
				$MOSI.Output("Not permitted to edit this directory");
			}else{
				if(dir&&$MOSI.sysPtr[dir]){
					delete $MOSI.sysPtr[dir];
					$MOSI.Output();
				}else{
					$MOSI.Output("Removal error: No such directory or file exists");
				}
			}
		},

		Save : function (str){//saves history of commands for SYSTEM.LOG
			$MOSI.SYSTEM.LOG.History.unshift(str)
		},

		Options : function (){//creates and returns an options menu for user help
			var menu = '\n';
			var dots = "....................................................................";

			for(var i=0;i<$MOSI.MenuOptions.length;i++){
				var sep = dots.slice(0,60-($MOSI.MenuOptions[i].command.length+$MOSI.MenuOptions[i].detail.length-2));
				var com = "\t"+ $MOSI.MenuOptions[i].command + sep + $MOSI.MenuOptions[i].detail +"\n";  
				menu += com;
			}
			return  menu;
		},

		ShowUser: function (str){//connects to the server and queries a table in the database for a name
			$MOSI.DataAccess = false;
			
			if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp = new XMLHttpRequest();
			}else{// code for IE6, IE5
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			
			xmlhttp.onreadystatechange = function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					document.getElementById("output").innerHTML = xmlhttp.responseText;
					//document.getElementById("output").innerHTML = str;
				}
			}
			xmlhttp.open("GET","MoSiddi_1.02/Portfolio/php/test.php?name="+str,true);
			xmlhttp.send();
		},

		saveTxt : function(){
			var fl = $MOSI.FileName + '.txt';
			var contents = $('#input').val().slice($('#input').val().lastIndexOf('~')).replace('~','').trim();
			var file = $MOSI.sysPtr[fl] = contents;
			$MOSI.exit101();
		},

		clearConsole : function (){
			$MOSI.inView = $MOSI.mosi;
			$('#input').val($MOSI.mosi);
			$("#input").scrollTop($("#input")[0].scrollHeight);
		},

		prevCommand : function (){
			if(0<$MOSI.index){$MOSI.index--;}
			var prev = $MOSI.SYSTEM.LOG.History[$MOSI.index];
			$('#input').val($MOSI.inView+prev);
			$("#input").scrollTop($("#input")[0].scrollHeight);
		},

		nextCommand : function (){
			var next = $MOSI.SYSTEM.LOG.History[$MOSI.index];
			$('#input').val($MOSI.inView+next);
			if(($MOSI.SYSTEM.LOG.History.length)-1>$MOSI.index){$MOSI.index++;}
			$("#input").scrollTop($("#input")[0].scrollHeight);
		},

		upfromDirectory : function (){
			if($MOSI.pDirectory.length===1){
				$MOSI.pDirectory.pop();
				$MOSI.sysPtr = $MOSI.SYSTEM.DIRECTORY;
				$MOSI.pDirectory = [];
				$MOSI.mosi = $MOSI.root + $MOSI.ext;
			}else if($MOSI.pDirectory.length>1){
				var name = $MOSI.pDirectory.length===1?"":" ~"+$MOSI.pDirectory[$MOSI.pDirectory.length-2].dname;
				$MOSI.sysPtr = $MOSI.pDirectory[$MOSI.pDirectory.length-1].directory;

				$MOSI.pDirectory.pop();
				$MOSI.mosi = $MOSI.root + name + $MOSI.ext;
			}else{
				$MOSI.mosi = $MOSI.root + $MOSI.ext;
			}
			$MOSI.Output();
		},

		gotoDirectory : function (dir){
			var dir = dir.trim();
			console.log(dir);
			if(dir&&(dir.length>0)&&typeof $MOSI.sysPtr[dir] === 'object'){
				$MOSI.pDirectory.push({directory:$MOSI.sysPtr,dname:dir});
				$MOSI.sysPtr = $MOSI.sysPtr[dir];
				$MOSI.mosi = $MOSI.root + " ~" + dir + $MOSI.ext;
				$MOSI.Output();
			}else if(dir&&dir===".."){
				$MOSI.sysPtr = $MOSI.SYSTEM.DIRECTORY;
				$MOSI.pDirectory = [];
				$MOSI.mosi = $MOSI.root + $MOSI.ext;
				$MOSI.Output();
			}else{
				$MOSI.Output("Directory: "+ dir +" doesn't exist");
			}
		},

		gotoDirectoryPath : function (path){
			var index = path.indexOf('/');
			if(index!=-1){
				var dir = path.slice(0,index).replace('/','').trim();
				console.log(dir);
				if(dir&&(dir.length>0)&&typeof $MOSI.sysPtr[dir] === 'object'){
					$MOSI.pDirectory.push({directory:$MOSI.sysPtr,dname:dir});
					$MOSI.sysPtr = $MOSI.sysPtr[dir];
					$MOSI.mosi = $MOSI.root + " ~" + dir + $MOSI.ext;
					path = path.slice(index+1);
					console.log('Next path: '+ path);
					$MOSI.Functions.gotoDirectoryPath(path);
				}else{
					console.log('Failed Path: '+ path);
					$MOSI.Output("Directory: "+ dir +" doesn't exist");
				}
			}else{
				$MOSI.Functions.gotoDirectory(path);
			}
		},

		// pathCheck : function (path){
		// 	var index = path.indexOf('/');
		// 	if(index!=-1){
		// 		var dir = path.trim().slice(0,index-1);
		// 		if(dir&&(dir.length>0)&&$MOSI.sysPtr[dir]){
		// 			path = path.slice(index+1);
		// 			$MOSI.Functions.pathCheck()
		// 		}
		// 	}else{

		// 	}
		// },

		listDirectoryContents : function (){
			var dlist = '';
			var ct = 1;
			if(typeof $MOSI.sysPtr === 'object'){
				for(d in $MOSI.sysPtr){
					dlist += d + "\t\t";
					dlist += ct%3===0?"\n\t":"";
					ct++;
				}
			}
			$MOSI.Output(dlist,true);
		},

		loadFilePath : function (path){
			//var path = 'MoSiddi_2.01/Modules/promptMe.js';
			console.log(path.trim());
			if($MOSI.pDirectory.length===0){
					$MOSI.Output("Not permitted to load in this directory");
			}else{
				var install = htmlExt.loadExtFile(path.trim());
				if(install){
					$MOSI.Output("Path Successful Loaded");
				}else{
					$MOSI.Output("Load error: check file path and ensure it is not already loaded");
				}
			}
		},

		openExecutable : function (pgm){
			var pgm = pgm.indexOf('.msdi')===-1?pgm.trim() + '.msdi':pgm.trim();
			console.log($MOSI.sysPtr);
			console.log(pgm);
			if(pgm&&(pgm.length>0)&&$MOSI.sysPtr[pgm]){
				if(typeof $MOSI.sysPtr[pgm] === 'function'){
					$MOSI.sysPtr[pgm]();
					$MOSI.Output();
					return;
				}
				$MOSI.Output("Error: Executable is not installed for this program");
			}else{
				$MOSI.Output("No such executable in directory");
			}
		},

		specialAllowedCharacters : function (chrCode){
			console.log(chrCode);
			console.log(String.fromCharCode(chrCode))
			if(chrCode === 189 || chrCode === 187 || chrCode === 91 || chrCode === 50 || chrCode === 190 || chrCode === 222 || chrCode === 173 ||chrCode === 188 || chrCode === 186 || chrCode === 191){//////  +=  -_  ?/  @
				return true;
			}
			return false;
		},

		parseError : function (){
			$MOSI.Output("System parse error: Ensure correct number of arguments with command");
		},


		termTest : function (){
			var strTest = "sclkrngeaoeth ryj dtyj dty udr y  6y w rtyreijgsoeirjtnhsrt geortngoneo'gnaoeurnpgaoiunertg ahoertnag eroitghaoehrotgnauenrguaeirbigubaerjibgiuaberigbaieurbiugbaeirubgiubeirubgkjaebribgiabejrnkjnguabenrngjiaberjgnaiuebrgjaierbgiubseiurbgisebrugsjerbgiserbnogiusherg erghaiuerhgiauheriugha erugaieruhgaoierugaiuweoiurgbaeoirbgaoeruygaoewirgbieajrbgoiaeyrhgoajerng aeirughaeirughaiuerg aewurygfoaieurhgoiaeruhgaerg";
			$MOSI.Output(strTest);
		}
	}
});
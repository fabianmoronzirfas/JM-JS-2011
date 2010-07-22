﻿/* * @author fabiantheblind *  *  */// You must copy the file "glue code.jsx" from the XML Rules folder (inside the// Scripts// folder inside your InDesign folder) to the folder containing this script, or// provide a full// path to the file in the next line.#include "./meta/glue code.jsx";#include "./meta/processXML.js";#include "./meta/setupStyles.js";main();// ------------function main(){		var numOfItems;				var myDoc = app.activeDocument;		with(myDoc){		viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;		viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;		viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;		}		var myList = myDoc.pages.everyItem().name;	// set the XMLImport preferences		xmlImportPref(myDoc);		var myAppendDialoge =  app.dialogs.add({name:"Continue or Import", canCancel:true});		with(myAppendDialoge){			//Add a dialog column.			with(dialogColumns.add()){				//Create a border panel.				//Create another border panel.				with(borderPanels.add()){					with(dialogColumns.add()){						staticTexts.add({staticLabel:"   Press \"Ok\" for new import.<br> Press \"Abbrechen\" to continuewith existing Data.   "});					}				}			}					//Display the dialog box.			if(myAppendDialoge.show() == true){				myAppendDialoge.destroy();				var myRoot;				try {					myRoot = myDoc.importXML(File.openDialog("Choose your .xml file"));									} catch (e) {					alert("ERROR: :( Sorry, your XML Document seems broken.\n" + e);					exit();				}				//Count all items in 				numOfItems = countItems(myDoc);				//				alert("You have "+numOfItems+" Items");								try{					makeAttributesFromInfo(myDoc);									}catch (e){				alert("ERROR: No i could not make your Attributes for processing the xml" + e);				exit();				}								try{					sortGroups(myDoc);									}catch(e){					alert("ERROR: Could not move Elements to group" + e);					exit();				}				try{		// first we move the normal ones to the front than the focus small stays at end				sortInGroupByPriority(myDoc);				}catch(e){										alert("ERROR: Could not move the normal Elements in group" + e);					exit();					}									try{makeImgElement(myDoc);					}catch (e){												alert("ERROR: Could not move the image Elements into new Element group" + e);						exit();						}		// -------------------------		// From here on it does something on the page			var myPageName;			var myPage;			var myParStyles = makeParstylesArray(myDoc);			var myCharStyles = makeCharstylesArray(myDoc);			//			try{////			myPageName = myPageDialogUI(myDoc);		////				//				myPage = myDoc.pages.item(myPageName);//			} catch(e){//				//				alert("ERROR: Sorry cant find the page u want\n "+e);//				exit();//			}									}			else{				myAppendDialoge.destroy();							}					myUI(myDoc, myPage,myPageName , myList);	//	var myFrame = myPage.textFrames.add();//	myFrame.geometricBounds = myGetColumns(myDoc,myPage);	alert("Done");}}function myUI(myDoc, myPage,myPageName, myList){	var myNumOItems = 0;//	var myGroupList //= myDoc.xmlElements.item("Root").xmlElements.item("seite").xmlElements.everyItem().markupTag.name;		//	myGroups =  myDoc.xmlElements.item("Root").xmlElements.item("seite").xmlElements.item("group");//	for (var i = 0;i < myGroups.xmlElements.length;i++ ){////		myNumOItems = myNumOItems + myGroups.xmlElements.length;////		myNumOItems = myGroups.xmlElements.length;//		myGroupList = myGroups.xmlElements.item(i).xmlAttributes.item("id").value.toString();//		//	}    //<fragment>	var myDialog = app.dialogs.add({name:"XML Importer", canCancel:true});	with(myDialog){		//Add a dialog column.		with(dialogColumns.add()){			//Create a border panel.//			//Create another border panel.//			with(borderPanels.add()){//				with(dialogColumns.add()){//					staticTexts.add({staticLabel:" There are "+myNumOItems+" items to process. Sry doesntwotk right now"});//				}//			}						//Create another border panel.//			with(borderPanels.add()){//				with(dialogColumns.add()){//					staticTexts.add({staticLabel:"Chose Group to place"});//				}	//				with(dialogColumns.add()){//					//Create a pop-up menu ("dropdown") control.//					var myGroupDropdown = dropdowns.add({//						stringList:myGroupList,//						selectedIndex:0});//				}//				var myAddPage = checkboxControls.add({//					staticLabel: "or create a new page",////				checkedState: true	//				});//			}			with(borderPanels.add()){				with(properties){					minWidth:200									}				with(dialogColumns.add()){				staticTexts.add({staticLabel:"Chose Group to place"});			}					with(dialogColumns.add()){					//Create a pop-up menu ("dropdown") control.					var myGroupDropdown = dropdowns.add({						stringList:["0","1","2","3","4","5","6","7","8","9","10"],						selectedIndex:0});				}				var myPlaceAll = checkboxControls.add({					staticLabel: "or place everything. DANGEROUS!",//				checkedState: true					});							}			//Create another border panel.			with(borderPanels.add({minWidth:200})){				with(dialogColumns.add()){					staticTexts.add({staticLabel:"Chose page to place"});				}					with(dialogColumns.add()){					//Create a pop-up menu ("dropdown") control.					var myPageDropdown = dropdowns.add({						stringList:myList,						selectedIndex:0});				}				var myAddPage = checkboxControls.add({					staticLabel: "or create a new page",//				checkedState: true					});			}			//Create another border panel.			with(borderPanels.add({minWidth:200})){								var myFocusCheckBox = checkboxControls.add({					staticLabel: "place focus",				checkedState: true					});				var myNormalCheckBox = checkboxControls.add({					staticLabel: "place normal",					checkedState: true					});				var mySmallCheckBox = checkboxControls.add({					staticLabel: "place small",					checkedState: true					});				}			with(borderPanels.add({minWidth:200})){								var myClearStructureCheckbox = checkboxControls.add({					staticLabel: "remove all xmlElements after import?",				checkedState: true					});								}							}		}		//Display the dialog box.	if(myDialog.show() == true){//		//Get the vertical justification setting from the pop-up menu.//		if(myPageDropdown.selectedIndex == 0){//			myVerticalJustification = VerticalJustification.topAlign;	//		}//		var myPage;//		var myPageName;		if(myAddPage.checkedState==true){			myPage = myDoc.pages.add();			myPageName = myPage.name;		}else {//			myPage = myList[myPageDropdown.selectedIndex];			myPageName =  myList[myPageDropdown.selectedIndex];		}				var focusBool;		if(myFocusCheckBox.checkedState==true){			focusBool = true;					}else{			focusBool = false;					}		var normalBool;		if(myNormalCheckBox.checkedState==true){			normalBool = true;		}else{			normalBool = false;		}						var smallBool;		if(mySmallCheckBox.checkedState==true){			smallBool = true;		}else{			smallBool = false;		}				var placeAllBool;		if(myPlaceAll.checkedState==true){			placeAllBool = true;		}else{			placeAllBool = false;		}				var clearStructure;		if(myClearStructureCheckbox.checkedState==true){			clearStructure = true;		}else{			clearStructure = false;		}				var groupSelector;		groupSelector = myGroupDropdown.selectedIndex;		myDialog.destroy();		//here has to come the xml processing				myPage = myDoc.pages.item(myPageName);				placeData(myDoc,myPage,groupSelector, placeAllBool, focusBool,normalBool , smallBool);		if(clearStructure ==true ){			myDoc.xmlElements.everyItem().remove();		}	}	else{		myDialog.destroy();		alert("all that thinking for nothing? Better luck nexttime!");			}}
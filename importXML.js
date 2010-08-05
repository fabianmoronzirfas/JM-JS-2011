﻿/* * @author fabiantheblind *  *  */// You must copy the file "glue code.jsx" from the XML Rules folder (inside the// Scripts// folder inside your InDesign folder) to the folder containing this script, or// provide a full// path to the file in the next line.#include "./meta/glue code.jsx";#include "./meta/processXML.js";#include "./meta/setupStyles.js";main();// ------------function myGetFileName()  {   	var myFolder = app.activeDocument.filePath;      var myFile =  new File( myFolder+'/log.txt' )  //      if ( myFile == null ){exit()};     return myFile;   }  function mapManually(myDoc){		myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelNr"),myDoc.paragraphStyles.item("ARTIKEL_Nr"));	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("laufNummer"),myDoc.characterStyles.item("laufNummer"));	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelBezeichnungMitLN"),myDoc.paragraphStyles.item("ARTIKEL_Bezeichnung")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelBezeichnung"),myDoc.paragraphStyles.item("ARTIKEL_Bezeichnung")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelBeschreibung"),myDoc.paragraphStyles.item("ARTIKEL_Beschreibung")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelText"),myDoc.paragraphStyles.item("ARTIKEL_Text")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelText_Aufzaehlung"),myDoc.paragraphStyles.item("ARTIKEL_Text")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelZeileANBPmitLN"),myDoc.paragraphStyles.item("ARTIKEL_Zeile_ANBP_mit_LN")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelZeileANPmitLN"),myDoc.paragraphStyles.item("ARTIKEL_Zeile_ANP_mit_LN")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelZeileABPmitLN"),myDoc.paragraphStyles.item("ARTIKEL_Zeile_ABP_mit_LN")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelZeileANBPohneLN"),myDoc.paragraphStyles.item("ARTIKEL_Zeile_ANBP_ohne_LN")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelZeileANPohneLN"),myDoc.paragraphStyles.item("ARTIKEL_Zeile_ANP_ohne_LN")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("artikelZeileABPohneLN"),myDoc.paragraphStyles.item("ARTIKEL_Zeile_ABP_ohne_LN")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("laufNummerBild"),myDoc.paragraphStyles.item("LAUFNUMMER_am_Bild")) ;	myDoc.xmlImportMaps.add(myDoc.xmlTags.item("preis"),myDoc.paragraphStyles.item("PREIS")) ;	myDoc.mapXMLTagsToStyles();}function main(){		var numOfItems;	var myDate = new Date();	var myLogFile = myGetFileName();	var myFileContent = myLogFile.read();	var myErrorLog = myFileContent +"\n"+"Starting Log file at "+myDate +"\n";	var myItemsList = new Array;	var myList;	var myPageName;	var myPage;			var myDoc = app.activeDocument;		with(myDoc){		viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;		viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;		viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;		}				makeMetaStyle(myDoc);//		var myParStyles = makeParstylesArray(myDoc);//		var myCharStyles = makeCharstylesArray(myDoc);		 myList = myDoc.pages.everyItem().name;		myErrorLog = myErrorLog + "Got these Pages: "+ myList.toString() + "\n";	// set the XMLImport preferences		xmlImportPref(myDoc);		var myAppendDialoge =  app.dialogs.add({name:"Continue or Import", canCancel:true});		with(myAppendDialoge){			//Add a dialog column.						with(dialogColumns.add()){				with(dialogRows.add()){				//Create a border panel.				//Create another border panel.				with(borderPanels.add()){					with(dialogColumns.add()){						staticTexts.add({staticLabel:"Press \"Ok\" for a new XML import."});																				}				}			}			with(dialogColumns.add()){				with(dialogRows.add()){				//Create a border panel.				//Create another border panel.				with(borderPanels.add()){					with(dialogColumns.add()){						staticTexts.add({staticLabel:"   Press \"Abbrechen\" to continue..."});						}					}				}			}		}	}					//Display the dialog box.			if(myAppendDialoge.show() == true){				myAppendDialoge.destroy();				var myRoot;				try {					var myXMLFile = File.openDialog("Choose your .xml file");					myErrorLog = myErrorLog + "Got this xml file: "+ myXMLFile.displayName.toString() + "\n";					myRoot = myDoc.importXML(myXMLFile);									} catch (e) {					alert("ERROR: :( Sorry, your XML Document seems broken.\n" + e);					myErrorLog = myErrorLog + e.toString() + "\n";									}								mapManually(myDoc);//				Count all items in.//				this isnt essential for the script				numOfItems = countItems(myDoc);				myErrorLog = myErrorLog + "Got "+ myList.toString() + "  items in this xml \n";								try{					makeAttributesFromInfo(myDoc);									}catch (e){				alert("ERROR: No i could not make your Attributes for processing the xml" + e);				myErrorLog = myErrorLog + e.toString() + "\n";				}								try{					sortGroups(myDoc);									}catch(e){					alert("ERROR: Could not move Elements to group" + e);					myErrorLog = myErrorLog + e.toString() + "\n";				}				try{		// first we move the normal ones to the front than the focus small stays at end				sortInGroupByPriority(myDoc);				}catch(e){										alert("ERROR: Could not move the normal Elements in group" + e);					myErrorLog = myErrorLog + e.toString() + "\n";				}									try{						makeImgElement(myDoc);					}catch (e){												alert("ERROR: Could not move the image Elements into new Element group" + e);						myErrorLog = myErrorLog + e.toString() + "\n";					}						try{						makeItemList(myDoc);					}catch (e){												alert("ERROR: Could not make the list of items. the single import wont work" + e);						myErrorLog = myErrorLog + e.toString() + "\n";											}		// -------------------------		// From here on it does something on the page			} else {				myAppendDialoge.destroy();				}					var myItemsListElement =  myDoc.xmlElements.item(0).xmlElements.item("itemsList");	for (var i =0 ;i < myItemsListElement.xmlElements.length;i++){		myItemsList[i] = myItemsListElement.xmlElements.item(i).markupTag.name;		}		myUI(myDoc, myPage,myPageName , myList,myItemsList,myErrorLog,myLogFile);			}function myUI(myDoc, myPage,myPageName, myList,myItemsList, myErrorLog, myLogFile){	var myNumOItems = 0;	var myMinWidth = 250;		var myDialog = app.dialogs.add({name:"XMLImporter", canCancel:true});	with(myDialog){		//Add a dialog column.		with(dialogColumns.add()){			//Create a border panel.							var allSelector = enablingGroups.add({					staticLabel: "place all and remove",					checkedState: true,					minWidth: myMinWidth				});				with (allSelector) {					var myPlaceAll = checkboxControls.add({						staticLabel: "place every item!",					checkedState: true						});					var myClearStructureCheckbox = checkboxControls.add({						staticLabel: "remove all xml elements after import?",						checkedState: true						});				}										var pageSelector = enablingGroups.add({					staticLabel: "choose page",					checkedState: false,					minWidth: myMinWidth				});				with (pageSelector) {									with (dialogColumns.add()) {						staticTexts.add({							staticLabel: "chose page to place"						});					}					with (dialogColumns.add()) {						//Create a pop-up menu ("dropdown") control.						var myPageDropdown = dropdowns.add({							stringList: myList,							selectedIndex: 0						});					}//					var myAddPage = checkboxControls.add({//						staticLabel: "or create a new page"//					//				checkedState: true	//					});				}											var groupSelector = enablingGroups.add({staticLabel: "place group", checkedState: false,minWidth :myMinWidth});		with (groupSelector) {						with (dialogColumns.add()) {				staticTexts.add({					staticLabel: "chose group to place"				});			}			with (dialogColumns.add()) {				//Create a pop-up menu ("dropdown") control.				var myGroupDropdown = dropdowns.add({					stringList: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],					selectedIndex: 0				});			}						staticTexts.add({				staticLabel: "choose scope:"			});			var myRadioButtonGroup = radiobuttonGroups.add();			with (myRadioButtonGroup) {				var myLeftRadioButton = radiobuttonControls.add({					staticLabel: "focus",					checkedState: true				});				var myCenterRadioButton = radiobuttonControls.add({					staticLabel: "normal"				});				var myRightRadioButton = radiobuttonControls.add({					staticLabel: "small"				});							}		}					var itemSelector = enablingGroups.add({staticLabel: "place item", checkedState: false,minWidth :myMinWidth});			with(itemSelector){				with(dialogColumns.add()){					//Create a pop-up menu ("dropdown") control.					var myArtikelDropdown = dropdowns.add({						stringList: myItemsList						//selectedIndex:0						});				}				}						//Create another border panel.						var tbAndPrSelector = enablingGroups.add({staticLabel: "tables or prices", checkedState: false,minWidth :myMinWidth});			with(tbAndPrSelector){				var myPlaceTablesCheckbox = checkboxControls.add({					staticLabel: "place all tables on selected page?"//				checkedState: true					});				var myPlacePricesCheckbox = checkboxControls.add({					staticLabel: "add all Prices from xml structure?"//				checkedState: true					});								var myPlaceTablesExitCheckbox = checkboxControls.add({						staticLabel: "end after placing the tables or prices?",					checkedState: true						});			}					}		//Display the dialog box.	if(myDialog.show() == true){//		var myPage;//		var myPageName;//		page selector box		if(pageSelector.checkedState!=true ){			myPage = myDoc.pages.add();			myPageName = myPage.name;		}else {//			myPage = myList[myPageDropdown.selectedIndex];			myPageName =  myList[myPageDropdown.selectedIndex];		}				if(tbAndPrSelector.checkedState == true && myPlacePricesCheckbox.checkedState==true){//			myPage = myDoc.pages.add();//			myPageName = myPage.name;		}								if(tbAndPrSelector.checkedState == true){			var placeTables;			if(myPlaceTablesCheckbox.checkedState==true){				placeTables = true;				placePrices = false;			}else{				placeTables = false;			}						var placePrices;			if(myPlacePricesCheckbox.checkedState==true){				placePrices = true;				placeTables = false;			}else{				placePrices = false;			}									var exitAfterTables;			if(myPlaceTablesExitCheckbox.checkedState==true){				exitAfterTables = true;			}else{				exitAfterTables = false;			}		}				if(placeTables ==true ){			var myNewPage = myDoc.pages.item(myPageName);			for(var i = 0; i <11;i++){			placeAllTables(myDoc,myNewPage,i);				}			if(exitAfterTables == true){				exit();							}					}						if(placePrices ==true ){			placeAllPrices(myDoc);			if(exitAfterTables == true){				exit();							}					}						var placeAllBool;		var focusBool;		var normalBool;		var smallBool;		var itemBool;		var groupSelector;							if((myPlaceAll.checkedState == true)){						placeAllBool = true;			focusBool = false;				normalBool = false;			smallBool = false;			itemBool = false;//			  groupSelector = 0;		} else{				if(groupSelector.checkedState = true){			groupSelector = myGroupDropdown.selectedIndex;			placeAllBool = false;			if(myRadioButtonGroup.selectedButton==0){				focusBool = true;					normalBool = false;				smallBool = false;				itemBool = false;			}else if(myRadioButtonGroup.selectedButton==1){				focusBool = false;					normalBool = true;				smallBool = false;				itemBool = false;			}else if(myRadioButtonGroup.selectedButton==2){				focusBool = false;					normalBool = false;				smallBool = true;				itemBool = false;			}		}												var theItem;		if(itemSelector.checkedState == true){			placeAllBool = false;			focusBool = false;				normalBool = false;			smallBool = false;			itemBool = true;						var preTheItem = myItemsList[myArtikelDropdown.selectedIndex];			var theItem = preTheItem.substring(4);		}		}		var clearStructure;		if(myClearStructureCheckbox.checkedState==true){			clearStructure = true;		}else{			clearStructure = false;		}		myDialog.destroy();				myPage = myDoc.pages.item(myPageName);				placeData(myDoc, myPage, groupSelector, placeAllBool, focusBool, normalBool, smallBool,itemBool,theItem,myErrorLog,myLogFile);				if(clearStructure ==true ){			myDoc.xmlElements.everyItem().remove();		}	}	else{				myDialog.destroy();		var myFile = myLogFile;   		var myData = myErrorLog;		writeData (myFile, myData );		alert("all that thinking for nothing? Better luck nexttime!");			}	}	  }//---------- functions taken from RecordFindChange_CS3-CS5.jsx
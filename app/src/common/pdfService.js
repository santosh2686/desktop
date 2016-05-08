app.factory('pdfService',[function(){
    return{
        buildPDF:function(column,row,title,pdfName,rightTextCol,filter){
            var doc = new jsPDF({unit:'pt', lineHeight:1.5, orientation:'l'});			 
			doc.setFont('helvetica');
			doc.setFontSize(14);
			doc.text(title,10,20);
            if(filter){
                doc.setFontSize(11);
                doc.text(filter,10,40);
            };
            doc.autoTable(column,row,{
				theme:'grid',
				styles:{font: "helvetica",overflow:'linebreak'},
				bodyStyles:{valign:'top'},
				headerStyles:{fillColor: [0,186,139]},
				columnStyles:{},
				margin:{top:(filter?50:30),left:10,right:10,bottom:10},
				createdCell:function(cell,data){
					if(rightTextCol && data.column.dataKey===rightTextCol){
						cell.styles.halign='right';
					}
				}
			});
			doc.save(pdfName+'.pdf');
		}	
    }
}]);
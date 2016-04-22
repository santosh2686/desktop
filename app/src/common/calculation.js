app.factory('calculation',[function(){
    return{
        convertIntoDate:function(str){
            return str.getFullYear()+'/'+(str.getMonth()+1)+'/'+str.getDate();
        },
        convertIntoTime:function(str){
            return str.getHours()+':'+str.getMinutes()+':'+str.getSeconds();
        },
        duration:function(sDate,eDate,sTime,eTime){
            var buildSDate=this.convertIntoDate(sDate);
            var buildSTime=this.convertIntoTime(sTime);
            var startTimeStamp = new Date(buildSDate + ' ' + buildSTime);

            var buildEDate=this.convertIntoDate(eDate);
            var buildETime=this.convertIntoTime(eTime);
            var EndTimeStamp = new Date(buildEDate + " " + buildETime);	
            return (EndTimeStamp-startTimeStamp);
        }
    }		
}]);
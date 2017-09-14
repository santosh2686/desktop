app.factory('config',['$http',function($http){
	var localEnv=false;
    return{
			local:localEnv,
            apiKey:'NNY26lvUYux1Rz5H-7QLgNB28lsBmg0K',
            baseUrl:localEnv?'http://localhost:9090/api/travel':'v1',
			login:'/login',
            regular:'/request',
			fixed:'/fixedRequest',
			package:'/packages',
			vehicle:'/vehicles',
			party:'/party',
			driver:'/drivers',
			vehicleExpense:'/expense',
			driverExpense:'/driverExpense',
			months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],			
			years:function(){
				var yearList=[],currYear = new Date().getFullYear();
				for(var i=2015; i<currYear+1;i++){
					yearList.push(i);
				}
				return yearList;	
			},
			inWords:function(s){
	 var th = ['','thousand','million', 'billion','trillion'],dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine'],tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'],tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

	 s = s.toString(); s = s.replace(/[\, ]/g,''); if (s != parseFloat(s)) return 'not a number'; var x = s.indexOf('.'); if (x == -1) x = s.length; if (x > 15) return 'too big'; var n = s.split(''); var str = ''; var sk = 0; for (var i=0; i < x; i++) {if ((x-i)%3==2) {if (n[i] == '1') {str += tn[Number(n[i+1])] + ' '; i++; sk=1;} else if (n[i]!=0) {str += tw[n[i]-2] + ' ';sk=1;}} else if (n[i]!=0) {str += dg[n[i]] +' '; if ((x-i)%3==0) str += 'hundred ';sk=1;} if ((x-i)%3==1) {if (sk) str += th[(x-i-1)/3] + ' ';sk=0;}} if (x != s.length) {var y = s.length; str += 'point '; for (var i=x+1; i<y; i++) str += dg[n[i]] +' ';} return str.replace(/\s+/g,' ');
		},
        guid:function(){
          function s4(){
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        },
        getData:function(colName,filterQuery){
            return this.local?$http.get(this.baseUrl+colName+'?'+filterQuery):
            $http.get(this.baseUrl+colName+'?apiKey='+this.apiKey+'&'+filterQuery);
        },
        postData:function(colName,data){
            return this.local?$http.post(this.baseUrl+colName,JSON.stringify(data)):
            $http.post(this.baseUrl+colName+'?apiKey='+this.apiKey,JSON.stringify(data))
        },
        updateData:function(colName,docFilter,data){
            return this.local?$http.put(this.baseUrl+colName+'?q='+docFilter,JSON.stringify(data)):
            $http.put(this.baseUrl+colName+'?apiKey='+this.apiKey+'&q='+docFilter,JSON.stringify(data));
        },
        deleteData:function(colName,id){
            return this.local?$http.delete(this.baseUrl+''+colName+'/'+id+'?c=true'):
            $http.delete(this.baseUrl+''+colName+'/'+id+'?c=true&apiKey='+this.apiKey);
        }
	}
}]);

app.constant('gridMap',{
    'PACKAGE':[{
            "name":"Package Code",
            "hideOn":"phone",
            "map":"packageCode"
        },{
            "name":"Basic Amount",
            "map":"basicAmt",
            "type":"amount"
        },{
            "name":"Minimum KMs",
            "map":"kmRate.minKm"
        },{
            "name":"Minimum Hours",
            "map":"hrRate.minHr"
        },{
            "name":"Extra KM Rate",
            "map":"kmRate.extraKm",
            "type":"amount",
            "hideOn":"phone,tablet"
        },{
            "name":"Extra HR Rate",
            "map":"hrRate.extraHr",
            "type":"amount",
            "hideOn":"phone,tablet"
        }],
    'VEHICLE':{
        'OWN':[{
            "name":"Vehicle No.",
            "map":"vehicleNo"
        },{
            "name":"Vehicle Name",
            "hideOn":"phone,tablet",
            "map":"vehicleName"
        },{
            "name":"Vehicle owner",
            "hideOn":"phone",
            "map":"vehicleOwner"
        },{
            "name":"Vehicle Type",
            "hideOn":"phone,tablet",
            "map":"vehicleType"
        },{
            "name":"Loan",
            "type":"amount",
            "map":"loan.loanAmt"
        },{
            "name":"Fixed To Company",
            "map":"selectFixed"
        }],
        'OTHER':[{
            "name":"Vehicle No.",
            "map":"vehicleNo"
        },{
            "name":"Vehicle Name",
            "hideOn":"phone",
            "map":"vehicleName"
        },{
            "name":"Vehicle owner",
            "map":"vehicleOwner"
        },{
            "name":"Vehicle Type",
            "hideOn":"phone",
            "map":"vehicleType"
        }]
    },
    'PARTY':{
        'CLIENT':[{
            "name":"Party Name",
            "map":"name"
        },{
            "name":"Party Address",
            "hideOn":"phone,tablet",
            "map":"address"
        },{
            "name":"Party Contact",
            "type":"phone",
            "map":"contact"
        },{
            "name":"Party Email",
            "hideOn":"phone,tablet",
            "map":"email"
        },{
            "name":"Comments",
            "hideOn":"phone,tablet",
            "map":"comments"
        }],
        'OPERATOR':[{
            "name":"Operator Name",
            "map":"name"
        },{
            "name":"Operator Address",
            "map":"address",
            "hideOn":"phone,tablet"
        },{
            "name":"Operator contact",
            "map":"contact",
            "type":"phone"
        },{
            "name":"Operator Email",
            "map":"email",
            "hideOn":"phone,tablet"
        },{
            "name":"Vehicle",
            "map":"vehicle",
            "hideOn":"phone,tablet",
            "type":"repeat"
        },{
            "name":"Comments",
            "map":"comments",
            "hideOn":"phone,tablet"
        }]
    }
});
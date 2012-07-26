/* TODO:
  I need to add buttons for adding and deleting tasks.
  I need to add error checking to the fields.
*/
Ext.Loader.setConfig({
    enabled: true
});

//Let the loader know where to look for this example module.  Use the CDN for speed

Ext.Loader.setPath('Ext.ux', 'http://cdn.sencha.io/ext-4.1.1-gpl/examples/ux');


//To reduce load times, only bring in the portions of Ext that we actually need

Ext.require([
    'Ext.layout.container.*',
    'Ext.tab.*',
    'Ext.grid.*',
    'Ext.form.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.RowExpander',
    'Ext.selection.CellModel',
    'Ext.button.*'
]);

//Execute the code in the following function when the page is ready.
Ext.onReady(function () {


    //define a local namespace, so we don't pollute the global namespace.  We don't use all locals because we
    //may want to recycle this app later.
    Ext.namespace("taskMaster");

   //register a new model with ExtJs
    Ext.regModel('taskModel', {
        fields:[
            {name:'Name', type:'string'},
            {name:'Description', type:'string'},
            {name:'Priority', type:'string'},
            {name:'DateStarted', type:'string'},
            {name:'TimeStarted', type:'string'},
            {name:'DateDue', type: 'string'},
            {name:'Status', type:'string'},
        ]
    });

    // Some sample data to populate our table
    var myData = [
        ['Learn Javascript', 'I need to read, Javascript, the Good Parts', 'high' ,'','','','' ]
    ];


    //Ext is a MVC framework for single page web apps.   It has the concept of data stores.   There can
    //be multiple views on the data...
    var store = Ext.create('Ext.data.Store', { model:'taskModel', data: myData});

    // for now, we'll edit our grid one cell at a time.  Later, we may experiment with row editing.
    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

    //Let's setup the properties for our columns
    //dataIndex points to the field in our store that we will actually take data from.
    var gridColumns = [];

    gridColumns.push({header:'Name', width:120, sortable:true, dataIndex:'Name', editor: {
        xtype: 'textfield',
        allowBlank: false}});
    // here I include a hidden property just to remind myself that it is possible to hide columns.   For example,
    // for this app, we might imagine storing a taskID with the primary key in the database.

    gridColumns.push({header:'Description', width:120, hidden:false, sortable:true, dataIndex:'Description', editor: {
        xtype: 'textfield',
        allowBlank: false}});

    //Here, we add a combobox editor
    gridColumns.push({header:'Priority', width:120, hidden:false, sortable:true, dataIndex:'Priority', editor: new Ext.form.field.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        selectOnTab: true,
        store: [
            ['High','High'],
            ['Medium','Medium'],
            ['Low','Low']
        ]
    })});

    gridColumns.push({header:'Start Date', width:120, sortable:true, dataIndex:'DateStarted', editor: {
        xtype: 'datefield',
        allowBlank: false
    }});

    // Here, the time field actually will display a datetime rather than a time, so I use a renderer
    // to show things in the proper format.

     taskMaster.timefieldRenderer = function(format) {
        return function(v) {
            if (v instanceof Date) {
                return v.format(format);
            } else {
                return v;
            }
        };
    };
    gridColumns.push({header:'Start Time', width:120, sortable:true, dataIndex:'TimeStarted', editor: {
        xtype: 'timefield',
        increment: 30,
        minValue: '6:00 AM',
        maxValue: '8:00 PM',
        renderer: Ext.util.Format.dateRenderer('H:i A'),
        allowBlank: false
    }});
    gridColumns.push({header:'Due Date', width:120, sortable:true, dataIndex:'DateDue', editor: {
        xtype: 'datefield',
        allowBlank: false,
    }});
    gridColumns.push({header:'Status', width:120, hidden:false, sortable:true, dataIndex:'Status', editor: new Ext.form.field.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        selectOnTab: true,
        store: [
            ['0','0'],
            ['0.25','25%'],
            ['0.5','50%'],
            ['0.75','75%'],
            ['1.00','Done'],
        ]
    })});


    /*GridPanel that displays the data*/
    taskMaster.grid = new Ext.grid.GridPanel({
        store:store,
        columns:gridColumns,
        stripeRows:true,
        height:350,
        width:950,
        plugins: [cellEditing],
        title:'Task Master',
        collapsible: false,
        animCollapse: false

    });


    var button =  new Ext.Button({applyTo:'button-div',text:'Submit!', minWidth: 130, handler: submitHandler});
    var conn = new Ext.data.Connection();

    taskMaster.successFunction = function(response) {
        var idealdata = Ext.decode(response);
        var h = idealdata[0];
        var k = idealdata[1];
        var l = idealdata[2];
        var f = idealdata[3];
        structureFactors.resultPanel.store.data.items[0].data["h"] = h;
        structureFactors.resultPanel.store.data.items[0].data["k"] = k;
        structureFactors.resultPanel.store.data.items[0].data["l"] = l;
        structureFactors.resultPanel.store.data.items[0].data["|F|"] = f;
        structureFactors.resultPanel.getView().refresh();

        //Updating desired data table
        var counter = 0;
        changes = ['twotheta', 'theta', 'omega', 'chi', 'phi'];
        for (var i = 0; i < structureFactors.resultsStore.getCount(); i++){
            var record = structureFactors.resultsStore.getAt(i);

            if (record.data['h'] != 0 || record.data['k'] != 0 || record.data['l'] != 0){
                //if it's not a (0,0,0) vector, update its calculated angles
                if (idealdata[counter] === 'Error') {
                    //setting up the error message
                    record.set('twotheta', 'Invalid');
                    record.set('theta', 'Vector!');
                    record.set('omega', 'Not in');
                    record.set('chi', 'Scattering');
                    record.set('phi', 'Plane.');
                }
                else{
                    for (var c in changes) {
                        var fieldName = changes[c];
                        record.set(fieldName, idealdata[counter][fieldName]);
                    }

                }
                counter = counter+1;
            }
        }

        //resultsStore.commitChanges();
    }

    //function getVals(){
    //    console.log('hi');
    //    console.log(Ext.ComponentQuery.query('panel #latticeParameters')[0].items.items[0].items.items[0].name);
    //    console.log(Ext.ComponentQuery.query('panel #latticeParameters')[0].items.items[0].items.items[0].value);
    //    //keys gives a map of componentId to number
    //}

    function submitHandler(button, event) {

        //var results=getVals();


        params = {'observations': [] };
        params.lattice=[];
        params.element=[];
        params.num=[];

        var a = Ext.ComponentQuery.query('panel #latticeParameters')[0].getComponent('latticeFieldSetTop').query('textfield[name="a"]')[0].value;
        var b = Ext.ComponentQuery.query('panel #latticeParameters')[0].getComponent('latticeFieldSetTop').query('textfield[name="b"]')[0].value;
        var c = Ext.ComponentQuery.query('panel #latticeParameters')[0].getComponent('latticeFieldSetTop').query('textfield[name="c"]')[0].value;
        var alpha = Ext.ComponentQuery.query('panel #latticeParameters')[0].getComponent('latticeFieldSetMiddle').query('textfield[name="alpha"]')[0].value;
        var beta = Ext.ComponentQuery.query('panel #latticeParameters')[0].getComponent('latticeFieldSetMiddle').query('textfield[name="beta"]')[0].value;
        var gamma = Ext.ComponentQuery.query('panel #latticeParameters')[0].getComponent('latticeFieldSetMiddle').query('textfield[name="gamma"]')[0].value;
        params.lattice.push({
            a:a,
            b:b,
            c:c,
            alpha:alpha,
            beta:beta,
            gamma:gamma
        });
        var num = Ext.ComponentQuery.query('panel #latticeParameters')[0].getComponent('latticeFieldSetBottom').query('textfield[name="num"]')[0].value;
        params.num.push({
            num: num
        });
        for (var i=0; i<num; i++) {

            var symbol = structureFactors.grid.store.data.items[i].data.Symbol;
            var element = structureFactors.grid.store.data.items[i].data.Element;
            //var wyckoff = structureFactors.grid.store.data.items[i].data.wycoffPosition;
            var x = structureFactors.grid.store.data.items[i].data.X;
            var y = structureFactors.grid.store.data.items[i].data.Y;
            var z = structureFactors.grid.store.data.items[i].data.Z;
            var occupancy = structureFactors.grid.store.data.items[i].data.Occupancy;
            var B = structureFactors.grid.store.data.items[i].data.B;
            params.element.push({
                symbol:symbol,
                element:element,
                //wyckoff:wyckoff,
                x:x,
                y:y,
                z:z,
                occupancy:occupancy,
                B:B
            });
        }



        //only sends the observations that aren't (0,0,0)
//        for (var i = 0; i < store.getCount(); i++) {
//            var record = store.getAt(i)
//            if (record.data['h'] != 0 || record.data['k'] != 0 || record.data['l'] != 0){
//                params['data'].push(record.data);
//            }
//        };
        var data=Ext.JSON.encode(params);
        $.ajax({
            url: '/nuclear_scattering',
            type: 'POST',
            data: {'data' : data},
            success: function(response, a, b, c) {
                //projectid is not in scope here; calling another function that has it.
                structureFactors.successFunction(response);
            }
        });
    }

    taskMaster.taskPanel = new Ext.Panel({
        layout: 'table',
        width: 1100,
        layoutConfig: {
            columns: 2
        },
        items: [taskMaster.grid, button]
    });



    var myTabs = new Ext.TabPanel({
        resizeTabs: true, // turn on tab resizing
        minTabWidth: 115,
        tabWidth: 135,
        enableTabScroll: true,
        width: 1150,
        height: 765,
        activeItem: 'taskMasterTab', //Making the calculator tab selected first
        defaults: {autoScroll:true},
        items: [
            {
                title: 'Task Master',
                id: 'taskMasterTab',
                iconCls: '/static/img/silk/calculator.png',
                items: [taskMaster.taskPanel]
            }, {
                title: 'Help Manual',
                id: 'helpmanualtab',
                padding: 5,
                iconCls: '/static/img/silk/help.png',
                html: '<h1>Hi</h1>'

            }
        ]
    });

// ************************** END - Setting up the tabs  **************************
    myTabs.render('tabs');
});

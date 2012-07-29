Ext.onReady(function() {
    /*
     * Initialize the application.
     */
    // OpenLayers
    OpenLayers.Number.thousandsSeparator = ' ';
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
    OpenLayers.DOTS_PER_INCH = 72;
    OpenLayers.ProxyHost = "${request.route_url('ogcproxy')}?url=";

    // Ext
    Ext.QuickTips.init();

    OpenLayers.ImgPath = "${request.static_url('gpmap:static/lib/cgxp/core/src/theme/img/ol/')}";
    Ext.BLANK_IMAGE_URL = "${request.static_url('gpmap:static/lib/cgxp/ext/Ext/resources/images/default/s.gif')}";

    app = new gxp.Viewer({
        portalConfig: {
            layout: "card",
            id: 'main',
            activeItem: 0,
            items: [{
                layout: 'border',
                items: [{
                    region: "north",
                    contentEl: 'header-out'
                },
                {
                    region: 'center',
                    layout: 'border',
                    id: 'center',
                    tbar: [],
                    items: [
                        "app-map"
                    ]
                }]
            }]
        },

        // configuration of all tool plugins for this application
        tools: [
        {
            ptype: "cgxp_fulltextsearch",
            url: "${request.route_url('fulltextsearch', path='')}",
            layerTreeId: "layertree",
            actionTarget: "center.tbar"
        },
        {
            ptype: "cgxp_measure",
            actionTarget: "center.tbar",
            toggleGroup: "maptools"
        },
        {
            ptype: "cgxp_permalink",
            actionTarget: "center.tbar"
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '-'
        },
        {
            ptype: "gpmap_gpprint",
            actionTarget: "center.tbar",
            outputTarget: "main",
            toggleGroup: "maptools",
            printURL: "${request.route_url('printproxy')}"
        },
        {
            ptype: "gpmap_gpprint",
            actionTarget: "center.tbar",
            outputTarget: "main",
            toggleGroup: "maptools",
            printURL: "${request.route_url('printproxy')}",
            printText: "Print Scale",
            scale: true
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '->'
        },
        {
            ptype: "cgxp_redlining",
            toggleGroup: "maptools",
            actionTarget: "center.tbar"
        },
        {
            ptype: "cgxp_legend",
            id: "legendPanel",
            toggleGroup: "maptools",
            actionTarget: "center.tbar"
        }
        ],

        // layer sources
        sources: {
            "olsource": {
                ptype: "gxp_olsource"
            }
        },

        // map and layers
        map: {
            id: "app-map", // id needed to reference map in portalConfig above
            xtype: 'cgxp_mappanel',
            projection: "EPSG:21781",
            stateId: "map",
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            units: "m",
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.KeyboardDefaults(),
                new OpenLayers.Control.PanZoomBar({panIcons: false}),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine({
                    bottomInUnits: false,
                    bottomOutUnits: false
                }),
                new OpenLayers.Control.MousePosition({
                    numDigits: 3,
                    displayProjection: new OpenLayers.Projection("EPSG:4326")
                }),
                new OpenLayers.Control.OverviewMap({
                    size: new OpenLayers.Size(200, 100),
                    mapOptions: {
                        theme: null
                    },
                    minRatio: 32,
                    maxRatio: 32,
                    layers: [new OpenLayers.Layer.OSM("OSM", [
                            'http://a.tile.openstreetmap.org/${"${z}"}/${"${x}"}/${"${y}"}.png',
                            'http://b.tile.openstreetmap.org/${"${z}"}/${"${x}"}/${"${y}"}.png',
                            'http://c.tile.openstreetmap.org/${"${z}"}/${"${x}"}/${"${y}"}.png'
                        ], {
                            transitionEffect: 'resize',
                            attribution: [
                                "(c) <a href='http://openstreetmap.org/'>OSM</a>",
                                "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>by-sa</a>"
                            ].join(' ')
                        }
                    )]
                })
            ],
            layers: [{
                source: "olsource",
                type: "OpenLayers.Layer.OSM",
                args: []
            }],
            items: []
        }
    });

    app.on('ready', function() {
        // remove loading message
        Ext.get('loading').remove();
        Ext.fly('loading-mask').fadeOut({
            remove: true
        });
    }, app);
});


/*
 * Initialize the application.
 */
// OpenLayers
OpenLayers.Number.thousandsSeparator = ' ';
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
OpenLayers.DOTS_PER_INCH = 72;

// Ext
Ext.QuickTips.init();

OpenLayers.ImgPath = "${request.static_url('gpmap:static/lib/cgxp/core/src/theme/img/ol/')}";
Ext.BLANK_IMAGE_URL = "${request.static_url('gpmap:static/lib/cgxp/ext/Ext/resources/images/default/s.gif')}";

// Apply same language than on the server side
OpenLayers.Lang.setCode("${lang}");
GeoExt.Lang.set("${lang}");

// Themes definitions
/* errors (if any): ${themesError | n} */
var THEMES = {
    "local": ${themes | n}
% if external_themes:
    , "external": ${external_themes | n}
% endif
};

% if user and user.role.extent:
var INITIAL_EXTENT = ${user.role.json_extent};
% else:
var INITIAL_EXTENT = [420000, 30000, 900000, 350000];
% endif

var RESTRICTED_EXTENT = [420000, 30000, 900000, 350000];

// Used to transmit event throw the application
var EVENTS = new Ext.util.Observable();

var WMTS_OPTIONS = {
% if len(tilecache_url) == 0:
    url: "${request.route_url('tilecache', path='')}",
% else:
    url: '${tilecache_url}',
% endif
    displayInLayerSwitcher: false,
    requestEncoding: 'REST',
    buffer: 0,
    style: 'default',
    dimensions: ['TIME'],
    params: {
        'time': '2011'
    },
    matrixSet: 'swissgrid',
    maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
    projection: new OpenLayers.Projection("EPSG:21781"),
    units: "m",
    formatSuffix: 'png',
    serverResolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1,0.05],
    getMatrix: function() {
        return { identifier: OpenLayers.Util.indexOf(this.serverResolutions, this.map.getResolution()) };
    }
};

app = new gxp.Viewer({
    portalConfig: {
        items: [config.renderTo + '-map'],
        width: config.width,
        height: config.height,
        renderTo: config.renderTo
    },

    // configuration of all tool plugins for this application
    tools: [
    {
        ptype: "cgxp_disclaimer",
        outputTarget: "map"
    },
    {
        ptype: "cgxp_mapopacityslider"
    },
    {
        ptype: "gxp_zoomtoextent",
        actionTarget: "map.tbar",
        closest: true,
        extent: INITIAL_EXTENT
    },
    {
        ptype: "cgxp_zoom",
        actionTarget: "map.tbar",
        toggleGroup: "maptools"
    },
    {
        ptype: "gxp_navigationhistory",
        actionTarget: "map.tbar"
    }, 
    {
        ptype: "cgxp_measure",
        actionTarget: "map.tbar",
        toggleGroup: "maptools"
    }, 
    {
        ptype: "cgxp_fulltextsearch",
        url: "${request.route_url('fulltextsearch', path='')}",
        actionTarget: "map.tbar"
    },
    {
        ptype: "cgxp_menushortcut",
        type: '->'
    },
    {
        ptype: "cgxp_redlining",
        toggleGroup: "maptools",
        actionTarget: "map.tbar"
    },
    {
        ptype: "cgxp_legend",
        id: "legendPanel",
        toggleGroup: "maptools",
        actionTarget: "map.tbar"
    },
    {
        ptype: "cgxp_menushortcut",
        type: '-'
    }, 
    {
        ptype: "cgxp_menushortcut",
        type: '-'
    }, 
    {
        ptype: "cgxp_help",
        url: "#help-url",
        actionTarget: "map.tbar"
    }],

    // layer sources
    sources: {
        "olsource": {
            ptype: "gxp_olsource"
        }
    },

    // map and layers
    map: {
        id: config.renderTo + '-map', // id needed to reference map in portalConfig above
        xtype: 'cgxp_mappanel',
        projection: "EPSG:21781",
        extent: INITIAL_EXTENT,
        maxExtent: RESTRICTED_EXTENT,
        restrictedExtent: RESTRICTED_EXTENT,
        stateId: "map",
        projection: new OpenLayers.Projection("EPSG:21781"),
        units: "m",
        resolutions: [4000,2000,1000,500,250,100,50,20,10,5,2.5,1,0.5,0.25,0.1,0.05],
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
            new OpenLayers.Control.MousePosition({numDigits: 0}),
        ],
        layers: [{
            source: "olsource",
            type: "OpenLayers.Layer.WMTS",
            args: [Ext.applyIf({
                name: OpenLayers.i18n('ortho'),
                mapserverLayers: 'ortho',
                ref: 'ortho',
                layer: 'ortho',
                formatSuffix: 'jpeg',
                opacity: 0
            }, WMTS_OPTIONS)]
        }, 
        {
            source: "olsource",
            type: "OpenLayers.Layer.WMTS",
            group: 'background',
            args: [Ext.applyIf({
                name: OpenLayers.i18n('plan'),
                mapserverLayers: 'plan',
                ref: 'plan',
                layer: 'plan',
                group: 'background'
            }, WMTS_OPTIONS)]
        }, 
        {
            source: "olsource",
            type: "OpenLayers.Layer",
            group: 'background',
            args: [OpenLayers.i18n('blank'), {
                displayInLayerSwitcher: false,
                ref: 'blank',
                group: 'background'
            }]
        }],
        items: []
    }
});

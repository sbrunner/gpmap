/**
 * Copyright (c) 2012 Stéphane Brunner
 *
 * GPMap is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * GPMap is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CPMap.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @requires plugins/Tool.js
 * @include GeoExt/data/PrintProvider.js
 * @include GeoExt/plugins/PrintProviderField.js
 * @include OpenLayers/Control/Zoom.js
 */

/** api: (define)
 *  module = gpmap.plugins
 *  class = Print
 */

Ext.namespace("gpmap.plugins");

/** api: example
 *  Sample code showing how to add a GPPrint plugin to a
 *  `gxp.Viewer`:
 *
 *  .. code-block:: javascript
 *
 *      new gxp.Viewer({
 *          ...
 *          tools: [{
 *              ptype: "gpmap_gpprint",
 *              actionTarget: "center.tbar",
 *              outputTarget: "main",
 *              toggleGroup: "maptools",
 *              printURL: "${request.route_url('printproxy')}",
 *              scale: true
 *          }]
 *          ...
 *      });
 */


/** api: constructor
 *  .. class:: Login(config)
 *
 *    Provides an action that opens a login form panel.
 */
gpmap.plugins.GPPrint = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gpmap_gpprint */
    ptype: "gpmap_gpprint",

    /** api: config[toggleGroup]
     */
    /** api: config[actionTarget]
     */
    /** api: config[outputTarget]
     */
    /** api: config[printURL]
     */

    provider: null,

    timeout: 120000,

    padding: 15,

    scale: false,

    printText: 'Print',

    /** api: method[addActions]
     */
    addActions: function() {
        this.main = Ext.getCmp(this.outputTarget);
        this.provider = new GeoExt.data.PrintProvider({
            url: this.printURL,
            timeout: this.timeout,
            baseParams: {
                url: this.printURL
            }
        });
        this.provider.loadCapabilities();

        var button = new Ext.Button(Ext.apply({
            text: this.printText,
            handler: this.display,
            scope: this
        }, this.actionConfig));

        this.provider.on('layoutchange', this.layoutchange, this);

        return gpmap.plugins.GPPrint.superclass.addActions.apply(this, [button]);
    },

    layoutchange: function() {
        if (this.panel) {
            this.panel.items.items[0].height = 0;
            this.panel.items.items[2].height = 0;

            var size = this.provider.layout.data.size;
            this.form.width = size.width + 2 * this.padding;
            this.form.setWidth(size.width + 2 * this.padding);
            this.map.setWidth(size.width);
            this.map.setHeight(size.height);
            this.panel.doLayout();
        }
    },

    display: function() {
        var layers = [];
        var scale = this.provider.dpi.get('value');
        var ratio = scale / OpenLayers.DOTS_PER_INCH;
        Ext.each(this.target.mapPanel.map.layers, function (layer) {
            layer = layer.clone()
            if (layer.resolutions && this.scale) {
                var roundedWidth = Math.round(layer.tileSize.w / ratio);
                var ra = layer.tileSize.w / roundedWidth;

                layer.tileSize = new OpenLayers.Size(
                    layer.tileSize.w / ra,
                    layer.tileSize.h / ra
                );

                var originalResolutions = layer.resolutions;
                layer.options.resolutions = [];
                Ext.each(originalResolutions, function (r) {
                    layer.options.resolutions.push(r * ra);
                });
            }
            layers.push(layer);
        }, this);
        this.map = new GeoExt.MapPanel({
            hideLabel: true,
            name: 'extent',
            xtype: 'gs_mappanel',
            layers: layers,
            projection: this.target.mapPanel.map.projection,
            displayProjection: this.target.mapPanel.map.displayProjection,
            extent: this.target.mapPanel.map.getExtent(),
            width: this.provider.layout.data.size.width,
            height: this.provider.layout.data.size.height,
            bodyStyle: {
                'border-color': '#999'
            },
            map: {
                controls: [
                    new OpenLayers.Control.Navigation(),
                    new OpenLayers.Control.KeyboardDefaults(),
                    new OpenLayers.Control.Zoom()
                ]
            }
        });

        var fields = [];
        var hideUnique = this.initialConfig.hideUnique !== false;
        var cbOptions = Ext.apply({
            xtype: "combo",
            typeAhead: true,
            selectOnFocus: true,
            forceSelection: true,
            displayField: "name",
            mode: "local",
            triggerAction: "all",
            width: "200"
        }, this.comboOptions);
        !(hideUnique && this.provider.layouts.getCount() <= 1) && fields.push(Ext.apply({
            fieldLabel: "Layout",
            store: this.provider.layouts,
            plugins: new GeoExt.plugins.PrintProviderField({
                printProvider: this.provider
            })
        }, cbOptions));
        !(hideUnique && this.provider.dpis.getCount() <= 1) && fields.push(Ext.apply({
            fieldLabel: "DPI",
            store: this.provider.dpis,
            plugins: new GeoExt.plugins.PrintProviderField({
                printProvider: this.provider
            })
        }, cbOptions));
        fields.push({
            fieldLabel: 'Title',
            name: 'title',
            plugins: new GeoExt.plugins.PrintProviderField({
                printProvider: this.provider
            }),
            width: "200",
        });
        fields.push({
            fieldLabel: 'Comments',
            name: 'comment',
            xtype: 'textarea',
            plugins: new GeoExt.plugins.PrintProviderField({
                printProvider: this.provider
            }),
            width: "200",
            maxLength: "100"
        });
        fields.push(this.map);

        this.panel = this.main.add({
            autoScroll: true,
            layout: 'hbox',
            unstyled: true,
            style: {
                'background-color': 'lightgrey'
            },
            bodyStyle: {
                'padding': this.padding + 'px'
            }
        });
        this.panel.add({
            flex: 1,
            unstyled: true
        });
        this.form = this.panel.add({
            flex: 0,
            width: this.provider.layout.data.size.width + 2 * this.padding,
            xtype: 'form',
            unstyled: true,
            cls: 'print',
            style: {
                'padding-bottom': this.padding + 'px',
                'padding-bottom': 0
            },
            bodyStyle: {
                'border': 'solid 1px black',
                'padding': this.padding + 'px',
                'background-color': 'white'
            },
            labelSeparator: '',
            defaults: Ext.apply({
                xtype: 'textfield'
            }, this.defaults),
            items: fields,
            buttons: [{
                text: "Cancel",
                handler: this.close,
                scope: this
            }, {
                text: "Print",
                handler: this.print,
                scope: this
            }]
        });
        this.panel.add({
            flex: 1,
            unstyled: true
        });
        this.main.layout.setActiveItem(1);
        this.panel
    },

    print: function() {
        this.provider.print(this.target.mapPanel, {
            feature: {},
            center: this.map.map.getCenter(),
            scale: new Ext.data.Record({value: Math.round(this.map.map.getScale())}),
            rotation: 0
        }, {});
        this.close();
    },

    close: function() {
        this.main.remove(this.panel, true);
        this.main.layout.setActiveItem(0);
        this.panel = null;
        this.map = null;
        this.form = null;
    }
});
Ext.preg(gpmap.plugins.GPPrint.prototype.ptype, gpmap.plugins.GPPrint);

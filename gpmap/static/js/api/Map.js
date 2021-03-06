/**
 * Copyright (c) 2011 Camptocamp
 *
 * You can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License.
 * If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * @requires CGXP/api/Map.js
 */

Ext.namespace('gpmap');

gpmap.Map = Ext.extend(cgxp.api.Map, {

    /**
     * Constructor
     * see apihelp.html page to see hoe to use the API.
     */
    constructor: function(config) {
        this.superclass().constructor.call(this, config);

        // project API
    },

    /**
     * Method: initializeViewer
     * Initialize the gxp viewer
     */
    initializeViewer: function(viewerConfig, apiConfig) {
        Ext.apply(this, API.getConfig(viewerConfig));
    }
});


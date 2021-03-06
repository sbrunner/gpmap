% if debug:
    <%!
    from jstools.merge import Merger
    %>
    <%
    jsbuild_cfg = request.registry.settings.get('jsbuild_cfg')
    jsbuild_root_dir = request.registry.settings.get('jsbuild_root_dir')
    %>
    % for script in Merger.from_fn(jsbuild_cfg.split(), root_dir=jsbuild_root_dir).list_run(['api.js', 'lang-%s.js' % lang]):
        document.write('<script type="text/javascript" src="'
                + "${request.static_url(script.replace('/', ':', 1))}" + '"></script>');
    % endfor

    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/ext/Ext/resources/css/ext-all.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/ext/Ext/resources/css/xtheme-gray.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/openlayers/theme/default/style.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/geoext/resources/css/gxtheme-gray.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/geoext.ux/ux/Measure/resources/css/measure.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/sandbox/FeatureEditing/resources/css/feature-editing.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/styler/theme/css/styler.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/gxp/src/theme/all.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/lib/cgxp/core/src/theme/all.css')}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/css/proj.css')}" + '" />');

% else:
    document.write('<scr' + 'ipt type="text/javascript" src="'
            + "${request.static_url('gpmap:static/build/api.js')}" + '"></scr' + 'ipt>');
% if lang != 'en':
    document.write('<scr' + 'ipt type="text/javascript" src="'
            + "${request.static_url('gpmap:static/build/lang-%s.js' % lang)}" + '"></scr' + 'ipt>');
% endif
    document.write('<link rel="stylesheet" type="text/css" href="'
            + "${request.static_url('gpmap:static/build/app.css')}" + '" />');
% endif

API = {};
API.getConfig = function(config) {
    <%include file="apiviewer.js" />
    return {
        viewer: app,
        mapserverproxyURL: "${request.route_url('mapserverproxy', path='')}",
        themes: THEMES 
    };
}

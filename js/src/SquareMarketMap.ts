/* Copyright 2015 Bloomberg Finance L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as widgets from '@jupyter-widgets/base';
import * as d3 from 'd3';
// var d3 =Object.assign({}, require("d3-hierarchy"), require("d3-scale"), require("d3-selection"));
import _ from 'underscore';

export const SquareMarketMap = widgets.DOMWidgetView.extend({

    render: function() {
        this.width = this.model.get("width");
        this.height = this.model.get("height");
        this.margin = this.model.get('margin');

        this.el.style["width"] = this.width + this.margin.left + this.margin.right;
        this.el.style["height"] = this.height + this.margin.top + this.margin.bottom;

        var sector_data = this.model.get('data');
        this.colors = this.model.get('colors');
        this.mode = this.model.get('mode');

        var color= d3.scaleOrdinal(d3.schemeCategory10);
        this.d3el.append("div")
            .style("position", "relative")
            .style("width", (this.width + this.margin.left + this.margin.right) + "px")
            .style("height", (this.height + this.margin.top + this.margin.bottom) + "px")
            .style("left", this.margin.left + "px")
            .style("top", this.margin.top + "px");

        this.margin = this.model.get("margin");

        // TODO: it seems we have to rewrite this code for d3 v5. `sticky` and `mode` are not the same anymore.
        this.tree_map = d3.treemap()
            .size([this.width, this.height])
            // .sticky(true)
            .padding(null)
            // .mode(this.mode)
            // .value(function(d) {return d.size;});
            ;

        this.d3el.datum(sector_data).selectAll(".node")
            .data(this.tree_map.nodes)
            .enter().append("div")
            .attr("class", "node")
            .call(this.position)
            .styles({
                "background": function(d, i) {
                    return d.children ? color(d.name): null;
                },
                "border": "solid white"
            })
            .text(function(d) { return d.children ? null : d.name; })
            .styles({
                'font': '11px sans-serif',
                'position': 'absolute',
                'text-align': 'center',
                'overflow': 'hidden',
                'color': 'white',
            });
    },

    position: function(){
        this.style("left", function(d) { return d.x + "px"; })
            .style("top", function(d) { return d.y + "px"; })
            .style("width", function(d) {
                return Math.max(0, d.dx - 1) + "px";
            })
            .style("height", function(d) {
                return Math.max(0, d.dy - 1) + "px";
            });
    }
});

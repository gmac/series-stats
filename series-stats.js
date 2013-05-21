// Series Stats: statistics & utilities for mapping and visualization.
// [1] Equal / Quantile: https://github.com/simogeo/geostats
// [2] Jenks: http://danieljlewis.org/files/2010/06/Jenks.pdf
// Assembled by Greg MacWilliam, Threespot.
(function(root) {
	'use strict';
	
	function sortAsc(a, b) {
		return a-b;
	}
	
	function sortDes(a, b) {
		return b-a;
	}
	
	function jenksClass(classes) {
		var i = 0;
		var set = [];
		while (i++ <= classes) set.push(0);
		return set;
	}

	function jenksMatrix(size, classes) {
		var mtx = [];
		for (var i = 0; i <= size; i++){
			mtx.push(jenksClass(classes));
		}
		return mtx;
	}
	
	var ss = {
		// Finds the minimum value within a series array:
		min: function(series) {
			return Math.min.apply(Math, series);
		},
		
		// Finds the maximum value within a series array:
		max: function(series) {
			return Math.max.apply(Math, series);
		},
		
		// Totals the sum of a series array:
		sum: function(series) {
			var t = 0;
			for (var i = series.length-1; i >= 0; i--) t += series[i];
			return t;
		},
		
		// Calculates the mean (average) of a series array:
		mean: function(series) {
			return ss.sum(series) / series.length;
		},
		
		// Performs a numeric sort on the series array:
		sort: function(series, descending) {
			return series.sort(descending ? sortDes : sortAsc);
		},
		
		// Plots a value's index within a breaks series:
		plot: function(series, val, descending) {
			if (descending) {
				for (var i = series.length-1; i >= 0; i--) {
					if (val >= series[i]) return i;
				}
			} else {
				for (var i = 0, len = series.length-1; i < len; i++) {
					if (val <= series[i]) return i-1;
				}
			}
			return -1;
		},

		// Returns equally-sized class breaks distributed evenly across the range of series values:
		equalBreaks: function(series, numClasses) {
			var breaks = [];
			var low = ss.min(series);
			var interval = (ss.max(series) - low) / numClasses;
			
			for (var i = 0; i <= numClasses; i++) {
				breaks.push(low);
				low += interval;
			}

			return breaks;
		},
		
		// Returns unevenly-sized classes distributed at even intervals across the series of values:
		quantileBreaks: function(series, numClasses) {
			series.sort(sortAsc);
			var breaks = [];
			var inc = (series.length-1) / numClasses;

			for (var i = 0; i <= numClasses; i++) {
				breaks.push( series[ Math.round(i * inc) ] );
			}

			return breaks;
		},
		
		// Returns unevenly-sized classes distributed at at uneven intervals across the series of values:
		// Breaks are distributed around concentrations of values within the series.
		jenksBreaks: function(series, numClasses) {
			var k = series.length;
			var kclass = jenksClass(numClasses);
			var mat1 = jenksMatrix(k, numClasses);
			var mat2 = jenksMatrix(k, numClasses);

			// Sort the data list from small to large:
			series.sort(sortAsc);

			// Return original data set for lists smaller than number of classes:
			if (k < numClasses+1) return series.slice();

			// Set thresholds:
			for (var y=1; y <= numClasses; y++) {
				mat1[0][y] = 1;
				mat2[0][y] = 0;
				for (var t=1; t <= k; t++) mat2[t][y] = Infinity;
			}

			// Adjust for min deviation and max separation:
			var v = 0.0;
			for (var l = 2; l <= k; l++) {
				var s1 = 0.0;
				var s2 = 0.0;
				var w = 0.0;

				for (var m = 1; m <= l; m++) {
					var i3 = l - m + 1;
					var val = parseFloat(series[i3-1]);
					s2 += val * val;
					s1 += val;
					w += 1;
					v = s2 - (s1 * s1) / w;
					var i4 = i3 - 1;

					if (i4 !== 0) {
						for (var p = 2; p <= numClasses; p++) {
							if (mat2[l][p] >= v + mat2[i4][p-1]) {
								mat2[l][p] = v + mat2[i4][p-1];
								mat1[l][p] = i3;
							}
						}
					}
				}

				mat1[l][1] = 1;
				mat2[l][1] = v;
			}

			// Set min and max class values:
			kclass[0] = parseFloat(series[0]);
			kclass[numClasses] = parseFloat(series[k-1]);
			
			var count = numClasses;
			while (count > 1) {
	            kclass[count - 1] = series[ mat1[k][count]-2 ];
	            k = mat1[k][count]-1;
	            count--;
	        }

			// Default flat bottom set to start at 0:
			if (kclass[0] === kclass[1]) kclass[0] = 0;
			return kclass;
		}
	};
	
	if (typeof module !== 'undefined') {
		module.exports = ss;
	} else if (typeof define === 'function' && define.amd) {
		define(ss);
	} else {
		root.Series = ss;
	}
	
}(this));